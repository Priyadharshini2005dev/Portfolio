'use strict';

// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navbar = document.getElementById('navbar');
const contactForm = document.getElementById('contact-form');

// Mobile Navigation Toggle
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('active');
        if (navToggle) navToggle.classList.remove('active');
    });
});

// Navbar Scroll Effect (we'll use a debounced handler below)
function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Smooth Scrolling for Navigation Links
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

// Animate elements when they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');

            // Special handling for skill bars
            if (entry.target.classList && entry.target.classList.contains('skill-progress')) {
                const width = entry.target.getAttribute('data-width') || '0%';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 200);
            }

            // Special handling for stat numbers
            if (entry.target.classList && entry.target.classList.contains('stat-number')) {
                animateCounter(entry.target);
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.skill-progress, .stat-number, .timeline-item, .project-card, .tech-item').forEach(el => {
    observer.observe(el);
});

// Counter Animation for Statistics
function animateCounter(element) {
    if (!element) return;
    // prevent double animation
    if (element.dataset.animated === 'true') return;
    element.dataset.animated = 'true';

    const target = parseInt(element.getAttribute('data-target')) || 0;
    const duration = 2000; // 2 seconds
    const steps = Math.max(Math.round(duration / 16), 1); // roughly 60fps
    const increment = target / steps;
    let current = 0;
    let stepCount = 0;

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

// Contact Form Handling (guard in case form not present)
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const formObject = Object.fromEntries(formData);

        // Simple validation
        if (validateForm(formObject)) {
            // Simulate form submission
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.reset();
        }
    });
}

// Form Validation
function validateForm(data) {
    const { name, email, subject, message } = data;

    if (!name || !name.trim()) {
        showNotification('Please enter your name.', 'error');
        return false;
    }

    if (!email || !email.trim() || !isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }

    if (!subject || !subject.trim()) {
        showNotification('Please enter a subject.', 'error');
        return false;
    }

    if (!message || !message.trim()) {
        showNotification('Please enter a message.', 'error');
        return false;
    }

    return true;
}

// Email Validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles (inline so it works without extra CSS)
    const bg = (type === 'success') ? '#10b981' : (type === 'error' ? '#ef4444' : '#3b82f6');
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

    // Append to page first so querySelector below works reliably
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
    }

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 5 seconds
    const autoRemove = setTimeout(() => {
        removeNotification(notification);
    }, 5000);

    // Manual close
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoRemove);
            removeNotification(notification);
        });
    }
}

function removeNotification(notification) {
    if (!notification) return;
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Typing Effect for Hero Section
// function typeEffect() {
//     const textElement = document.querySelector('.hero-subtitle');
//     if (!textElement) return;

//     const texts = [
//         'Full Stack Developer & UI/UX Designer',
//         'React & Node.js Specialist',
//         'Creative Problem Solver',
//         'Digital Innovation Enthusiast'
//     ];

    // let textIndex = 0;
    // let charIndex = 0;
    // let isDeleting = false;

    // function type() {
    //     const currentText = texts[textIndex];

    //     if (isDeleting) {
    //         textElement.textContent = currentText.substring(0, charIndex - 1);
    //         charIndex--;
    //     } else {
    //         textElement.textContent = currentText.substring(0, charIndex + 1);
    //         charIndex++;
    //     }

    //     let typeSpeed = isDeleting ? 50 : 100;

    //     if (!isDeleting && charIndex === currentText.length) {
    //         typeSpeed = 2000; // Pause at end
    //         isDeleting = true;
    //     } else if (isDeleting && charIndex === 0) {
    //         isDeleting = false;
    //         textIndex = (textIndex + 1) % texts.length;
    //         typeSpeed = 500; // Pause before starting new text
    //     }

    //     setTimeout(type, typeSpeed);
    // }

    // Start typing effect after 1 second
//     setTimeout(type, 1000);
// }

// Parallax Effect for Hero Section (debounced)
function parallaxEffect() {
    const heroSection = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    if (!heroSection || !heroContent) return;

    function applyParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroContent.style.transform = `translateY(${rate}px)`;
    }

    // debounce the parallax to avoid heavy layout thrashing
    const debouncedParallax = debounce(applyParallax, 12);
    window.addEventListener('scroll', debouncedParallax);
}

// Scroll to Top Button
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

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });

    // Scroll to top functionality
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Performance optimization - Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced scroll handler to update navbar (and other scroll-tied things)
const debouncedScrollHandler = debounce(() => {
    handleNavbarScroll();
}, 10);

// Attach the debounced scroll handler
window.addEventListener('scroll', debouncedScrollHandler);

// Initialize effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    typeEffect();
    parallaxEffect();

    // Add loading animation class to body
    document.body.classList.add('loaded');

    // Initialize scroll-to-top button
    createScrollToTopButton();

    // Trigger skill progress if some are already in view (in case)
    document.querySelectorAll('.skill-progress').forEach(sp => {
        // if already visible, set width
        const rect = sp.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            const width = sp.getAttribute('data-width') || '0%';
            sp.style.width = width;
        }
    });
});

// Loading Animation
window.addEventListener('load', () => {
    // Hide loading spinner if exists
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.classList.add('hidden');
    }

    // Trigger entrance animations
    setTimeout(() => {
        document.querySelectorAll('.hero-text > *').forEach((element, index) => {
            element.style.animationDelay = `${index * 0.2}s`;
            element.classList.add('fade-in-up');
        });
    }, 500);
});
const navbarToggle = document.querySelector('.navbar-toggle');



// Toggle menu open
navbarToggle.addEventListener('click', (e) => {
  navMenu.classList.toggle('active');
  navbarToggle.style.display = 'none'; // hide toggle button when menu opens
  e.stopPropagation(); // prevent bubbling
});

// Close when clicking outside
document.addEventListener('click', (e) => {
  if (navMenu.classList.contains('active') && !navMenu.contains(e.target)) {
    navMenu.classList.remove('active');
    navbarToggle.style.display = 'block'; // show toggle button again
  }
});

// Close when clicking menu items
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    navbarToggle.style.display = 'block';
  });
});