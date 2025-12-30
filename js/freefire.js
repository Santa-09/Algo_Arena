document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('freeFireForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const supabase = window.getSupabase();
        const raw = Object.fromEntries(new FormData(form).entries());

        // ✅ SEND ONLY DB COLUMNS
        const data = {
            fullname: raw.fullname,
            email: raw.email,
            phone: raw.phone,
            country: raw.country,
            team_name: raw.team_name,

            player1_name: raw.player1_name,
            player1_uid: raw.player1_uid,
            player2_name: raw.player2_name,
            player2_uid: raw.player2_uid,
            player3_name: raw.player3_name,
            player3_uid: raw.player3_uid,
            player4_name: raw.player4_name,
            player4_uid: raw.player4_uid,

            game_type: 'freefire',
            payment_status: 'pending',
            created_at: new Date().toISOString()
        };

        try {
            const { data: inserted, error } = await supabase
                .from(TABLES.FREE_FIRE)
                .insert([data])
                .select('id')
                .single();

            if (error) throw error;

            window.location.href = `payment.html?game=freefire&id=${inserted.id}`;

        } catch (err) {
            console.error('Insert failed:', err);
            alert('Registration failed. Check console.');
        }
    });
});
