// js/freefire.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('freefireForm');
    if (!form) return;

    console.log('✅ Free Fire form loaded');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const supabase = window.getSupabase();
        const formData = new FormData(form);

        // ✅ collect tournament types correctly
        const tournamentTypes = [];
        document
            .querySelectorAll('input[name="tournament_types[]"]:checked')
            .forEach(cb => tournamentTypes.push(cb.value));

        // ✅ payload MUST match DB column names
        const payload = {
            fullname: formData.get('fullname'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            country: formData.get('country'),
            timezone: formData.get('timezone') || null,
            team_name: formData.get('team_name') || null,

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

            tournament_types: tournamentTypes, // ✅ NO []
            terms: formData.get('terms') === 'on',

            game_type: 'freefire',
            payment_status: 'pending'
        };

        console.log('📦 Sending Free Fire payload:', payload);

        try {
            const { data, error } = await supabase
                .from('freefire_registrations')
                .insert([payload])
                .select('id')   // ✅ CORRECT
                .single();      // ✅ CORRECT

            if (error) throw error;

            console.log('✅ Free Fire registered:', data.id);

            // redirect to payment
            window.location.href = `payment.html?game=freefire&id=${data.id}`;

        } catch (err) {
            console.error('❌ Insert failed:', err);
            alert(err.message || 'Registration failed');
        }
    });
});
