/**
 * Payment Handler – Final Clean Version
 */

const PAYMENT_CONFIG = {
    upiId: '9692699132@fam',
    payeeName: 'Algo Arena',
    amount: '20',
    currency: 'INR',
    successRedirectDelay: 5000
};

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
        await this.loadRegistrationSummary();
        this.generateQRCode();
        this.setupUpiLink();
        this.setupVerification();
    }

    generateQRCode() {
        const qrElement = document.getElementById("qrcode");
        if (!qrElement) return;

        qrElement.innerHTML = "";

        if (typeof QRCode === "undefined") {
            console.error("❌ QRCode library missing");
            this.showQRError();
            return;
        }

        const upiURL =
            `upi://pay?pa=${PAYMENT_CONFIG.upiId}` +
            `&pn=${encodeURIComponent(PAYMENT_CONFIG.payeeName)}` +
            `&am=${PAYMENT_CONFIG.amount}` +
            `&cu=${PAYMENT_CONFIG.currency}`;

        new QRCode(qrElement, {
            text: upiURL,
            width: 220,
            height: 220,
            colorDark: "#000",
            colorLight: "#fff",
            correctLevel: QRCode.CorrectLevel.M
        });

        console.log("✅ QR generated");
    }

    showQRError() {
        document.getElementById("qrcode").innerHTML =
            "<p>QR generation failed. Use UPI ID manually.</p>";
    }

    setupUpiLink() {
        const link = document.getElementById("upi-link");
        if (link) {
            link.href = `upi://pay?pa=${PAYMENT_CONFIG.upiId}&pn=${PAYMENT_CONFIG.payeeName}&am=${PAYMENT_CONFIG.amount}`;
        }
    }

    setupVerification() {
        document
            .getElementById("verify-btn")
            ?.addEventListener("click", () => this.verifyPayment());
    }

    async verifyPayment() {
        const transactionId =
            document.getElementById("transaction-id").value.trim();

        if (!transactionId) {
            return this.showError("Enter transaction ID");
        }

        await this.verifyWithSupabase(transactionId);
        this.showSuccess();
        setTimeout(() => (window.location.href = "index.html"), 5000);
    }

    async verifyWithSupabase(transactionId) {
        const supabase = getSupabase();

        const params = new URLSearchParams(window.location.search);
        const game = params.get("game");
        const registrationId = params.get("id");

        const table = game?.includes("freefire")
            ? TABLES.FREE_FIRE
            : TABLES.VALORANT;

        await supabase
            .from(table)
            .update({ payment_status: "verified" })
            .eq("id", registrationId);

        const { error } = await supabase.from(TABLES.PAYMENTS).insert([{
            registration_id: registrationId,
            game_type: game,
            transaction_id: transactionId,
            amount: PAYMENT_CONFIG.amount,
            status: "verified"
        }]);

        if (error) throw error;
    }

    showSuccess() {
        document.getElementById("success-message").style.display = "flex";
    }

    showError(msg) {
        const el = document.getElementById("error-message");
        el.querySelector("p").textContent = msg;
        el.style.display = "flex";
    }

    async loadRegistrationSummary() {}
}

document.addEventListener("DOMContentLoaded", () => {
    new PaymentHandler();
});
