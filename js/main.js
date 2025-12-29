// Help Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize help form
    const helpForm = document.getElementById('helpForm');
    const messageTextarea = document.getElementById('help-message');
    const charCounter = document.querySelector('.char-counter');
    
    if (helpForm) {
        // Character counter for message
        if (messageTextarea && charCounter) {
            messageTextarea.addEventListener('input', function() {
                const length = this.value.length;
                charCounter.textContent = `${length}/500 characters`;
                
                if (length > 500) {
                    charCounter.style.color = 'var(--error)';
                    this.style.borderColor = 'var(--error)';
                } else if (length > 400) {
                    charCounter.style.color = 'var(--warning)';
                    this.style.borderColor = 'var(--warning)';
                } else {
                    charCounter.style.color = 'var(--text-muted)';
                    this.style.borderColor = '';
                }
            });
        }
        
        // Form submission
        helpForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('help-name').value,
                email: document.getElementById('help-email').value,
                subject: document.getElementById('help-subject').value,
                game: document.getElementById('help-game').value,
                message: document.getElementById('help-message').value,
                newsletter: document.getElementById('help-newsletter').checked,
                timestamp: new Date().toISOString()
            };
            
            // Validation
            if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            if (formData.message.length > 500) {
                showFormMessage('Message must be 500 characters or less.', 'error');
                return;
            }
            
            try {
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Simulate API call (replace with actual Supabase integration)
                await simulateHelpSubmit(formData);
                
                // Show success message
                showFormMessage('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
                
                // Reset form
                helpForm.reset();
                charCounter.textContent = '0/500 characters';
                
                // Restore button
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 2000);
                
            } catch (error) {
                showFormMessage('Failed to send message. Please try again or contact us directly.', 'error');
                
                // Restore button
                const submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                submitBtn.disabled = false;
            }
        });
    }
    
    function showFormMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <div>${message}</div>
        `;
        
        // Insert before form
        const formCard = document.querySelector('.help-form .form-card');
        formCard.insertBefore(messageDiv, formCard.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
    
    async function simulateHelpSubmit(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Help form submitted:', data);
                resolve({ success: true });
            }, 1500);
        });
    }
});