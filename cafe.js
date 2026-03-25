// Register GSAP Plugins
try {
    gsap.registerPlugin(ScrollTrigger);
} catch (e) {
    console.warn("GSAP or ScrollTrigger not loaded correctly.");
}

document.addEventListener('DOMContentLoaded', () => {
    // Initializing interactions
    initNavigation();
    initHeroAnimations();
    initRevealAnimations();
    initMagneticButtons();
    initSVGDrawing();
    
    // Aggressive refresh to ensure all triggers are correctly placed
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
});

// 1. Navigation Scroll Behavior
function initNavigation() {
    const nav = document.querySelector('.glass-nav');
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileOverlay = document.getElementById('mobile-overlay');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            if (mobileOverlay) mobileOverlay.classList.toggle('active');
            document.body.style.overflow = mobileToggle.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close overlay on link click
    if (mobileOverlay) {
        const links = mobileOverlay.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

// 2. Hero Section Parallax and Reveals
function initHeroAnimations() {
    if (document.querySelector('.hero-parallax-img')) {
        gsap.to('.hero-parallax-img', {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }

    const heroTl = gsap.timeline();
    heroTl.from('.title-line', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'expo.out'
    })
    .from('.hero-subtext', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.8')
    .from('.hero-actions .btn', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    }, '-=0.6');
}

// 3. Staggered Reveal for Sections and Cards
function initRevealAnimations() {
    // General reveals
    const revealElements = document.querySelectorAll('.reveal-up:not(.menu-card)');
    revealElements.forEach((el) => {
        gsap.from(el, {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 95%', 
                toggleActions: 'play none none none'
            }
        });
    });

    // Robust reveal for menu cards
    const menuCards = document.querySelectorAll('.menu-card');
    if (menuCards.length > 0) {
        gsap.from(menuCards, {
            y: 60,
            opacity: 0,
            scale: 0.9,
            duration: 1.2,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.menu-items-fluid',
                start: 'top 90%',
                toggleActions: 'play none none none'
            }
        });
    }
}

// 4. Magnetic Button Interaction
function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.35, y: y * 0.35, duration: 0.4, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
        });
    });
}

// 5. SVG Line Drawing Transition
function initSVGDrawing() {
    const paths = document.querySelectorAll('.draw-line');
    paths.forEach((path) => {
        gsap.to(path, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: path,
                start: 'top 95%',
                end: 'bottom 5%',
                scrub: 1
            }
        });
    });
}

// Newsletter Handling
function handleNewsletterSignup(event) {
    event.preventDefault();
    const message = event.target.querySelector('#newsletter-message');
    if (message) {
        message.innerText = "Welcome to the Spice Route. Exclusive updates await.";
        message.classList.remove('hidden');
    }
    event.target.reset();
}