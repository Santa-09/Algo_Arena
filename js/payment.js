/**
 * Payment Processing Handler
 * Algo Arena – Supabase Integrated (Production Safe)
 */

/* ===============================
   SAFE GLOBAL PAYMENT CONFIG
================================ */
if (!window.PAYMENT_CONFIG) {
    window.PAYMENT_CONFIG = {
        upiId: '9692699132@fam',
        payeeName: 'Algo Arena',
        amount: 20,
        currency: 'INR',
        homePageUrl: 'index.html',
        successRedirectDelay: 3000
    };
}

const PAYMENT_CONFIG = window.PAYMENT_CONFIG;
const supabase = window.getSupabase();

/* ===============================
   PAYMENT HANDLER CLASS
================================ */
class PaymentHandler {
    constructor() {
        this.transactionIdInput = document.getElementById('transaction-id');
        this.verifyButton = document.querySelector('.verify-button');
        this.successMessage = document.getElementById('success-message');
        this.errorMessage = document.getElementById('error-message');
        this.qrElement = document.getElementById('qrcode');

        this.registrationData =
            Session.getRegistration('freefire') ||
            Session.getRegistration('valorant');

        this.init();
    }

    init() {
        if (!this.registrationData) {
            alert('No registration data found');
            window.location.href = 'index.html';
            return;
        }

        if (this.qrElement) this.generateQRCode();
        if (this.verifyButton)
            this.verifyButton.addEventListener('click', () => this.verifyPayment());
    }

    generateQRCode() {
        const upiURL = `upi://pay?pa=${PAYMENT_CONFIG.upiId}&pn=${encodeURIComponent(
            PAYMENT_CONFIG.payeeName
        )}&am=${PAYMENT_CONFIG.amount}&cu=${PAYMENT_CONFIG.currency}`;

        this.qrElement.innerHTML = '';

        QRCode.toCanvas(
            upiURL,
            { width: 220, margin: 2 },
            (err, canvas) => {
                if (err) {
                    this.qrElement.innerHTML = '<p>QR generation failed</p>';
                    return;
                }
                this.qrElement.appendChild(canvas);
            }
        );
    }

    async verifyPayment() {
        const txnId = this.transactionIdInput.value.trim();
        this.clearMessages();

        if (!txnId) {
            return this.showError('Please enter Transaction ID');
        }

        this.setLoading(true);

        try {
            // 1️⃣ Prevent duplicate transaction IDs
            const { data: existing } = await supabase
                .from('payments')
                .select('id')
                .eq('transaction_id', txnId);

            if (existing.length > 0) {
                throw new Error('Transaction ID already used');
            }

            // 2️⃣ Insert registration
            const table =
                this.registrationData.gameType === 'freefire'
                    ? TABLES.FREE_FIRE
                    : TABLES.VALORANT;

            const { error: regError } = await supabase.from(table).insert([
                {
                    ...this.registrationData,
                    payment_status: 'verified',
                    paid_at: new Date().toISOString()
                }
            ]);

            if (regError) throw regError;

            // 3️⃣ Insert payment record
            const { error: payError } = await supabase.from('payments').insert([
                {
                    transaction_id: txnId,
                    game_type: this.registrationData.gameType,
                    amount: PAYMENT_CONFIG.amount,
                    status: 'verified'
                }
            ]);

            if (payError) throw payError;

            // 4️⃣ Cleanup & success
            Session.clearRegistration('freefire');
            Session.clearRegistration('valorant');

            this.showSuccess();
        } catch (err) {
            this.showError(err.message);
            console.error('Payment verification error:', err);
        } finally {
            this.setLoading(false);
        }
    }

    /* ===============================
       UI HELPERS
    ================================ */
    setLoading(state) {
        this.verifyButton.disabled = state;
        this.verifyButton.innerHTML = state
            ? '<i class="fas fa-spinner fa-spin"></i> Verifying...'
            : 'Verify Payment';
    }

    showSuccess() {
        this.successMessage.style.display = 'flex';
        let sec = PAYMENT_CONFIG.successRedirectDelay / 1000;

        const timer = setInterval(() => {
            this.successMessage.querySelector('p').innerHTML =
                `Payment verified successfully.<br>Redirecting in ${sec--}s`;
            if (sec < 0) {
                clearInterval(timer);
                window.location.href = PAYMENT_CONFIG.homePageUrl;
            }
        }, 1000);
    }

    showError(msg) {
        this.errorMessage.querySelector('p').textContent = msg;
        this.errorMessage.style.display = 'flex';
    }

    clearMessages() {
        this.successMessage.style.display = 'none';
        this.errorMessage.style.display = 'none';
    }
}

/* ===============================
   INIT
================================ */
document.addEventListener('DOMContentLoaded', () => {
    new PaymentHandler();
});
