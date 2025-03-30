document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    // Mobile Menu
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
});

function setupContactForm() {
    const form = document.querySelector('.contact__form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    
    // Get API URL based on environment
    const API_URL = getApiUrl();
    
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        // Validate form
        const nameInput = this.querySelector('input[type="text"]');
        const emailInput = this.querySelector('input[type="email"]');
        const messageInput = this.querySelector('textarea');
        
        if (!validateForm(nameInput, emailInput, messageInput)) {
            return;
        }
        
        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        const formData = {
            name: nameInput.value,
            email: emailInput.value,
            message: messageInput.value
        };
        
        try {
            let response = await fetch(`${API_URL}/contact`, { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            
            let result = await response.json();
            
            if (response.ok) {
                showNotification(result.success, 'success');
                form.reset();
            } else {
                showNotification(result.error, 'error');
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
    input.addEventListener('input', function() {
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

function getApiUrl() {
    // Determine if we're in production based on the URL
    const isProduction = window.location.hostname !== 'localhost' && 
                         !window.location.hostname.includes('127.0.0.1');
    
    //determines which api url to use based on the environment (production or development)
    return isProduction 
    ? 'https://smddevelopers.onrender.com'
    : 'http://localhost:5050';
}