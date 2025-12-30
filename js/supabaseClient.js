/**
 * Algo Arena - Supabase Client Configuration
 * Professional Esports Platform Database Connection
 */

// 🔒 Prevent redeclaration (CRITICAL FIX)
if (!window.supabaseClient) {

    // Supabase Configuration
    const SUPABASE_URL = 'https://dgkbaeyfgvrgaampbiua.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_CJ2_wPie8LH6WJSpajhBEQ_wHB82YvG';

    // ✅ Create client ONCE and attach to window
    window.supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );
}

// ✅ Always use this reference
const supabase = window.supabaseClient;

/* -------------------------------------------------- */
/* ----------------- TABLE NAMES -------------------- */
/* -------------------------------------------------- */

const TABLES = {
    FREE_FIRE: 'freefire_registrations',
    VALORANT: 'valorant_registrations',
    PAYMENTS: 'payments',
    CONTACTS: 'contact_messages',
    USERS: 'users',
    TOURNAMENTS: 'tournaments'
};

/* -------------------------------------------------- */
/* ----------------- DATABASE UTILS ----------------- */
/* -------------------------------------------------- */

async function testConnection() {
    try {
        const { error } = await supabase
            .from(TABLES.FREE_FIRE)
            .select('*')
            .limit(1);

        if (error) throw error;
        console.log('✅ Supabase connection successful');
        return true;
    } catch (error) {
        console.error('❌ Supabase connection failed:', error.message);
        return false;
    }
}

function getSupabaseClient() {
    return supabase;
}

function getTables() {
    return TABLES;
}

const Database = {
    async insert(table, data) {
        const { data: result, error } = await supabase
            .from(table)
            .insert([data])
            .select();

        if (error) return { success: false, error: error.message };
        return { success: true, data: result[0] };
    },

    async select(table, options = {}) {
        let query = supabase.from(table).select('*');

        if (options.match) query = query.match(options.match);
        if (options.limit) query = query.limit(options.limit);

        const { data, error } = await query;
        if (error) return { success: false, error: error.message };

        return { success: true, data };
    }
};

/* -------------------------------------------------- */
/* ---------------- SESSION UTILS ------------------- */
/* -------------------------------------------------- */

const Session = {
    saveRegistration(game, data) {
        sessionStorage.setItem(`${game}_registration`, JSON.stringify(data));
    },
    getRegistration(game) {
        const data = sessionStorage.getItem(`${game}_registration`);
        return data ? JSON.parse(data) : null;
    },
    clearRegistration(game) {
        sessionStorage.removeItem(`${game}_registration`);
    }
};

/* -------------------------------------------------- */
/* ---------------- VALIDATION ---------------------- */
/* -------------------------------------------------- */

const Validator = {
    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    validatePhone(phone) {
        return /^[\+]?[1-9][\d]{9,14}$/.test(phone.replace(/\D/g, ''));
    }
};

/* -------------------------------------------------- */
/* ---------------- UI HELPERS ---------------------- */
/* -------------------------------------------------- */

const UI = {
    showSuccess(id, msg) {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = `<div class="success">${msg}</div>`;
    },
    showError(id, msg) {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = `<div class="error">${msg}</div>`;
    }
};

/* -------------------------------------------------- */
/* ---------------- PAGE INIT ----------------------- */
/* -------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    testConnection();
});
