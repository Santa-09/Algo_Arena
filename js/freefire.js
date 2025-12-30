document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('freeFireForm');
    if (!form) return;

    console.log('✅ freefire.js loaded');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // 🔥 STOPS PAGE RELOAD
        console.log('🛑 Form submit intercepted');

        const submitBtn = form.querySelector('.form-submit');
        submitBtn.disabled = true;

        const supabase = window.getSupabase(); // from supabaseClient.js
        const formData = new FormData(form);

        // Build payload EXACTLY matching Supabase columns
        const payload = {
            fullname: formData.get('fullname'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            country: formData.get('country'),
            team_name: formData.get('team_name'),

            player1_name: formData.get('player1_name'),
            player1_uid: formData.get('player1_uid'),
            player2_name: formData.get('player2_name'),
            player2_uid: formData.get('player2_uid'),
            player3_name: formData.get('player3_name'),
            player3_uid: formData.get('player3_uid'),
            player4_name: formData.get('player4_name'),
            player4_uid: formData.get('player4_uid'),

            player5_name: formData.get('player5_name') || null,
            player5_uid: formData.get('player5_uid') || null,
            player6_name: formData.get('player6_name') || null,
            player6_uid: formData.get('player6_uid') || null,

            game_type: 'freefire',
            payment_status: 'pending',
            created_at: new Date().toISOString()
        };

        console.log('📦 Payload:', payload);

        try {
            const { data, error } = await supabase
                .from('freefire_registrations')
                .insert([payload])
                .select('id')
                .single();

            if (error) throw error;

            console.log('✅ Inserted ID:', data.id);

            // redirect manually (NO reload)
            window.location.href = `payment.html?game=freefire&id=${data.id}`;

        } catch (err) {
            console.error('❌ Supabase error:', err);
            alert(err.message);
            submitBtn.disabled = false;
        }
    });
});
