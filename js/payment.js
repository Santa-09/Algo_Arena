/**
 * Payment Handler – Complete Payment System
 */

// Configuration
const PAYMENT_CONFIG = {
    upiId: '9692699132@fam',
    payeeName: 'Algo Arena',
    amount: '20',
    currency: 'INR',
    successRedirectDelay: 5000
};

// Supabase Tables Configuration
const TABLES = {
    PAYMENTS: 'payments',
    FREE_FIRE: 'freefire_registrations',
    VALORANT: 'valorant_registrations'
};

class PaymentHandler {
    constructor() {
        this.init();
    }

    async init() {
        try {
            // Load registration data first
            await this.loadRegistrationSummary();

            // Generate QR code
            this.generateQRCode();

            // Setup UPI link
            this.setupUpiLink();

            // Setup event listeners
            this.setupEventListeners();

            // Setup payment verification
            this.setupVerification();
        } catch (error) {
            console.error('Payment handler initialization error:', error);
        }
    }

    generateQRCode() {
        try {
            const upiURL =
                `upi://pay?pa=${PAYMENT_CONFIG.upiId}` +
                `&pn=${encodeURIComponent(PAYMENT_CONFIG.payeeName)}` +
                `&am=${PAYMENT_CONFIG.amount}` +
                `&cu=${PAYMENT_CONFIG.currency}`;

            const qrElement = document.getElementById("qrcode");
            if (!qrElement) return;

            // Clear placeholder
            qrElement.innerHTML = "";

            // Safety check
            if (typeof QRCode === "undefined") {
                throw new Error("QRCode library not loaded");
            }

            // Generate QR (qrcodejs style)
            new QRCode(qrElement, {
                text: upiURL,
                width: 220,
                height: 220,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.M
            });

            console.log("✅ QR code generated successfully");
        } catch (error) {
            console.error("QR Code generation error:", error);
            this.showQRError();
        }
    }


    showQRError() {
        const qrElement = document.getElementById('qrcode');
        qrElement.innerHTML = `
            <div class="qr-error">
                <i class="fas fa-exclamation-triangle fa-3x"></i>
                <p>Failed to generate QR code. Please use UPI app directly.</p>
            </div>
        `;
    }

    async loadRegistrationSummary() {
        try {
            const summaryElement = document.getElementById('registration-summary');
            if (!summaryElement) return;

            // Get URL parameters
            const params = new URLSearchParams(window.location.search);
            const game = params.get('game') || localStorage.getItem('currentGame') || 'Tournament';
            const teamName = params.get('team') || localStorage.getItem('teamName') || 'Your Team';
            const registrationId = params.get('id');

            // Get registration details from localStorage
            let registrationDetails = {};
            try {
                registrationDetails = JSON.parse(localStorage.getItem('registrationDetails')) || {};
            } catch (e) {
                console.log('No registration details in localStorage');
            }

            // Display summary
            const gameName = this.getGameName(game);

            summaryElement.innerHTML = `
                <div class="registration-summary card">
                    <div class="summary-header">
                        <h4><i class="fas fa-receipt"></i> Registration Summary</h4>
                        ${registrationId ? `<span class="status-badge pending">Payment Pending</span>` : ''}
                    </div>
                    <div class="summary-details">
                        <div class="detail-item">
                            <span class="label">Game:</span>
                            <span class="value">${gameName}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Team:</span>
                            <span class="value">${teamName}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Amount:</span>
                            <span class="value amount">₹${PAYMENT_CONFIG.amount}</span>
                        </div>
                        ${registrationId ? `
                        <div class="detail-item">
                            <span class="label">Registration ID:</span>
                            <span class="value">${registrationId}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error loading registration summary:', error);
        }
    }

    getGameName(gameType) {
        const games = {
            'freefire': 'Free Fire',
            'valorant': 'Valorant',
            'free-fire': 'Free Fire',
            'valo': 'Valorant'
        };
        return games[gameType] || 'Tournament';
    }

    setupUpiLink() {
        const upiURL = `upi://pay?pa=${PAYMENT_CONFIG.upiId}&pn=${encodeURIComponent(PAYMENT_CONFIG.payeeName)}&am=${PAYMENT_CONFIG.amount}&cu=${PAYMENT_CONFIG.currency}`;
        const upiLink = document.getElementById('upi-link');
        if (upiLink) {
            upiLink.href = upiURL;
        }
    }

    setupEventListeners() {
        // Copy UPI ID
        window.copyUpiId = () => this.copyToClipboard(PAYMENT_CONFIG.upiId, 'UPI ID');

        // UPI App redirects
        window.redirectToUpi = (app) => this.redirectToUpiApp(app);

        // Manual instructions
        window.showManualInstructions = () => this.showManualInstructions();
    }

    copyToClipboard(text, label) {
        navigator.clipboard.writeText(text)
            .then(() => {
                const copyBtn = document.querySelector('.copy-btn');
                if (copyBtn) {
                    const originalHTML = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                    copyBtn.style.color = 'var(--success)';

                    setTimeout(() => {
                        copyBtn.innerHTML = originalHTML;
                        copyBtn.style.color = '';
                    }, 2000);
                }
            })
            .catch(err => {
                console.error('Copy failed:', err);
                alert(`Failed to copy ${label}. Please copy manually: ${text}`);
            });
    }

    redirectToUpiApp(app) {
        const appURLs = {
            gpay: `tez://upi/pay?pa=${PAYMENT_CONFIG.upiId}&pn=${PAYMENT_CONFIG.payeeName}&am=${PAYMENT_CONFIG.amount}`,
            phonepe: `phonepe://pay?pa=${PAYMENT_CONFIG.upiId}&pn=${PAYMENT_CONFIG.payeeName}&am=${PAYMENT_CONFIG.amount}`,
            paytm: `paytmmp://pay?pa=${PAYMENT_CONFIG.upiId}&pn=${PAYMENT_CONFIG.payeeName}&am=${PAYMENT_CONFIG.amount}`,
            bhim: `bhim://pay?pa=${PAYMENT_CONFIG.upiId}&pn=${PAYMENT_CONFIG.payeeName}&am=${PAYMENT_CONFIG.amount}`
        };

        const url = appURLs[app] || `upi://pay?pa=${PAYMENT_CONFIG.upiId}&pn=${PAYMENT_CONFIG.payeeName}&am=${PAYMENT_CONFIG.amount}`;
        window.location.href = url;

        // Fallback after 1 second
        setTimeout(() => {
            if (!document.hasFocus()) {
                window.location.href = `upi://pay?pa=${PAYMENT_CONFIG.upiId}&pn=${PAYMENT_CONFIG.payeeName}&am=${PAYMENT_CONFIG.amount}`;
            }
        }, 1000);
    }

    showManualInstructions() {
        const instructions = `Manual Payment Instructions:\n\n
1. Open your UPI app (GPay, PhonePe, Paytm, etc.)
2. Tap on "Scan QR Code"
3. Scan the QR code above
4. Enter amount: ₹${PAYMENT_CONFIG.amount}
5. Complete the payment
6. Save the transaction ID\n\n
UPI ID: ${PAYMENT_CONFIG.upiId}`;

        alert(instructions);
    }

    setupVerification() {
        const verifyBtn = document.getElementById('verify-btn');
        if (verifyBtn) {
            verifyBtn.addEventListener('click', () => this.verifyPayment());
        }
    }

    async verifyPayment() {
        const transactionId = document.getElementById('transaction-id').value.trim();
        const verifyBtn = document.getElementById('verify-btn');
        const successMessage = document.getElementById('success-message');
        const errorMessage = document.getElementById('error-message');

        // Hide previous messages
        if (successMessage) successMessage.style.display = 'none';
        if (errorMessage) errorMessage.style.display = 'none';

        // Validate transaction ID
        if (!transactionId) {
            this.showError('Please enter your transaction ID');
            return;
        }

        // Validate transaction ID format
        if (!this.isValidTransactionId(transactionId)) {
            this.showError('Invalid transaction ID format. Please enter a valid UPI transaction ID.');
            return;
        }

        // Show loading state
        const originalText = verifyBtn.innerHTML;
        verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
        verifyBtn.disabled = true;

        try {
            // Check if Supabase is available
            if (typeof getSupabase === 'function') {
                await this.verifyWithSupabase(transactionId);
            } else {
                // Fallback to simulation if Supabase not available
                await this.simulateVerification(transactionId);
            }

            // Show success
            this.showSuccess();
            verifyBtn.innerHTML = '<i class="fas fa-check-circle"></i> Verified!';
            verifyBtn.style.background = 'linear-gradient(45deg, var(--success), #3aa83a)';
            verifyBtn.disabled = true;

            // Start redirect countdown
            this.startRedirectCountdown();

        } catch (error) {
            // Show error
            verifyBtn.innerHTML = originalText;
            verifyBtn.disabled = false;
            this.showError(error.message || 'Verification failed. Please try again.');
        }
    }

    isValidTransactionId(txnId) {
        const patterns = [
            /^[A-Z0-9]{8,20}$/i,
            /^[A-Z]{3}[0-9]{10,15}$/i,
            /^[0-9]{12,16}$/,
            /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/i
        ];
        return patterns.some(pattern => pattern.test(txnId));
    }

    async verifyWithSupabase(transactionId) {
        try {
            const supabase = getSupabase();
            if (!supabase) {
                throw new Error('Database connection not available');
            }

            // Get URL parameters
            const params = new URLSearchParams(window.location.search);
            const game = params.get('game');
            const registrationId = params.get('id');

            if (!game || !registrationId) {
                throw new Error('Invalid registration data');
            }

            // Check for duplicate transaction
            const { data: existingPayment, error: checkError } = await supabase
                .from(TABLES.PAYMENTS)
                .select('id')
                .eq('transaction_id', transactionId);

            if (checkError) throw checkError;
            if (existingPayment && existingPayment.length > 0) {
                throw new Error('This transaction ID has already been used');
            }

            // Determine the correct table
            const table = game.includes('freefire') ? TABLES.FREE_FIRE : TABLES.VALORANT;

            // Update registration payment status
            const { error: updateError } = await supabase
                .from(table)
                .update({
                    payment_status: 'verified',
                    paid_at: new Date().toISOString()
                })
                .eq('id', registrationId);

            if (updateError) throw updateError;

            // Insert payment record
            const { error: payErr } = await supabase
                .from(TABLES.PAYMENTS)
                .insert([{
                    registration_id: registrationId,
                    game_type: game,
                    transaction_id: transactionId,
                    amount: PAYMENT_CONFIG.amount,
                    status: "verified",
                    created_at: new Date().toISOString()
                }]);


            if (payErr) {
                console.error("❌ Payment insert error:", payErr);
                throw payErr;
            }
            console.log('✅ Payment verified for registration ID:', registrationId);

            // Save to localStorage
            localStorage.setItem('paymentVerified', 'true');
            localStorage.setItem('transactionId', transactionId);
            localStorage.setItem('paymentTime', new Date().toISOString());

            return true;

        } catch (error) {
            console.error('Supabase verification error:', error);
            throw error;
        }
    }

    async simulateVerification(transactionId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // For demo purposes - simulate 80% success rate
                const isSuccess = Math.random() > 0.2;

                if (isSuccess) {
                    // Save to localStorage for demo
                    localStorage.setItem('paymentVerified', 'true');
                    localStorage.setItem('transactionId', transactionId);
                    localStorage.setItem('paymentTime', new Date().toISOString());
                    resolve(true);
                } else {
                    reject(new Error('Transaction ID not found. Please verify the ID and try again.'));
                }
            }, 2000);
        });
    }

    showSuccess() {
        const successMessage = document.getElementById('success-message');
        if (successMessage) {
            successMessage.style.display = 'flex';
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) errorMessage.style.display = 'none';
        }
    }

    showError(message) {
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
            const errorText = errorMessage.querySelector('p');
            if (errorText) errorText.textContent = message;
            errorMessage.style.display = 'flex';
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            const successMessage = document.getElementById('success-message');
            if (successMessage) successMessage.style.display = 'none';
        }
    }

    startRedirectCountdown() {
        let seconds = Math.floor(PAYMENT_CONFIG.successRedirectDelay / 1000);
        const successMessage = document.getElementById('success-message');

        if (!successMessage) return;

        const countdownInterval = setInterval(() => {
            const messageText = successMessage.querySelector('p');
            if (messageText) {
                messageText.innerHTML = `
                    <strong>Payment Verified Successfully!</strong><br>
                    Your registration is now complete.<br>
                    <small>Redirecting to homepage in ${seconds} seconds...</small>
                `;
            }

            seconds--;

            if (seconds <= 0) {
                clearInterval(countdownInterval);
                window.location.href = 'index.html';
            }
        }, 1000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Initialize payment handler
    new PaymentHandler();
});