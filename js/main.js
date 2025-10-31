document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    const navbar = document.querySelector('.navbar');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        document.addEventListener('click', (event) => {
            const isClickInside = navLinks.contains(event.target) || menuToggle.contains(event.target);
            if (!isClickInside) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });

        navItems.forEach((item) => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (!targetEl) return;
            event.preventDefault();
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Navbar scroll state
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const current = window.pageYOffset;
        if (navbar) {
            if (current > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        lastScroll = current;
    });

    // Active nav highlight using IntersectionObserver
    const sectionTargets = Array.from(navItems)
        .map((item) => document.querySelector(item.getAttribute('href')))
        .filter((section) => section instanceof HTMLElement);

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navItems.forEach((item) => {
                    item.classList.toggle('active', item.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { threshold: 0.45 });

    sectionTargets.forEach((section) => sectionObserver.observe(section));

    // Counters
    const counters = document.querySelectorAll('.counter[data-counter-target]');
    const runCounter = (counter) => {
        const target = Number(counter.getAttribute('data-counter-target')); 
        const isLarge = target > 500;
        const duration = isLarge ? 2000 : 1500;
        const startTime = performance.now();

        const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const value = Math.floor(progress * target);
            counter.textContent = value.toLocaleString();
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    };

    if (counters.length) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    runCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach((counter) => counterObserver.observe(counter));
    }

    // Carousel functionality
    document.querySelectorAll('[data-carousel]').forEach((carousel) => {
        const track = carousel.querySelector('.carousel-track');
        const items = carousel.querySelectorAll('.carousel-item');
        const prev = carousel.querySelector('.carousel-control.prev');
        const next = carousel.querySelector('.carousel-control.next');
        let index = 0;

        const update = () => {
            if (!track) return;
            track.style.transform = `translateX(-${index * 100}%)`;
        };

        const showPrev = () => {
            index = (index - 1 + items.length) % items.length;
            update();
        };

        const showNext = () => {
            index = (index + 1) % items.length;
            update();
        };

        prev?.addEventListener('click', showPrev);
        next?.addEventListener('click', showNext);

        // Keyboard support
        carousel.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                showPrev();
            }
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                showNext();
            }
        });
    });

    // Evidence modal
    const modal = document.getElementById('evidence-modal');
    const modalFrame = modal?.querySelector('iframe');
    const closeTargets = modal?.querySelectorAll('[data-modal-close]') || [];

    const openModal = (src) => {
        if (!modal || !modalFrame) return;
        modalFrame.src = src;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
    };

    const closeModal = () => {
        if (!modal || !modalFrame) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        modalFrame.src = '';
    };

    closeTargets.forEach((btn) => btn.addEventListener('click', closeModal));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });

    const evidenceLinks = document.querySelectorAll('.evidence-link, .evidence-trigger');
    evidenceLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const preview = link.getAttribute('data-preview');
            if (!preview) return;
            event.preventDefault();
            openModal(preview);
        });
    });

    // Contact form placeholder handler
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('Thank you! Your message has been noted. Expect a response within 72 hours.');
            contactForm.reset();
        });
    }

    // Intersection reveal utility
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.achievement-block, .activity-card, details, .metric').forEach((el) => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    if (window.AOS) {
        window.AOS.init({
            once: false,
            duration: 700,
            easing: 'ease-out-cubic'
        });
    }
});
