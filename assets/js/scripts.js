/*
  Liberty Gaming - Halo CE Website
  Developer: Jericho Crosby / Chalwk
  Copyright (c) 2026 Liberty Gaming - Halo CE. All rights reserved.
  This file is part of the proprietary Liberty Gaming website.
  Use, copying, or distribution without permission is strictly prohibited.
*/

document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.querySelector('.nav-toggle button');
    const mainNav = document.querySelector('.main-nav');

    function closeAllDropdowns() {
        document.querySelectorAll('.dropdown.open').forEach(drop => {
            drop.classList.remove('open');
            const toggle = drop.querySelector('.dropdown-toggle');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
    }

    function closeMobileNav() {
        if (mainNav && mainNav.classList.contains('show')) {
            mainNav.classList.remove('show');
            closeAllDropdowns();
        }
    }

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('show');
            if (!mainNav.classList.contains('show')) {
                closeAllDropdowns();
            }
        });
    }

    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();

            const parentLi = this.closest('.dropdown');
            if (!parentLi) return;
            const isOpen = parentLi.classList.contains('open');
            closeAllDropdowns();
            if (!isOpen) {
                parentLi.classList.add('open');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Close the mobile nav (and any open dropdowns) when tapping/clicking outside.
    function handleOutsideInteraction(e) {
        if (!e.target.closest('.main-nav') && !e.target.closest('.nav-toggle')) {
            closeMobileNav();
        }
        if (!e.target.closest('.dropdown')) {
            closeAllDropdowns();
        }
    }

    document.addEventListener('pointerdown', handleOutsideInteraction);
    document.addEventListener('touchstart', handleOutsideInteraction, { passive: true });

    function handleResize() {
        if (window.innerWidth > 768) {
            closeAllDropdowns();
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    const scrollBtn = document.createElement('button');
    scrollBtn.id = 'scrollToTopBtn';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

window.shareOn = function (platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    let shareUrl = '';

    switch (platform) {
        case 'discord':
            alert('Share this link on Discord: ' + window.location.href);
            return;
        case 'youtube':
            window.open('https://youtube.com');
            return;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            break;
        case 'email':
            window.location.href = `mailto:?subject=${title}&body=${url}`;
            return;
        default:
            return;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
};