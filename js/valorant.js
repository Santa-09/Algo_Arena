/**
 * Valorant Registration Handler
 * Algo Arena - Professional Esports Platform
 */

// Form Configuration
const VALORANT_CONFIG = {
    formId: 'valorantForm',
    gameType: 'valorant',
    requiredFields: [
        'fullname', 'email', 'phone', 'country', 'server',
        'player1_name', 'player1_riotid',
        'player2_name', 'player2_riotid',
        'player3_name', 'player3_riotid',
        'player4_name', 'player4_riotid',
        'player5_name', 'player5_riotid'
    ]
};

class ValorantRegistration {
    constructor() {
        this.form = document.getElementById(VALORANT_CONFIG.formId);
        this.successMessage = document.getElementById('successMessage');
        this.errorMessage = document.getElementById('errorMessage');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.initialize();
    }

    initialize() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            this.setupValidation();
            this.setupDynamicFields();
            this.loadSavedData();
        }
    }

    setupValidation() {
        // Add real-time validation
        const inputs = this.form.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Special validation for Riot IDs
        const riotIdInputs = this.form.querySelectorAll('[id$="-riotid"]');
        riotIdInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateRiotId(input));
        });
    }

    setupDynamicFields() {
        // Handle team name generation
        const teamNameInput = document.getElementById('val-teamname');
        const players = ['player1', 'player2', 'player3', 'player4', 'player5'];
        
        players.forEach(player => {
            const nameInput = document.getElementById(`${player}-name`);
            if (nameInput && teamNameInput) {
                nameInput.addEventListener('input', () => {
                    if (!teamNameInput.value) {
                        // Auto-generate team name from first two players
                        const player1Name = document.getElementById('player1-name')?.value || '';
                        const player2Name = document.getElementById('player2-name')?.value || '';
                        if (player1Name && player2Name) {
                            teamNameInput.value = `${player1Name.split(' ')[0]}_${player2Name.split(' ')[0]}_Squad`;
                        }
                    }
                });
            }
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

            case 'tel':
                isValid = Validator.validatePhone(value);
                errorMessage = 'Please enter a valid phone number';
                break;

            default:
                if (field.required && !value) {
                    isValid = false;
                    errorMessage = 'This field is required';
                }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    validateRiotId(field) {
        const value = field.value.trim();
        const isValid = /^[\w\s]+#[\w\d]+$/.test(value);
        
        if (value && !isValid) {
            this.showFieldError(field, 'Invalid Riot ID format (e.g., AlgoArena#1234)');
            return false;
        }
        
        this.clearFieldError(field);
        return true;
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

        // Validate required fields
        const requiredValidation = Validator.validateRequired(
            this.getFormValues(VALORANT_CONFIG.requiredFields)
        );

        if (!requiredValidation.isValid) {
            Object.assign(errors, requiredValidation.errors);
            isValid = false;
        }

        // Validate specific fields
        const email = this.form.querySelector('#val-email').value;
        if (!Validator.validateEmail(email)) {
            errors.email = 'Invalid email format';
            isValid = false;
        }

        const phone = this.form.querySelector('#val-phone').value;
        if (!Validator.validatePhone(phone)) {
            errors.phone = 'Invalid phone number';
            isValid = false;
        }

        // Validate Riot IDs
        const players = [1, 2, 3, 4, 5, 6, 7];
        players.forEach(num => {
            const riotIdField = document.getElementById(`player${num}-riotid`);
            if (riotIdField && riotIdField.value) {
                if (!this.validateRiotId(riotIdField)) {
                    errors[`player${num}_riotid`] = 'Invalid Riot ID format';
                    isValid = false;
                }
            }
        });

        // Show errors
        Object.entries(errors).forEach(([fieldId, message]) => {
            const field = this.form.querySelector(`[name="${fieldId}"]`) || 
                         this.form.querySelector(`#${fieldId}`);
            if (field) this.showFieldError(field, message);
        });

        return { isValid, errors };
    }

    getFormValues(fields) {
        const values = {};
        fields.forEach(fieldName => {
            const element = this.form.querySelector(`[name="${fieldName}"]`);
            values[fieldName] = element ? element.value.trim() : '';
        });
        return values;
    }

    collectFormData() {
        const formData = new FormData(this.form);
        const data = {
            gameType: VALORANT_CONFIG.gameType,
            registrationDate: new Date().toISOString(),
            status: 'pending_payment'
        };

        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            if (key.endsWith('[]')) {
                const baseKey = key.replace('[]', '');
                if (!data[baseKey]) data[baseKey] = [];
                data[baseKey].push(value);
            } else {
                data[key] = value;
            }
        }

        // Add metadata
        data.metadata = {
            userAgent: navigator.userAgent,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            timestamp: Date.now(),
            source: 'algo_arena_website'
        };

        return data;
    }

    loadSavedData() {
        const savedData = Session.getRegistration(VALORANT_CONFIG.gameType);
        if (savedData) {
            Object.entries(savedData).forEach(([key, value]) => {
                const field = this.form.querySelector(`[name="${key}"]`);
                if (field) {
                    if (field.type === 'checkbox' && Array.isArray(value)) {
                        field.checked = value.includes(field.value);
                    } else {
                        field.value = value;
                    }
                }
            });
        }
    }

    saveFormData(data) {
        Session.saveRegistration(VALORANT_CONFIG.gameType, data);
    }

    async handleSubmit(event) {
        event.preventDefault();

        // Hide previous messages
        UI.hideLoader('loadingSpinner');
        this.successMessage.style.display = 'none';
        this.errorMessage.style.display = 'none';

        // Validate form
        const validation = await this.validateForm();
        if (!validation.isValid) {
            UI.showError('errorMessage', 'Please fix the errors in the form');
            this.errorMessage.style.display = 'block';
            this.errorMessage.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        // Show loading state
        UI.showLoader('loadingSpinner');
        
        // Collect data
        const formData = this.collectFormData();
        
        try {
            // Save to session storage
            this.saveFormData(formData);
            
            // Simulate API call (replace with actual Supabase call)
            const result = await this.submitToBackend(formData);
            
            if (result.success) {
                // Show success
                UI.hideLoader('loadingSpinner');
                this.successMessage.style.display = 'block';
                this.successMessage.scrollIntoView({ behavior: 'smooth' });
                
                // Redirect to payment after delay
                setTimeout(() => {
                    window.location.href = 'payment.html';
                }, 2000);
            } else {
                throw new Error(result.message || 'Registration failed');
            }
        } catch (error) {
            // Handle error
            UI.hideLoader('loadingSpinner');
            this.errorMessage.textContent = error.message || 'An error occurred. Please try again.';
            this.errorMessage.style.display = 'block';
            this.errorMessage.scrollIntoView({ behavior: 'smooth' });
            console.error('Registration error:', error);
        }
    }

    async submitToBackend(data) {
        // Replace this with actual Supabase call
        return new Promise(resolve => {
            setTimeout(() => {
                // Simulate successful submission
                resolve({
                    success: true,
                    message: 'Registration successful!',
                    registrationId: `VAL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                });
            }, 1500);
        });
        
        /* 
        // Actual Supabase implementation:
        try {
            const { success, data: result, error } = await Database.insert(
                TABLES.VALORANT,
                data
            );
            
            if (success) {
                return {
                    success: true,
                    message: 'Registration successful!',
                    registrationId: result.id
                };
            } else {
                throw new Error(error);
            }
        } catch (error) {
            throw new Error('Failed to submit registration: ' + error.message);
        }
        */
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const valorantRegistration = new ValorantRegistration();
    
    // Add additional event listeners
    const termsCheckbox = document.getElementById('val-terms');
    const submitButton = document.querySelector('#valorantForm .submit-button');
    
    if (termsCheckbox && submitButton) {
        termsCheckbox.addEventListener('change', () => {
            submitButton.disabled = !termsCheckbox.checked;
        });
        submitButton.disabled = !termsCheckbox.checked;
    }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ValorantRegistration;
}