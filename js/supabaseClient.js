/**
 * Supabase Client – Safe Global Init
 */

console.log("✅ supabaseClient loaded");

if (!window.__supabaseClient) {
    window.__supabaseClient = window.supabase.createClient(
        'https://dgkbaeyfgvrgaampbiua.supabase.co',
        'sb_publishable_CJ2_wPie8LH6WJSpajhBEQ_wHB82YvG'
    );
}

window.getSupabase = () => window.__supabaseClient;

window.TABLES = {
    FREE_FIRE: 'freefire_registrations',
    VALORANT: 'valorant_registrations',
    PAYMENTS: 'payments'
};

window.Session = {
    saveRegistration: (game, data) =>
        sessionStorage.setItem(`${game}_registration`, JSON.stringify(data)),

    getRegistration: (game) => {
        const d = sessionStorage.getItem(`${game}_registration`);
        return d ? JSON.parse(d) : null;
    },

    clearRegistration: (game) =>
        sessionStorage.removeItem(`${game}_registration`)
};
