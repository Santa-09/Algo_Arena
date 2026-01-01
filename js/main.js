/**
 * Main UI Logic – Algo Arena
 */

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu elements
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.overlay');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu .nav-link, .mobile-menu .btn');

    // Toggle mobile menu function
    const toggleMobileMenu = () => {
    mobileMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    hamburger.classList.toggle('active');

    
        // Animate hamburger to X
        const spans = hamburger.querySelectorAll('span');
        if (!isActive) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    };

    // Close mobile menu function
    const closeMobileMenu = () => {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        hamburger.classList.remove('active');
        
        // Reset hamburger animation
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    };

    // Hamburger click event
    if (hamburger && mobileMenu && overlay) {
        hamburger.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking overlay
        overlay.addEventListener('click', closeMobileMenu);
        
        // Close menu when clicking any mobile menu link
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Close menu when pressing Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal anchor links
            if (href === '#' || href === '#!') return;
            
            // Don't prevent default for non-hash links
            if (!href.startsWith('#')) return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                const headerHeight = document.querySelector('.navbar')?.offsetHeight || 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            }
        });
    });

    // Footer year update
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Add scroll-based active nav link highlighting
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    const highlightNavLink = () => {
        let currentSection = '';
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    };
    
    // Initial highlight
    highlightNavLink();
    
    // Highlight on scroll
    window.addEventListener('scroll', highlightNavLink);

    // Add CSS for active hamburger animation if not already in stylesheet
    if (!document.querySelector('#hamburger-animation-style')) {
        const style = document.createElement('style');
        style.id = 'hamburger-animation-style';
        style.textContent = `
            .hamburger.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px) !important;
            }
            
            .hamburger.active span:nth-child(2) {
                opacity: 0 !important;
            }
            
            .hamburger.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px) !important;
            }
            
            .nav-link.active {
                color: var(--accent-yellow) !important;
            }
            
            .nav-link.active::after {
                width: 100% !important;
            }
        `;
        document.head.appendChild(style);
    }

    console.log("✅ main.js loaded successfully");
});