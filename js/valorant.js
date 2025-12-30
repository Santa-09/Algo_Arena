document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('valorantForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const supabase = window.getSupabase();
        const data = Object.fromEntries(new FormData(form).entries());

        data.game_type = 'valorant';
        data.payment_status = 'pending';
        data.created_at = new Date().toISOString();

        try {
            const { data: inserted, error } = await supabase
                .from(TABLES.VALORANT)
                .insert([data])
                .select('id')
                .single();

            if (error) throw error;

            window.location.href = `payment.html?game=valorant&id=${inserted.id}`;

        } catch (err) {
            console.error(err);
            alert('Registration failed. Please try again.');
        }
    });
});
