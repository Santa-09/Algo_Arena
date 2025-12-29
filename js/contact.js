/**
 * Contact Form Handler
 * Algo Arena - Professional Esports Platform
 */

class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.successMessage = document.getElementById('successMessage');
        this.errorMessage = document.getElementById('errorMessage');
        this.initialize();
    }

    initialize() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            this.setupValidation();
            this.setupSocialLinks();
        }
    }

    setupValidation() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    setupSocialLinks() {
        const socialLinks = document.querySelectorAll('.social-links a');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = link.getAttribute('title')?.toLowerCase();
                this.handleSocialLink(platform);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (field.type) {
            case 'email':
                isValid = Validator.validateEmail(value);
                errorMessage = 'Please enter a valid email address';
                break;

            case 'text':
                if (field.required && !value) {
                    isValid = false;
                    errorMessage = 'This field is required';
                }
                break;

            case 'textarea':
                if (field.required && !value) {
                    isValid = false;
                    errorMessage = 'Please enter your message';
                } else if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        field.parentElement.appendChild(errorDiv);
        field.classList.add('error');
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorDiv = field.parentElement.querySelector('.error-message');
        if (errorDiv) errorDiv.remove();
    }

    async validateForm() {
        let isValid = true;
        const errors = {};

        // Get all required fields
        const requiredFields = this.form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                errors[field.name] = field.validationMessage || 'This field is invalid';
                isValid = false;
            }
        });

        // Validate email specifically
        const emailField = this.form.querySelector('#email');
        if (emailField && !Validator.validateEmail(emailField.value)) {
            errors.email = 'Invalid email format';
            isValid = false;
        }

        return { isValid, errors };
    }

    collectFormData() {
        const formData = new FormData(this.form);
        const data = {
            submitted_at: new Date().toISOString(),
            status: 'unread'
        };

        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Add metadata
        data.metadata = {
            userAgent: navigator.userAgent,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            referrer: document.referrer,
            timestamp: Date.now(),
            source: 'contact_page'
        };

        return data;
    }

    handleSocialLink(platform) {
        const links = {
            discord: 'https://discord.gg/algoarena',
            twitter: 'https://twitter.com/algoarena',
            instagram: 'https://instagram.com/algoarena',
            facebook: 'https://facebook.com/algoarena',
            youtube: 'https://youtube.com/algoarena'
        };

        if (links[platform]) {
            window.open(links[platform], '_blank');
        } else {
            // Fallback - show Discord link
            window.open(links.discord, '_blank');
        }
    }

    async handleSubmit(event) {
        event.preventDefault();

        // Hide previous messages
        this.successMessage.style.display = 'none';
        this.errorMessage.style.display = 'none';

        // Validate form
        const validation = await this.validateForm();
        if (!validation.isValid) {
            this.errorMessage.style.display = 'block';
            this.errorMessage.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        // Show loading state
        const submitButton = this.form.querySelector('.submit-button');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;

        // Collect data
        const formData = this.collectFormData();

        try {
            // Submit to backend
            const result = await this.submitToBackend(formData);
            
            if (result.success) {
                // Show success
                this.successMessage.style.display = 'block';
                this.successMessage.scrollIntoView({ behavior: 'smooth' });
                
                // Reset form
                this.form.reset();
                
                // Send confirmation (in production)
                // await this.sendAutoReply(formData.email);
            } else {
                throw new Error(result.message || 'Failed to send message');
            }
        } catch (error) {
            // Show error
            this.errorMessage.textContent = error.message || 'An error occurred. Please try again.';
            this.errorMessage.style.display = 'block';
            this.errorMessage.scrollIntoView({ behavior: 'smooth' });
            console.error('Contact form error:', error);
        } finally {
            // Restore button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }

    async submitToBackend(data) {
        // Simulate API call (replace with actual backend call)
        return new Promise(resolve => {
            setTimeout(() => {
                // Simulate successful submission
                resolve({
                    success: true,
                    message: 'Message sent successfully!',
                    messageId: `CONTACT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                });
            }, 1500);
        });
        
        /*
        // Actual backend implementation:
        try {
            const { success, error } = await Database.insert(
                TABLES.CONTACTS,
                data
            );
            
            if (success) {
                return {
                    success: true,
                    message: 'Message sent successfully!'
                };
            } else {
                throw new Error(error);
            }
        } catch (error) {
            throw new Error('Failed to send message: ' + error.message);
        }
        */
    }

    async sendAutoReply(email) {
        // In production, implement auto-reply email
        console.log('Auto-reply would be sent to:', email);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const contactFormHandler = new ContactFormHandler();
    
    // Add map functionality if available
    this.initMap();
    
    // Add email copy functionality
    const emailElements = document.querySelectorAll('.info-content p');
    emailElements.forEach(element => {
        if (element.textContent.includes('@')) {
            element.style.cursor = 'pointer';
            element.addEventListener('click', () => {
                navigator.clipboard.writeText(element.textContent.trim())
                    .then(() => {
                        const originalText = element.textContent;
                        element.textContent = 'Email copied!';
                        element.style.color = 'var(--accent-yellow)';
                        
                        setTimeout(() => {
                            element.textContent = originalText;
                            element.style.color = '';
                        }, 2000);
                    })
                    .catch(err => console.error('Copy failed:', err));
            });
        }
    });
});

function initMap() {
    // Initialize Google Maps if available
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer && typeof google !== 'undefined') {
        const mapOptions = {
            center: { lat: 20.8480, lng: 85.9792 }, // Bhadrak coordinates
            zoom: 15,
            styles: [
                {
                    featureType: 'all',
                    elementType: 'geometry',
                    stylers: [{ color: '#242f3e' }]
                },
                {
                    featureType: 'all',
                    elementType: 'labels.text.stroke',
                    stylers: [{ color: '#242f3e' }]
                },
                {
                    featureType: 'all',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#746855' }]
                }
            ]
        };
        
        const map = new google.maps.Map(mapContainer, mapOptions);
        
        // Add marker
        new google.maps.Marker({
            position: { lat: 20.8480, lng: 85.9792 },
            map: map,
            title: 'Algo Arena Headquarters',
            icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
            }
        });
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactFormHandler;
}