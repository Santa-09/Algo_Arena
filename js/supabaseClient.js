/**
 * Algo Arena - Supabase Client Configuration
 * Professional Esports Platform Database Connection
 */

// Supabase Configuration
const SUPABASE_URL = 'https://dgkbaeyfgvrgaampbiua.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_CJ2_wPie8LH6WJSpajhBEQ_wHB82YvG';

// Initialize Supabase Client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Supabase Table Names
const TABLES = {
    FREE_FIRE: 'freefire_registrations',
    VALORANT: 'valorant_registrations',
    PAYMENTS: 'payments',
    CONTACTS: 'contact_messages',
    USERS: 'users',
    TOURNAMENTS: 'tournaments'
};

/**
 * Test Database Connection
 * @returns {Promise<boolean>} Connection status
 */
async function testConnection() {
    try {
        const { data, error } = await supabase
            .from(TABLES.FREE_FIRE)
            .select('count')
            .limit(1);
        
        if (error) throw error;
        console.log('✅ Supabase connection successful');
        return true;
    } catch (error) {
        console.error('❌ Supabase connection failed:', error.message);
        return false;
    }
}

/**
 * Get Supabase Client
 * @returns {Object} Supabase client instance
 */
function getSupabaseClient() {
    return supabase;
}

/**
 * Get Table Names
 * @returns {Object} Table names object
 */
function getTables() {
    return TABLES;
}

/**
 * Utility Functions for Data Operations
 */
const Database = {
    /**
     * Insert data into a table
     * @param {string} table - Table name
     * @param {Object} data - Data to insert
     * @returns {Promise<Object>} Insert result
     */
    async insert(table, data) {
        try {
            const { data: result, error } = await supabase
                .from(table)
                .insert([data])
                .select();
            
            if (error) throw error;
            return { success: true, data: result[0] };
        } catch (error) {
            console.error(`❌ Insert failed for ${table}:`, error.message);
            return { success: false, error: error.message };
        }
    },

    /**
     * Update data in a table
     * @param {string} table - Table name
     * @param {Object} data - Data to update
     * @param {Object} match - Match conditions
     * @returns {Promise<Object>} Update result
     */
    async update(table, data, match) {
        try {
            const { data: result, error } = await supabase
                .from(table)
                .update(data)
                .match(match)
                .select();
            
            if (error) throw error;
            return { success: true, data: result[0] };
        } catch (error) {
            console.error(`❌ Update failed for ${table}:`, error.message);
            return { success: false, error: error.message };
        }
    },

    /**
     * Select data from a table
     * @param {string} table - Table name
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Query result
     */
    async select(table, options = {}) {
        try {
            let query = supabase.from(table).select('*');
            
            // Apply filters
            if (options.match) {
                query = query.match(options.match);
            }
            
            // Apply ordering
            if (options.orderBy) {
                query = query.order(options.orderBy.column, { 
                    ascending: options.orderBy.ascending !== false 
                });
            }
            
            // Apply limits
            if (options.limit) {
                query = query.limit(options.limit);
            }
            
            // Apply range
            if (options.range) {
                query = query.range(options.range.from, options.range.to);
            }
            
            const { data, error, count } = await query;
            
            if (error) throw error;
            return { success: true, data, count };
        } catch (error) {
            console.error(`❌ Select failed for ${table}:`, error.message);
            return { success: false, error: error.message };
        }
    },

    /**
     * Delete data from a table
     * @param {string} table - Table name
     * @param {Object} match - Match conditions
     * @returns {Promise<Object>} Delete result
     */
    async delete(table, match) {
        try {
            const { error } = await supabase
                .from(table)
                .delete()
                .match(match);
            
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error(`❌ Delete failed for ${table}:`, error.message);
            return { success: false, error: error.message };
        }
    },

    /**
     * Upload file to storage
     * @param {string} bucket - Storage bucket name
     * @param {string} path - File path
     * @param {File} file - File object
     * @returns {Promise<Object>} Upload result
     */
    async uploadFile(bucket, path, file) {
        try {
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(path, file);
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error(`❌ File upload failed for ${bucket}:`, error.message);
            return { success: false, error: error.message };
        }
    },

    /**
     * Get file URL from storage
     * @param {string} bucket - Storage bucket name
     * @param {string} path - File path
     * @returns {string} Public URL
     */
    getFileUrl(bucket, path) {
        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);
        
        return data.publicUrl;
    }
};

/**
 * Session Storage Utility
 */
const Session = {
    /**
     * Save registration data
     * @param {string} game - Game type
     * @param {Object} data - Registration data
     */
    saveRegistration(game, data) {
        sessionStorage.setItem(`${game}_registration`, JSON.stringify(data));
    },

    /**
     * Get registration data
     * @param {string} game - Game type
     * @returns {Object|null} Registration data
     */
    getRegistration(game) {
        const data = sessionStorage.getItem(`${game}_registration`);
        return data ? JSON.parse(data) : null;
    },

    /**
     * Clear registration data
     * @param {string} game - Game type
     */
    clearRegistration(game) {
        sessionStorage.removeItem(`${game}_registration`);
    },

    /**
     * Save payment data
     * @param {Object} data - Payment data
     */
    savePayment(data) {
        sessionStorage.setItem('payment_data', JSON.stringify(data));
    },

    /**
     * Get payment data
     * @returns {Object|null} Payment data
     */
    getPayment() {
        const data = sessionStorage.getItem('payment_data');
        return data ? JSON.parse(data) : null;
    },

    /**
     * Clear all session data
     */
    clearAll() {
        sessionStorage.clear();
    }
};

/**
 * Form Validation Utility
 */
const Validator = {
    /**
     * Validate email address
     * @param {string} email - Email to validate
     * @returns {boolean} Validation result
     */
    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    /**
     * Validate phone number
     * @param {string} phone - Phone number to validate
     * @returns {boolean} Validation result
     */
    validatePhone(phone) {
        const regex = /^[\+]?[1-9][\d]{0,15}$/;
        return regex.test(phone.replace(/[\s\-\(\)]/g, ''));
    },

    /**
     * Validate required fields
     * @param {Object} fields - Fields to validate
     * @returns {Object} Validation result
     */
    validateRequired(fields) {
        const errors = {};
        
        Object.entries(fields).forEach(([key, value]) => {
            if (!value || value.trim() === '') {
                errors[key] = 'This field is required';
            }
        });
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    },

    /**
     * Validate tournament-specific fields
     * @param {string} game - Game type
     * @param {Object} data - Form data
     * @returns {Object} Validation result
     */
    validateGameData(game, data) {
        const errors = {};
        
        if (game === 'freefire') {
            // Validate Free Fire UID format
            if (data.uid && !/^\d{8,12}$/.test(data.uid)) {
                errors.uid = 'Invalid Free Fire UID format';
            }
        } else if (game === 'valorant') {
            // Validate Riot ID format (name#tag)
            if (data.riotId && !/^[\w\s]+#[\w\d]+$/.test(data.riotId)) {
                errors.riotId = 'Invalid Riot ID format (e.g., AlgoArena#1234)';
            }
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
};

/**
 * UI Helper Functions
 */
const UI = {
    /**
     * Show loading spinner
     * @param {string} containerId - Container ID
     */
    showLoader(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            const loader = document.createElement('div');
            loader.className = 'spinner';
            container.appendChild(loader);
            loader.style.display = 'block';
        }
    },

    /**
     * Hide loading spinner
     * @param {string} containerId - Container ID
     */
    hideLoader(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            const loader = container.querySelector('.spinner');
            if (loader) loader.remove();
        }
    },

    /**
     * Show success message
     * @param {string} containerId - Container ID
     * @param {string} message - Message to display
     */
    showSuccess(containerId, message) {
        const container = document.getElementById(containerId);
        if (container) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'form-message success';
            messageDiv.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <div>${message}</div>
            `;
            container.prepend(messageDiv);
            
            // Auto-remove after 5 seconds
            setTimeout(() => messageDiv.remove(), 5000);
        }
    },

    /**
     * Show error message
     * @param {string} containerId - Container ID
     * @param {string} message - Message to display
     */
    showError(containerId, message) {
        const container = document.getElementById(containerId);
        if (container) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'form-message error';
            messageDiv.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <div>${message}</div>
            `;
            container.prepend(messageDiv);
            
            // Auto-remove after 5 seconds
            setTimeout(() => messageDiv.remove(), 5000);
        }
    },

    /**
     * Scroll to element
     * @param {string} elementId - Element ID
     */
    scrollTo(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    },

    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const hamburger = document.querySelector('.hamburger');
        const overlay = document.querySelector('.overlay');
        
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = mobileMenu.classList.contains('active') 
            ? 'hidden' 
            : 'auto';
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Test database connection
    testConnection();
    
    // Initialize animations
    initAnimations();
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
});

/**
 * Initialize animation observer
 */
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.fade-in, .slide-left, .slide-right, .scale-in, .stagger-fade');
    animatedElements.forEach(el => observer.observe(el));
}

// Export utilities for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getSupabaseClient,
        getTables,
        Database,
        Session,
        Validator,
        UI
    };
}