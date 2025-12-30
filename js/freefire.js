/**
 * Free Fire Registration
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('freeFireForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(form).entries());
        data.gameType = 'freefire';
        data.created_at = new Date().toISOString();

        Session.saveRegistration('freefire', data);

        console.log('✅ Free Fire data saved:', data);

        window.location.href = 'payment.html';
    });
});
