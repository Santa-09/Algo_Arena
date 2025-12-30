/**
 * Payment Handler – Direct DB Linking
 */

if (!window.PAYMENT_CONFIG) {
    window.PAYMENT_CONFIG = {
        amount: 20
    };
}

class PaymentHandler {
    constructor() {
        this.txnInput = document.getElementById('transaction-id');
        this.verifyBtn = document.querySelector('.verify-button');
        this.success = document.getElementById('success-message');
        this.error = document.getElementById('error-message');

        const params = new URLSearchParams(window.location.search);
        this.game = params.get('game');
        this.registrationId = params.get('id');

        if (!this.game || !this.registrationId) {
            alert('Invalid payment access');
            return;
        }

        this.verifyBtn.addEventListener('click', () => this.verify());
    }

    async verify() {
        const txn = this.txnInput.value.trim();
        if (!txn) return this.showError('Enter transaction ID');

        this.verifyBtn.disabled = true;
        this.verifyBtn.innerHTML = 'Verifying...';

        try {
            const supabase = window.getSupabase();

            // Prevent duplicate transaction
            const { data: exists } = await supabase
                .from(TABLES.PAYMENTS)
                .select('id')
                .eq('transaction_id', txn);

            if (exists.length > 0) {
                throw new Error('Transaction already used');
            }

            // Update registration payment status
            const table =
                this.game === 'freefire'
                    ? TABLES.FREE_FIRE
                    : TABLES.VALORANT;

            const { error: updateError } = await supabase
                .from(table)
                .update({
                    payment_status: 'verified',
                    paid_at: new Date().toISOString()
                })
                .eq('id', this.registrationId);

            if (updateError) throw updateError;

            // Insert payment record
            const { error: payErr } = await supabase
                .from(TABLES.PAYMENTS)
                .insert([
                    {
                        registration_id: this.registrationId,
                        game_type: this.game,
                        transaction_id: txn,
                        amount: PAYMENT_CONFIG.amount,
                        status: 'verified'
                    }
                ]);

            if (payErr) throw payErr;

            this.showSuccess();

        } catch (err) {
            console.error(err);
            this.showError(err.message);
        } finally {
            this.verifyBtn.disabled = false;
            this.verifyBtn.innerHTML = 'Verify Payment';
        }
    }

    showSuccess() {
        this.success.style.display = 'flex';
        this.error.style.display = 'none';
    }

    showError(msg) {
        this.error.querySelector('p').textContent = msg;
        this.error.style.display = 'flex';
        this.success.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PaymentHandler();
});
