/**
 * Payment Processing Handler
 * Algo Arena - Professional Esports Platform
 */

// Payment Configuration
const PAYMENT_CONFIG = {
    upiId: '9692699132@fam',
    payeeName: 'Algo Arena',
    amount: '20',
    currency: 'INR',
    homePageUrl: 'index.html',
    successRedirectDelay: 3000 // 3 seconds
};

class PaymentHandler {
    constructor() {
        this.form = document.getElementById('paymentForm');
        this.qrElement = document.getElementById('qrcode');
        this.transactionIdInput = document.getElementById('transaction-id');
        this.verifyButton = document.querySelector('.verify-button');
        this.successMessage = document.getElementById('success-message');
        this.errorMessage = document.getElementById('error-message');
        this.registrationData = this.getRegistrationData();
        this.initialize();
    }

    initialize() {
        if (this.qrElement) {
            this.generateQRCode();
        }
        
        if (this.verifyButton) {
            this.verifyButton.addEventListener('click', () => this.verifyPayment());
        }
        
        if (this.transactionIdInput) {
            this.setupInputValidation();
        }
        
        this.displayRegistrationSummary();
    }

    getRegistrationData() {
        // Try to get registration data from session storage
        const freefireData = Session.getRegistration('freefire');
        const valorantData = Session.getRegistration('valorant');
        
        return freefireData || valorantData || null;
    }

    displayRegistrationSummary() {
        const summaryElement = document.getElementById('registration-summary');
        if (summaryElement && this.registrationData) {
            const gameType = this.registrationData.gameType === 'freefire' ? 'Free Fire' : 'Valorant';
            const teamName = this.registrationData.team_name || 'Individual Registration';
            
            summaryElement.innerHTML = `
                <div class="registration-summary">
                    <h4><i class="fas fa-gamepad"></i> Registration Summary</h4>
                    <div class="summary-details">
                        <p><strong>Game:</strong> ${gameType}</p>
                        <p><strong>Team:</strong> ${teamName}</p>
                        <p><strong>Amount:</strong> ₹${PAYMENT_CONFIG.amount}</p>
                        <p><strong>Status:</strong> <span class="status-pending">Pending Payment</span></p>
                    </div>
                </div>
            `;
        }
    }

    generateQRCode() {
        const upiURL = `upi://pay?pa=${PAYMENT_CONFIG.upiId}&pn=${encodeURIComponent(PAYMENT_CONFIG.payeeName)}&am=${PAYMENT_CONFIG.amount}&cu=${PAYMENT_CONFIG.currency}`;
        
        // Clear previous QR code
        this.qrElement.innerHTML = '';
        
        // Create canvas for QR code
        const canvas = document.createElement('canvas');
        
        QRCode.toCanvas(canvas, upiURL, {
            width: 220,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            },
            errorCorrectionLevel: 'H'
        }, (error) => {
            if (error) {
                console.error('QR Code generation failed:', error);
                this.qrElement.innerHTML = `
                    <div class="qr-error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Failed to generate QR code. Please use UPI button instead.</p>
                    </div>
                `;
                return;
            }
            
            this.qrElement.appendChild(canvas);
            
            // Add download option
            this.addDownloadOption(canvas);
        });
    }

    addDownloadOption(canvas) {
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'btn btn-outline qr-download';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download QR Code';
        downloadBtn.addEventListener('click', () => this.downloadQRCode(canvas));
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'qr-actions';
        buttonContainer.appendChild(downloadBtn);
        
        this.qrElement.parentElement.appendChild(buttonContainer);
    }

    downloadQRCode(canvas) {
        const link = document.createElement('a');
        link.download = `algo-arena-payment-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    setupInputValidation() {
        this.transactionIdInput.addEventListener('input', () => {
            this.clearMessages();
            this.validateTransactionId();
        });
    }

    validateTransactionId() {
        const value = this.transactionIdInput.value.trim();
        
        // UPI Transaction ID patterns
        const patterns = [
            /^[A-Z0-9]{8,20}$/i,
            /^[A-Z]{3}[0-9]{10,15}$/i,
            /^[0-9]{12,16}$/,
            /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/i,
            /^UPI[A-Z0-9]{9,15}$/i
        ];
        
        const isValid = patterns.some(pattern => pattern.test(value));
        
        if (value && !isValid) {
            this.showInputError('Invalid UPI transaction ID format');
            return false;
        }
        
        this.clearInputError();
        return true;
    }

    showInputError(message) {
        this.clearInputError();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        this.transactionIdInput.parentElement.appendChild(errorDiv);
        this.transactionIdInput.classList.add('error');
    }

    clearInputError() {
        this.transactionIdInput.classList.remove('error');
        const errorDiv = this.transactionIdInput.parentElement.querySelector('.error-message');
        if (errorDiv) errorDiv.remove();
    }

    clearMessages() {
        this.successMessage.style.display = 'none';
        this.errorMessage.style.display = 'none';
    }

    async verifyPayment() {
        const transactionId = this.transactionIdInput.value.trim();
        
        // Clear previous messages
        this.clearMessages();
        
        // Validate input
        if (!transactionId) {
            this.showInputError('Please enter your transaction ID');
            this.errorMessage.style.display = 'flex';
            return;
        }
        
        if (!this.validateTransactionId()) {
            this.errorMessage.style.display = 'flex';
            return;
        }
        
        // Show loading state
        const originalButtonText = this.verifyButton.innerHTML;
        this.verifyButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
        this.verifyButton.disabled = true;
        
        try {
            // Verify payment with backend
            const verificationResult = await this.verifyWithBackend(transactionId);
            
            if (verificationResult.success) {
                await this.handleVerificationSuccess(transactionId, verificationResult);
            } else {
                throw new Error(verificationResult.message || 'Verification failed');
            }
        } catch (error) {
            this.handleVerificationError(error, originalButtonText);
        }
    }

    async verifyWithBackend(transactionId) {
        // Simulate API call (replace with actual backend call)
        return new Promise(resolve => {
            setTimeout(() => {
                // For demo - random success/failure
                const isSuccess = Math.random() > 0.3;
                
                if (isSuccess) {
                    resolve({
                        success: true,
                        message: 'Payment verified successfully',
                        transactionId,
                        timestamp: new Date().toISOString(),
                        amount: PAYMENT_CONFIG.amount,
                        currency: PAYMENT_CONFIG.currency
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Transaction ID not found or already used'
                    });
                }
            }, 2000);
        });
        
        /*
        // Actual backend implementation:
        try {
            // Get registration data
            const registrationData = this.getRegistrationData();
            if (!registrationData) {
                throw new Error('No registration data found');
            }
            
            // Prepare payment record
            const paymentData = {
                registration_id: registrationData.registrationId,
                game_type: registrationData.gameType,
                transaction_id: transactionId,
                amount: PAYMENT_CONFIG.amount,
                currency: PAYMENT_CONFIG.currency,
                status: 'verified',
                verified_at: new Date().toISOString(),
                metadata: {
                    user_agent: navigator.userAgent,
                    ip_address: await this.getUserIP(),
                    payment_method: 'upi'
                }
            };
            
            // Save to Supabase
            const { success, error } = await Database.insert(
                TABLES.PAYMENTS,
                paymentData
            );
            
            if (success) {
                // Update registration status
                await Database.update(
                    registrationData.gameType === 'freefire' ? TABLES.FREE_FIRE : TABLES.VALORANT,
                    { status: 'paid', payment_id: paymentData.id },
                    { id: registrationData.registrationId }
                );
                
                return {
                    success: true,
                    message: 'Payment verified successfully',
                    paymentId: paymentData.id
                };
            } else {
                throw new Error(error);
            }
        } catch (error) {
            console.error('Payment verification failed:', error);
            return {
                success: false,
                message: error.message || 'Payment verification failed'
            };
        }
        */
    }

    async handleVerificationSuccess(transactionId, verificationResult) {
        // Update button
        this.verifyButton.innerHTML = '<i class="fas fa-check-circle"></i> Verified!';
        this.verifyButton.style.background = 'linear-gradient(45deg, var(--success), #3aa83a)';
        
        // Show success message
        this.successMessage.style.display = 'flex';
        
        // Save to session storage
        Session.savePayment({
            transactionId,
            verifiedAt: new Date().toISOString(),
            verificationResult
        });
        
        // Clear registration data
        Session.clearRegistration('freefire');
        Session.clearRegistration('valorant');
        
        // Start countdown to redirect
        this.startRedirectCountdown();
        
        // Send confirmation email (in production)
        // await this.sendConfirmationEmail();
    }

    handleVerificationError(error, originalButtonText) {
        // Restore button
        this.verifyButton.innerHTML = originalButtonText;
        this.verifyButton.disabled = false;
        this.verifyButton.style.background = 'linear-gradient(45deg, var(--accent-yellow), #ff9900)';
        
        // Show error message
        this.errorMessage.querySelector('p').textContent = error.message;
        this.errorMessage.style.display = 'flex';
        this.errorMessage.scrollIntoView({ behavior: 'smooth' });
        
        console.error('Payment verification error:', error);
    }

    startRedirectCountdown() {
        let secondsRemaining = Math.floor(PAYMENT_CONFIG.successRedirectDelay / 1000);
        
        const countdownInterval = setInterval(() => {
            this.successMessage.querySelector('p').innerHTML = `
                <strong>Payment Verified Successfully!</strong><br>
                Your registration is now complete.<br>
                <small>Redirecting to homepage in ${secondsRemaining} seconds...</small>
            `;
            
            secondsRemaining--;
            
            if (secondsRemaining <= 0) {
                clearInterval(countdownInterval);
                window.location.href = PAYMENT_CONFIG.homePageUrl;
            }
        }, 1000);
    }

    async sendConfirmationEmail() {
        // In production, implement email sending
        // This would typically call a backend endpoint
        console.log('Confirmation email would be sent in production');
    }

    async getUserIP() {
        // Get user IP for logging
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'unknown';
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const paymentHandler = new PaymentHandler();
    
    // Add UPI app redirect handlers
    const upiButton = document.querySelector('.upi-button');
    if (upiButton) {
        upiButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = upiButton.href;
            
            // Show instruction modal
            setTimeout(() => {
                alert('If UPI app didn\'t open automatically:\n\n1. Open your UPI app (GPay, PhonePe, Paytm, etc.)\n2. Tap on "Scan QR Code"\n3. Scan the QR code above\n4. Complete the payment of ₹20');
            }, 500);
        });
    }
    
    // Add copy UPI ID functionality
    const copyUpiBtn = document.createElement('button');
    copyUpiBtn.className = 'btn btn-outline upi-copy';
    copyUpiBtn.innerHTML = '<i class="fas fa-copy"></i> Copy UPI ID';
    copyUpiBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(PAYMENT_CONFIG.upiId)
            .then(() => {
                const originalText = copyUpiBtn.innerHTML;
                copyUpiBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    copyUpiBtn.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => console.error('Copy failed:', err));
    });
    
    const qrContainer = document.querySelector('.qr-section');
    if (qrContainer) {
        qrContainer.appendChild(copyUpiBtn);
    }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaymentHandler;
}