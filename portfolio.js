'use strict';

/* ------------------------------------
   DOM ELEMENTS
------------------------------------ */
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navbar = document.getElementById('navbar');
const contactForm = document.getElementById('contact-form');
const navbarToggle = document.querySelector('.navbar-toggle');

/* ------------------------------------
   MOBILE NAVIGATION
------------------------------------ */
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close when clicking links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('active');
        if (navToggle) navToggle.classList.remove('active');
    });
});

// Additional navbar toggle
navbarToggle.addEventListener('click', (e) => {
  navMenu.classList.toggle('active');
  navbarToggle.style.display = 'none';
  e.stopPropagation();
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (navMenu.classList.contains('active') && !navMenu.contains(e.target)) {
    navMenu.classList.remove('active');
    navbarToggle.style.display = 'block';
  }
});

// Close menu when clicking menu items
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    navbarToggle.style.display = 'block';
  });
});

/* ------------------------------------
   NAVBAR SCROLL EFFECT
------------------------------------ */
function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
}

/* ------------------------------------
   SMOOTH SCROLLING
------------------------------------ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            const navHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = target.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/* ------------------------------------
   INTERSECTION OBSERVER ANIMATIONS
------------------------------------ */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('animate');

        if (entry.target.classList.contains('skill-progress')) {
            const width = entry.target.getAttribute('data-width') || '0%';
            setTimeout(() => { entry.target.style.width = width; }, 200);
        }

        if (entry.target.classList.contains('stat-number')) {
            animateCounter(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-progress, .stat-number, .timeline-item, .project-card, .tech-item')
        .forEach(el => observer.observe(el));

/* ------------------------------------
   COUNTER ANIMATION
------------------------------------ */
function animateCounter(element) {
    if (!element || element.dataset.animated === 'true') return;

    element.dataset.animated = 'true';
    const target = parseInt(element.getAttribute('data-target')) || 0;
    const duration = 2000;
    const steps = Math.max(Math.round(duration / 16), 1);
    const increment = target / steps;

    let current = 0, stepCount = 0;

    const timer = setInterval(() => {
        stepCount++;
        current += increment;
        if (stepCount >= steps) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/* ------------------------------------
   EMAIL VALIDATION
------------------------------------ */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/* ------------------------------------
   NOTIFICATION SYSTEM
------------------------------------ */
function showNotification(message, type = 'info') {

    const existingNotification = document.querySelector('.notification');
    if (existingNotification) existingNotification.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    const bg = (type === 'success') ? '#10b981'
            : (type === 'error' ? '#ef4444' : '#3b82f6');

    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${bg};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;

    document.body.appendChild(notification);

    const contentEl = notification.querySelector('.notification-content');
    if (contentEl) {
        contentEl.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        `;
    }

    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        closeBtn.addEventListener('click', () => {
            removeNotification(notification);
        });
    }

    setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 100);
    setTimeout(() => { removeNotification(notification); }, 5000);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => notification?.remove(), 300);
}

/* ------------------------------------
   PARALLAX EFFECT
------------------------------------ */
function parallaxEffect() {
    const heroSection = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    if (!heroSection || !heroContent) return;

    function applyParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroContent.style.transform = `translateY(${rate}px)`;
    }

    const debouncedParallax = debounce(applyParallax, 12);
    window.addEventListener('scroll', debouncedParallax);
}

/* ------------------------------------
   SCROLL TO TOP BUTTON
------------------------------------ */
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.className = 'scroll-to-top';

    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        color: white;
        cursor: pointer;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        font-size: 1.2rem;
    `;

    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ------------------------------------
   DEBOUNCE
------------------------------------ */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/* ------------------------------------
   SCROLL HANDLER
------------------------------------ */
const debouncedScrollHandler = debounce(() => {
    handleNavbarScroll();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

/* ------------------------------------
   DOM LOADED
------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
    typeEffect();
    parallaxEffect();
    document.body.classList.add('loaded');
    createScrollToTopButton();

    document.querySelectorAll('.skill-progress').forEach(sp => {
        const rect = sp.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            const width = sp.getAttribute('data-width') || '0%';
            sp.style.width = width;
        }
    });
});

/* ------------------------------------
   PAGE LOAD ANIMATIONS
------------------------------------ */
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) loader.classList.add('hidden');

    setTimeout(() => {
        document.querySelectorAll('.hero-text > *').forEach((el, index) => {
            el.style.animationDelay = `${index * 0.2}s`;
            el.classList.add('fade-in-up');
        });
    }, 500);
});

/* ------------------------------------
   CONTACT FORM (EMAILJS)
------------------------------------ */
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const formObject = Object.fromEntries(formData);

        if (validateForm(formObject)) {

            emailjs.send("service_z4w1jv3", "template_qwaqgbi", {
                from_name: formObject.name,
                reply_to: formObject.email,
                subject: formObject.subject,
                message: formObject.message
            })
            .then(() => {
                showNotification('Message sent successfully! Check your inbox.', 'success');
                contactForm.reset();
            })
            .catch((error) => {
                console.error("EmailJS Error:", error);
                showNotification('Failed to send message. Try again later.', 'error');
            });
        }
    });
}

navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");   
    navMenu.classList.toggle("show");      
});

