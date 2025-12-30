/**
 * Payment Handler – FINAL WORKING VERSION
 */

if (!window.PAYMENT_CONFIG) {
    window.PAYMENT_CONFIG = {
        upiId: '9692699132@fam',
        amount: 20,
        homePage: 'index.html'
    };
}

class PaymentHandler {
    constructor() {
        this.txnInput = document.getElementById('transaction-id');
        this.verifyBtn = document.querySelector('.verify-button');
        this.success = document.getElementById('success-message');
        this.error = document.getElementById('error-message');

        this.data =
            Session.getRegistration('freefire') ||
            Session.getRegistration('valorant');

        if (!this.data) {
            alert('No registration data found');
            window.location.href = 'index.html';
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

            // 1️⃣ prevent duplicate payment
            const { data: exists } = await supabase
                .from(TABLES.PAYMENTS)
                .select('id')
                .eq('transaction_id', txn);

            if (exists.length > 0) {
                throw new Error('Transaction already used');
            }

            // 2️⃣ insert registration
            const table =
                this.data.gameType === 'freefire'
                    ? TABLES.FREE_FIRE
                    : TABLES.VALORANT;

            const { error: regErr } = await supabase.from(table).insert([
                {
                    ...this.data,
                    payment_status: 'verified',
                    paid_at: new Date().toISOString()
                }
            ]);

            if (regErr) throw regErr;

            // 3️⃣ insert payment record
            const { error: payErr } = await supabase
                .from(TABLES.PAYMENTS)
                .insert([
                    {
                        transaction_id: txn,
                        game_type: this.data.gameType,
                        amount: PAYMENT_CONFIG.amount,
                        status: 'verified'
                    }
                ]);

            if (payErr) throw payErr;

            Session.clearRegistration('freefire');
            Session.clearRegistration('valorant');

            this.showSuccess();

            setTimeout(() => {
                window.location.href = PAYMENT_CONFIG.homePage;
            }, 3000);

        } catch (err) {
            this.showError(err.message);
            console.error(err);
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
