/**
 * Valorant Registration
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('valorantForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(form).entries());
        data.gameType = 'valorant';
        data.created_at = new Date().toISOString();

        Session.saveRegistration('valorant', data);

        console.log('✅ Valorant data saved:', data);

        window.location.href = 'payment.html';
    });
});
