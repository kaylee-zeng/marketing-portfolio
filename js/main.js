/**
 * Marketing Portfolio — Main JavaScript
 * Scroll animations, mobile navigation, smooth scroll, AI View toggle
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinkItems = document.querySelectorAll('.nav-link');
    const revealElements = document.querySelectorAll('.reveal');

    // --- Sticky Nav: add border on scroll ---
    function updateNav() {
        if (window.scrollY > 10) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();

    // --- Mobile Menu Toggle ---
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // --- Intersection Observer for scroll reveal ---
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Smooth scroll for all anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = nav.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Active nav link on scroll ---
    const sections = document.querySelectorAll('section[id]');

    function updateActiveLink() {
        const scrollPos = window.scrollY + nav.offsetHeight + 100;

        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinkItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });

    // --- Active style for nav links ---
    const activeStyle = document.createElement('style');
    activeStyle.textContent = `.nav-link.active { color: var(--color-accent); }`;
    document.head.appendChild(activeStyle);

    // --- AI View toggle: click to open, click anywhere to close ---
    const viewToggles = document.querySelectorAll('.view-toggle');
    let currentOpen = null; // track currently open expand element

    viewToggles.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent immediate close on document click
            const targetId = button.getAttribute('data-target');
            const expandEl = document.getElementById(targetId);

            if (!expandEl) return;

            // Close previously open element
            if (currentOpen && currentOpen !== expandEl) {
                currentOpen.classList.remove('visible');
                const prevBtn = document.querySelector(`[data-target="${currentOpen.id}"]`);
                if (prevBtn) prevBtn.textContent = 'View';
            }

            // Toggle current
            const isVisible = expandEl.classList.contains('visible');
            if (isVisible) {
                expandEl.classList.remove('visible');
                button.textContent = 'View';
                currentOpen = null;
            } else {
                expandEl.classList.add('visible');
                button.textContent = 'View';
                currentOpen = expandEl;
            }
        });
    });

    // Click anywhere outside to close
    document.addEventListener('click', () => {
        if (currentOpen) {
            currentOpen.classList.remove('visible');
            const btn = document.querySelector(`[data-target="${currentOpen.id}"]`);
            if (btn) btn.textContent = 'View';
            currentOpen = null;
        }
    });

    // --- Lightbox zoom for AI images ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    document.querySelectorAll('.ai-img').forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('visible');
            document.body.style.overflow = 'hidden';
        });
    });

    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('visible');
        document.body.style.overflow = '';
    });

});
