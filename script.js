document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        });
    }

    // Mobile Menu
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Particles.js Initialization
    particlesJS('particles-js', {
        particles: {
            number: { value: 80 },
            color: { value: '#FF4D4D' },
            shape: { type: 'circle' },
            opacity: { value: 0.5 },
            size: { value: 3 },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'repulse' },
                onclick: { enable: true, mode: 'push' },
                resize: true
            }
        },
        retina_detect: true
    });

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Form Submission with validation
    setupContactForm();

    // Pill nav interactions
    const pillNav = document.querySelector('.pill-nav');
    const pillItems = pillNav ? pillNav.querySelectorAll('.pill-item') : [];
    let hoverTimeout = null;

    // Mapping your desired sections to existing page IDs
    const sectionMap = {
        about: 'about',
        skills: 'skills',
        projects: 'projects',
        contact: 'contact'
    };

    if (pillNav && pillItems.length) {
        pillNav.addEventListener('mouseenter', () => {
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
            }
            pillNav.classList.add('expanded');
        });

        pillNav.addEventListener('mouseleave', () => {
            hoverTimeout = setTimeout(() => {
                pillNav.classList.remove('expanded');
            }, 600);
        });

        pillItems.forEach(btn => {
            btn.addEventListener('click', () => {
                pillItems.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const key = btn.getAttribute('data-section');
                const targetId = key && sectionMap[key];
                const target = targetId ? document.getElementById(targetId) || document.querySelector(`#${targetId}`) : null;

                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

                // Collapse after selection
                pillNav.classList.remove('expanded');
            });
        });
    }
});

function setupContactForm() {
    const form = document.querySelector('.contact__form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Validate form
        const nameInput = this.querySelector('input[name="name"]');
        const emailInput = this.querySelector('input[name="email"]');
        const messageInput = this.querySelector('textarea[name="message"]');

        if (!validateForm(nameInput, emailInput, messageInput)) {
            return;
        }

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        // Url encode form data for Netlify
        const formData = new FormData(form);
        const urlEncodedData = new URLSearchParams(formData).toString();

        try {
            let response;
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                // Mock submission for local testing
                console.log('Local environment detected: Mocking Netlify Form submission.');
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
                response = { ok: true, status: 200 };
            } else {
                // Production submission
                response = await fetch("/", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: urlEncodedData
                });
            }

            if (response.ok) {
                showNotification('Message sent successfully!', 'success');
                form.reset();
            } else {
                showNotification('Failed to send message. Please try again.', 'error');
            }
        } catch (error) {
            console.error("Error submitting contact form:", error);
            showNotification("Unable to send message. Please try again later.", 'error');
        } finally {
            // Re-enable button and restore text
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}

function validateForm(nameInput, emailInput, messageInput) {
    let isValid = true;

    // Clear previous errors
    document.querySelectorAll('.form-error').forEach(el => el.remove());

    // Validate name
    if (!nameInput.value.trim()) {
        showInputError(nameInput, 'Please enter your name');
        isValid = false;
    }

    // Validate email
    if (!emailInput.value.trim()) {
        showInputError(emailInput, 'Please enter your email');
        isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
        showInputError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }

    // Validate message
    if (!messageInput.value.trim()) {
        showInputError(messageInput, 'Please enter your message');
        isValid = false;
    }

    return isValid;
}
//basic email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showInputError(input, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--primary)';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '0.25rem';

    input.style.borderColor = 'var(--primary)';
    input.parentNode.insertBefore(errorElement, input.nextSibling);

    // Remove error when input changes
    input.addEventListener('input', function () {
        input.style.borderColor = '';
        const error = input.nextSibling;
        if (error && error.className === 'form-error') {
            error.remove();
        }
    }, { once: true });
}

function showNotification(message, type) {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '5px',
        color: '#fff',
        zIndex: '1000',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease'
    });

    if (type === 'success') {
        notification.style.backgroundColor = '#4CAF50';
    } else {
        notification.style.backgroundColor = 'var(--primary)';
    }

    document.body.appendChild(notification);

    // creates a two step fade out effect for the notification
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// getApiUrl function removed as it is no longer needed for Netlify Forms

// (Reverted) Removed 3D tilt effect to restore original behavior
