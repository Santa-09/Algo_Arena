/**
 * Algo Arena - Supabase Client Configuration
 * SAFE GLOBAL INITIALIZATION
 */

console.log("✅ supabaseClient.js loaded");

// Create Supabase client ONLY once
if (!window.__supabaseClient) {
    const SUPABASE_URL = 'https://yauefpmvpvwmydnappay.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_R04u-Rjk8pmfi-6g_Q7A9g_F81e9oi5';

    window.__supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );

    console.log("✅ Supabase client initialized");
}

// Accessor function (SAFE)
window.getSupabase = () => window.__supabaseClient;

// Table names
window.TABLES = {
    FREE_FIRE: 'freefire_registrations',
    VALORANT: 'valorant_registrations',
    PAYMENTS: 'payments',
    CONTACTS: 'contact_messages'
};

// Database helpers
window.Database = {
    insert: async (table, data) => {
        const { data: result, error } = await window.getSupabase()
            .from(table)
            .insert([data])
            .select();

        if (error) return { success: false, error: error.message };
        return { success: true, data: result[0] };
    }
};

// Session helpers
window.Session = {
    saveRegistration: (game, data) => {
        sessionStorage.setItem(`${game}_registration`, JSON.stringify(data));
    },
    getRegistration: (game) => {
        const data = sessionStorage.getItem(`${game}_registration`);
        return data ? JSON.parse(data) : null;
    },
    clearRegistration: (game) => {
        sessionStorage.removeItem(`${game}_registration`);
    }
};
