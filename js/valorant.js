// js/valorant.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('valorantForm');
    if (!form) return;

    console.log('✅ Valorant form loaded');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const supabase = window.getSupabase();
        const formData = new FormData(form);

        // ✅ collect tournament types (checkboxes)
        const tournamentTypes = [];
        document
            .querySelectorAll('input[name="tournament_types[]"]:checked')
            .forEach(cb => tournamentTypes.push(cb.value));

        // ✅ build clean payload (ONLY DB COLUMNS)
        const data = {
            fullname: formData.get('fullname'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            country: formData.get('country'),
            team_name: formData.get('team_name') || null,

            player1_name: formData.get('player1_name'),
            player1_riotid: formData.get('player1_riotid'),
            player2_name: formData.get('player2_name'),
            player2_riotid: formData.get('player2_riotid'),
            player3_name: formData.get('player3_name'),
            player3_riotid: formData.get('player3_riotid'),
            player4_name: formData.get('player4_name'),
            player4_riotid: formData.get('player4_riotid'),
            player5_name: formData.get('player5_name'),
            player5_riotid: formData.get('player5_riotid'),

            substitute1_name: formData.get('player6_name') || null,
            substitute1_riotid: formData.get('player6_riotid') || null,
            substitute2_name: formData.get('player7_name') || null,
            substitute2_riotid: formData.get('player7_riotid') || null,

            server: formData.get('server'),
            current_rank: formData.get('current_rank') || null,
            playstyle: formData.getAll('playstyle'),

            tournament_types: tournamentTypes,
            game_type: 'valorant',
            payment_status: 'pending',
            created_at: new Date().toISOString()
        };

        console.log('📦 Sending Valorant data:', data);

        try {
            const { data: inserted, error } = await supabase
                .from('valorant_registrations')
                .insert([data])
                .select('id')
                .single();

            if (error) throw error;

            console.log('✅ Valorant registered:', inserted.id);

            // 👉 redirect to payment page with ID
            window.location.href = `payment.html?game=valorant&id=${inserted.id}`;

        } catch (err) {
            console.error('❌ Valorant insert failed:', err);
            alert('Registration failed. Check console.');
        }
    });
});
