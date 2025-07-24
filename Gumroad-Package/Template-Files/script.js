// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navbar = document.getElementById('navbar');
const contactForm = document.getElementById('contact-form');

// DragManager - Handles draggable theme toggle
class DragManager {
    constructor() {
        this.toggleElement = document.querySelector('.theme-toggle');
        this.isDragging = false;
        this.currentX = 0;
        this.currentY = 0;
        this.initialX = 0;
        this.initialY = 0;
        this.xOffset = 0;
        this.yOffset = 0;
        
        this.init();
    }
    
    init() {
        if (!this.toggleElement) return;
        
        // Mouse events
        this.toggleElement.addEventListener('mousedown', this.dragStart.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.dragEnd.bind(this));
        
        // Touch events for mobile
        this.toggleElement.addEventListener('touchstart', this.dragStart.bind(this));
        document.addEventListener('touchmove', this.drag.bind(this));
        document.addEventListener('touchend', this.dragEnd.bind(this));
        
        // Handle responsive positioning
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Set initial position
        this.setInitialPosition();
    }
    
    handleResize() {
        // Reset position on resize to ensure proper mobile positioning
        this.setResponsivePosition();
    }
    
    setResponsivePosition() {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            // On mobile, position below navbar
            this.xOffset = window.innerWidth - 60; // 60px from right (2.5rem + 1rem margin)
            this.yOffset = 80; // 5rem from top
        } else {
            // On desktop, use default position
            this.xOffset = window.innerWidth - 80; // 80px from right (3rem + 2rem margin)
            this.yOffset = 32; // 2rem from top
        }
        this.updatePosition();
    }
    
    setInitialPosition() {
        // Check if element has been moved by user, if not use responsive position
        const rect = this.toggleElement.getBoundingClientRect();
        const hasBeenMoved = this.toggleElement.style.left || this.toggleElement.style.top;
        
        if (!hasBeenMoved) {
            this.setResponsivePosition();
        } else {
            this.xOffset = rect.left;
            this.yOffset = rect.top;
            this.updatePosition();
        }
    }
    
    dragStart(e) {
        if (e.type === 'touchstart') {
            this.initialX = e.touches[0].clientX - this.xOffset;
            this.initialY = e.touches[0].clientY - this.yOffset;
        } else {
            this.initialX = e.clientX - this.xOffset;
            this.initialY = e.clientY - this.yOffset;
        }
        
        if (e.target === this.toggleElement) {
            this.isDragging = true;
            this.toggleElement.classList.add('dragging');
        }
    }
    
    drag(e) {
        if (this.isDragging) {
            e.preventDefault();
            
            if (e.type === 'touchmove') {
                this.currentX = e.touches[0].clientX - this.initialX;
                this.currentY = e.touches[0].clientY - this.initialY;
            } else {
                this.currentX = e.clientX - this.initialX;
                this.currentY = e.clientY - this.initialY;
            }
            
            this.xOffset = this.currentX;
            this.yOffset = this.currentY;
            
            // Constrain to viewport
            this.constrainToViewport();
            this.updatePosition();
        }
    }
    
    dragEnd(e) {
        this.isDragging = false;
        this.toggleElement.classList.remove('dragging');
    }
    
    constrainToViewport() {
        const rect = this.toggleElement.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Constrain horizontally
        if (this.xOffset < 0) {
            this.xOffset = 0;
        } else if (this.xOffset + rect.width > viewportWidth) {
            this.xOffset = viewportWidth - rect.width;
        }
        
        // Constrain vertically
        if (this.yOffset < 0) {
            this.yOffset = 0;
        } else if (this.yOffset + rect.height > viewportHeight) {
            this.yOffset = viewportHeight - rect.height;
        }
    }
    
    updatePosition() {
        this.toggleElement.style.left = `${this.xOffset}px`;
        this.toggleElement.style.top = `${this.yOffset}px`;
        this.toggleElement.style.right = 'auto';
        this.toggleElement.style.bottom = 'auto';
    }
}

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.updateThemeIcon();
        
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        this.updateThemeIcon();
        
        // Add a nice transition effect
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
        
        // Dispatch custom event for other components
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: newTheme } 
        }));
    }

    updateThemeIcon() {
        const icon = themeToggle.querySelector('i');
        if (this.currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        // Mobile menu toggle
        navToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close menu when clicking on nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            this.handleNavbarScroll();
        });

        // Active link highlighting
        this.setupActiveNavigation();
        
        // Listen for theme changes
        document.addEventListener('themeChanged', () => {
            this.handleNavbarScroll(); // Update navbar colors when theme changes
        });
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.isMenuOpen = false;
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleNavbarScroll() {
        const isDarkMode = document.documentElement.hasAttribute('data-theme');
        
        if (window.scrollY > 100) {
            navbar.style.background = isDarkMode 
                ? 'rgba(15, 23, 42, 0.98)' 
                : 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = isDarkMode 
                ? 'rgba(15, 23, 42, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }

    setupActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// Smooth Scrolling Enhancement
class SmoothScrollManager {
    constructor() {
        this.init();
    }

    init() {
        // Enhanced smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Animation Manager
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupTypewriterEffect();
        this.setupParallaxEffect();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll(
            '.project-card, .skill-item, .stat, .contact-method'
        );
        animatedElements.forEach(el => observer.observe(el));
    }

    setupTypewriterEffect() {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const originalText = heroTitle.innerHTML;
            heroTitle.innerHTML = '';
            
            let index = 0;
            const typeSpeed = 100;
            
            const typeWriter = () => {
                if (index < originalText.length) {
                    heroTitle.innerHTML = originalText.slice(0, index + 1);
                    index++;
                    setTimeout(typeWriter, typeSpeed);
                }
            };
            
            // Start typewriter effect after a short delay
            setTimeout(typeWriter, 500);
        }
    }

    setupParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
}

// Contact Form Manager
class ContactFormManager {
    constructor() {
        this.init();
    }

    init() {
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                this.handleFormSubmit(e);
            });

            // Add real-time validation
            this.setupFormValidation();
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            this.showSuccessMessage();
            contactForm.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);

        console.log('Form submitted:', formObject);
    }

    setupFormValidation() {
        const inputs = contactForm.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearValidationError(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        if (!value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        this.showValidationResult(field, isValid, errorMessage);
        return isValid;
    }

    showValidationResult(field, isValid, message) {
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        if (!isValid) {
            field.style.borderColor = '#ef4444';
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            errorDiv.style.color = '#ef4444';
            errorDiv.style.fontSize = '0.875rem';
            errorDiv.style.marginTop = '0.25rem';
            field.parentNode.appendChild(errorDiv);
        } else {
            field.style.borderColor = '#10b981';
        }
    }

    clearValidationError(field) {
        field.style.borderColor = '';
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div style="
                background: #10b981;
                color: white;
                padding: 1rem;
                border-radius: 0.5rem;
                margin-top: 1rem;
                text-align: center;
                animation: fadeInUp 0.3s ease-out;
            ">
                <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
                Thank you! Your message has been sent successfully.
            </div>
        `;
        
        contactForm.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
}

// Performance Optimization
class PerformanceManager {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.preloadCriticalResources();
    }

    lazyLoadImages() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    preloadCriticalResources() {
        // Preload critical fonts
        const fontLinks = [
            'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap'
        ];

        fontLinks.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });
    }
}

// Skills Animation
class SkillsAnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupSkillsAnimation();
    }

    setupSkillsAnimation() {
        const skillsSection = document.querySelector('#skills');
        let hasAnimated = false;

        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    this.animateSkills();
                    hasAnimated = true;
                }
            });
        }, { threshold: 0.3 });

        if (skillsSection) {
            skillsObserver.observe(skillsSection);
        }
    }

    animateSkills() {
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.animation = 'fadeInUp 0.6s ease-out forwards';
                item.style.animationDelay = `${index * 0.1}s`;
            }, index * 100);
        });
    }
}

// Projects Filter (if needed for future expansion)
class ProjectsManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupProjectHovers();
    }

    setupProjectHovers() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    const themeManager = new ThemeManager();
    const navigationManager = new NavigationManager();
    const smoothScrollManager = new SmoothScrollManager();
    const animationManager = new AnimationManager();
    const contactFormManager = new ContactFormManager();
    const performanceManager = new PerformanceManager();
    const skillsAnimationManager = new SkillsAnimationManager();
    const projectsManager = new ProjectsManager();
    const dragManager = new DragManager();

    // Add loading complete class to body
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // Console message for developers
    console.log(`
    🚀 Developer Portfolio Template
    ===============================
    
    Features included:
    ✅ Dark/Light theme toggle
    ✅ Responsive design
    ✅ Smooth scrolling
    ✅ Form validation
    ✅ Scroll animations
    ✅ Performance optimizations
    ✅ SEO optimized
    
    Built with modern web standards.
    Ready for customization!
    `);
});

// Utility Functions
const utils = {
    // Debounce function for performance
    debounce: (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
    },

    // Throttle function for scroll events
    throttle: (func, delay) => {
        let timeoutId;
        let lastExecTime = 0;
        return (...args) => {
            const currentTime = Date.now();
            if (currentTime - lastExecTime > delay) {
                func.apply(null, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(null, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    },

    // Format date for dynamic content
    formatDate: (date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    },

    // Animate counter numbers
    animateCounter: (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            element.textContent = Math.floor(start);
            
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }
};

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        NavigationManager,
        ContactFormManager,
        utils
    };
}
