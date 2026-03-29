document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('header.header');
    if (!header) return;

    const pathSegments = window.location.pathname.split('/');
    const isInPages = pathSegments.includes('pages');
    const basePath = isInPages ? '../' : './';

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const headerTop = document.createElement('div');
    headerTop.className = 'header-top';

    const logoImg = document.createElement('img');
    logoImg.src = `${basePath}images/liberty-logo-transparent.png`;
    logoImg.alt = 'Liberty Gaming Logo';
    logoImg.className = 'header-logo';
    logoImg.addEventListener('error', function () {
        this.src = `${basePath}images/placeholder-logo.png`;
    });

    const headerTitle = document.createElement('h1');
    headerTitle.textContent = 'Liberty Gaming - Halo CE';
    headerTitle.style.fontFamily = 'var(--font-header), sans-serif';

    headerTop.appendChild(logoImg);
    headerTop.appendChild(headerTitle);
    header.appendChild(headerTop);

    const mainNav = document.createElement('nav');
    mainNav.className = 'main-nav';
    mainNav.setAttribute('aria-label', 'Main navigation');
    mainNav.innerHTML = `
        <ul>
          <li><a href="${basePath}index.html" class="nav-link">Home</a></li>
          <li><a href="${basePath}pages/servers.html" class="nav-link">Servers</a></li>
          <li><a href="${basePath}pages/community.html" class="nav-link">Community</a></li>
          <li><a href="${basePath}pages/members.html" class="nav-link">Members</a></li>
          <li><a href="${basePath}pages/community-rules.html" class="nav-link">Community Rules</a></li>
          <li><a href="${basePath}pages/resources.html" class="nav-link">Resources</a></li>
          <li><a href="${basePath}pages/contact.html" class="nav-link">Contact</a></li>
        </ul>
    `;
    header.appendChild(mainNav);
    const toggleDiv = document.createElement('div');
    toggleDiv.className = 'nav-toggle';
    toggleDiv.innerHTML = '<button aria-label="Toggle navigation"><i class="fas fa-bars"></i></button>';
    headerTop.after(toggleDiv);

    const toggleButton = toggleDiv.querySelector('button');
    toggleButton.addEventListener('click', () => {
        mainNav.classList.toggle('show');
    });

    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('show');
        });

        const linkHref = link.getAttribute('href').split('/').pop();
        if (linkHref === currentPage) {
            link.classList.add('active');
        }
    });

    if (!document.querySelector('footer')) {
        const footer = document.createElement('footer');
        footer.innerHTML = `
            <p class="footer-copyright"></p>
            <div class="social-share">
                <a href="#" onclick="shareOn('discord'); return false;" class="social-icon" aria-label="Discord"><i class="fab fa-discord"></i></a>
                <a href="#" onclick="shareOn('youtube'); return false;" class="social-icon" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                <a href="#" onclick="shareOn('twitter'); return false;" class="social-icon" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                <a href="#" onclick="shareOn('email'); return false;" class="social-icon" aria-label="Email"><i class="fas fa-envelope"></i></a>
            </div>
        `;
        document.body.appendChild(footer);
    }

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
        window.scrollTo({top: 0, behavior: 'smooth'});
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