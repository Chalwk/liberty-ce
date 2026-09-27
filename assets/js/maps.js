/*
  Liberty Gaming - Halo CE Website
  Developer: Jericho Crosby / Chalwk
  Copyright (c) 2026 Liberty Gaming - Halo CE. All rights reserved.
  This file is part of the proprietary Liberty Gaming website.
  Use, copying, or distribution without permission is strictly prohibited.
*/

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('map-search');
    const mapsGrid = document.getElementById('maps-grid');
    const searchEmpty = document.querySelector('.search-empty');
    const sortSelect = document.getElementById('map-sort');
    const serverSelect = document.getElementById('map-server');
    const pagination = document.getElementById('maps-pagination');

    // Copy Link buttons on each map card.
    document.querySelectorAll('.copy-link-btn').forEach(btn => {
        const label = btn.querySelector('.copy-link-label');
        const defaultLabel = label ? label.textContent : '';

        btn.addEventListener('click', async () => {
            const url = btn.dataset.url;
            if (!url) return;

            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(url);
                } else {
                    // Fallback for browsers/contexts without the Clipboard API.
                    const temp = document.createElement('textarea');
                    temp.value = url;
                    temp.style.position = 'fixed';
                    temp.style.opacity = '0';
                    document.body.appendChild(temp);
                    temp.select();
                    document.execCommand('copy');
                    document.body.removeChild(temp);
                }

                btn.classList.add('copied');
                if (label) label.textContent = 'Copied!';

                setTimeout(() => {
                    btn.classList.remove('copied');
                    if (label) label.textContent = defaultLabel;
                }, 2000);
            } catch (err) {
                // Clipboard access can fail (permissions, unsupported browser);
                // fail quietly rather than breaking the page.
            }
        });
    });

    if (!mapsGrid) return;

    const cards = Array.from(mapsGrid.querySelectorAll('.map-card'));

    // data-per-page comes from the `per_page` front-matter value on
    // maps.html. 0 (or missing/invalid) means "show everything, no pagination".
    const perPage = parseInt(mapsGrid.dataset.perPage, 10) || 0;

    const validSorts = ['newest', 'oldest', 'name-asc', 'name-desc', 'downloads'];
    const validServers = ['all', 'mix', 'race'];

    // Read initial state from the URL (?q=&sort=&server=&page=) so search
    // results, sorting, server filtering, and page number are all bookmarkable
    // and shareable.
    const initialParams = new URLSearchParams(window.location.search);

    let currentSort = validSorts.includes(initialParams.get('sort')) ? initialParams.get('sort') : 'newest';
    let currentServer = validServers.includes(initialParams.get('server')) ? initialParams.get('server') : 'all';
    let currentPage = parseInt(initialParams.get('page'), 10) || 1;

    if (searchInput && initialParams.get('q')) {
        searchInput.value = initialParams.get('q');
    }

    if (sortSelect) {
        sortSelect.value = currentSort;
    }

    if (serverSelect) {
        serverSelect.value = currentServer;
    }

    function getSortedCards() {
        const sorted = cards.slice();

        switch (currentSort) {
            case 'oldest':
                sorted.sort((a, b) => new Date(a.dataset.published) - new Date(b.dataset.published));
                break;
            case 'name-asc':
                sorted.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
                break;
            case 'name-desc':
                sorted.sort((a, b) => b.dataset.name.localeCompare(a.dataset.name));
                break;
            case 'downloads':
                sorted.sort((a, b) => (parseInt(b.dataset.downloads, 10) || 0) - (parseInt(a.dataset.downloads, 10) || 0));
                break;
            case 'newest':
            default:
                sorted.sort((a, b) => new Date(b.dataset.published) - new Date(a.dataset.published));
        }

        return sorted;
    }

    function cardMatches(card, query) {
        const matchesQuery = !query || card.dataset.name.includes(query);
        const matchesServer = currentServer === 'all' || card.dataset.server === currentServer;
        return matchesQuery && matchesServer;
    }

    function renderPagination(totalPages) {
        if (!pagination) return;

        pagination.innerHTML = '';
        if (totalPages <= 1) return;

        const makeButton = (label, targetPage, options = {}) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'page-btn' + (options.active ? ' active' : '');
            btn.textContent = label;
            if (options.disabled) btn.disabled = true;
            if (options.ariaLabel) btn.setAttribute('aria-label', options.ariaLabel);
            if (options.active) btn.setAttribute('aria-current', 'page');
            btn.addEventListener('click', () => {
                currentPage = targetPage;
                applyFilters(false);
                mapsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            return btn;
        };

        pagination.appendChild(
            makeButton('Prev', currentPage - 1, {
                disabled: currentPage === 1,
                ariaLabel: 'Previous page'
            })
        );

        for (let i = 1; i <= totalPages; i++) {
            pagination.appendChild(
                makeButton(String(i), i, {
                    active: i === currentPage,
                    ariaLabel: `Page ${i}`
                })
            );
        }

        pagination.appendChild(
            makeButton('Next', currentPage + 1, {
                disabled: currentPage === totalPages,
                ariaLabel: 'Next page'
            })
        );
    }

    function updateUrl() {
        const query = searchInput ? searchInput.value.trim() : '';
        const params = new URLSearchParams();

        if (query) params.set('q', query);
        if (currentServer !== 'all') params.set('server', currentServer);
        if (currentSort !== 'newest') params.set('sort', currentSort);
        if (currentPage > 1) params.set('page', String(currentPage));

        const search = params.toString();
        const newUrl = window.location.pathname + (search ? `?${search}` : '') + window.location.hash;
        window.history.replaceState(null, '', newUrl);
    }

    function applyFilters(resetPage) {
        if (resetPage) currentPage = 1;

        // Reorder the actual cards in the grid to match the chosen sort,
        // so the visual left-to-right, top-to-bottom order is correct.
        const sorted = getSortedCards();
        sorted.forEach(card => mapsGrid.appendChild(card));

        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const matching = sorted.filter(card => cardMatches(card, query));

        const totalPages = perPage > 0 ? Math.max(1, Math.ceil(matching.length / perPage)) : 1;
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const start = perPage > 0 ? (currentPage - 1) * perPage : 0;
        const end = perPage > 0 ? start + perPage : matching.length;
        const visibleOnPage = new Set(matching.slice(start, end));

        cards.forEach(card => {
            card.style.display = visibleOnPage.has(card) ? '' : 'none';
        });

        if (searchEmpty) {
            searchEmpty.hidden = matching.length !== 0;
        }

        renderPagination(totalPages);
        updateUrl();
    }

    // Navigate to the page containing the card referenced by the URL hash
    // (used by the "Copy Link" button, which links to #release-<id>).
    function goToHashTarget() {
        if (!window.location.hash) return;
        const targetId = window.location.hash.substring(1); // strip '#'
        const targetCard = document.getElementById(targetId);
        if (!targetCard) return;

        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const matching = getSortedCards().filter(card => cardMatches(card, query));
        const index = matching.indexOf(targetCard);

        if (index !== -1 && perPage > 0) {
            const targetPage = Math.floor(index / perPage) + 1;
            if (targetPage !== currentPage) {
                currentPage = targetPage;
                applyFilters(false); // do not reset the page
            }
        }

        // Scroll to the target card after the grid has been updated.
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => applyFilters(true));
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            currentSort = sortSelect.value;
            applyFilters(true);
        });
    }

    if (serverSelect) {
        serverSelect.addEventListener('change', () => {
            currentServer = serverSelect.value;
            applyFilters(true);
        });
    }

    applyFilters(false);
    goToHashTarget();
    window.addEventListener('hashchange', goToHashTarget);
});