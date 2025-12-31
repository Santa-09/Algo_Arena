/**
 * Supabase Client – Safe Global Init (v2)
 */

console.log("✅ supabaseClient.js loading...");

// 🔒 Ensure Supabase CDN is loaded
if (!window.supabase) {
    console.error("❌ Supabase CDN not loaded");
    throw new Error("Supabase library missing. Check script order.");
}

// 🔑 Config
const SUPABASE_URL = "https://yauefpmvpvwmydnappay.supabase.co";
const SUPABASE_ANON_KEY =
    "sb_publishable_R04u-Rjk8pmfi-6g_Q7A9g_F81e9oi5";

// 🧠 Create ONE global client (no duplicates)
if (!window.__supabaseClient) {
    window.__supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );
    console.log("✅ Supabase client initialized");
}

// 🌍 Global accessor
window.getSupabase = () => {
    if (!window.__supabaseClient) {
        throw new Error("Supabase client not initialized");
    }
    return window.__supabaseClient;
};

// 📦 Table names (single source of truth)
window.TABLES = {
    FREE_FIRE: "freefire_registrations",
    VALORANT: "valorant_registrations",
    PAYMENTS: "payments"
};

// 💾 Session helpers (optional but useful)
window.Session = {
    saveRegistration: (game, data) => {
        sessionStorage.setItem(
            `${game}_registration`,
            JSON.stringify(data)
        );
    },

    getRegistration: (game) => {
        const d = sessionStorage.getItem(`${game}_registration`);
        return d ? JSON.parse(d) : null;
    },

    clearRegistration: (game) => {
        sessionStorage.removeItem(`${game}_registration`);
    }
};
