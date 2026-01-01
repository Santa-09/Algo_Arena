        // Mobile Navigation Toggle
        document.addEventListener('DOMContentLoaded', function() {
            const hamburger = document.querySelector('.hamburger');
            const mobileMenu = document.querySelector('.mobile-menu');
            const overlay = document.querySelector('.overlay');
            const mobileLinks = document.querySelectorAll('.mobile-nav-menu .nav-link');
            
            // Set current year in footer
            document.getElementById('current-year').textContent = new Date().getFullYear();

            // Toggle mobile menu
            function toggleMobileMenu() {
                hamburger.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                overlay.classList.toggle('active');
                document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            }

            // Hamburger click event
            if (hamburger) {
                hamburger.addEventListener('click', toggleMobileMenu);
            }

            // Overlay click event
            if (overlay) {
                overlay.addEventListener('click', toggleMobileMenu);
            }

            // Mobile link click events
            mobileLinks.forEach(link => {
                link.addEventListener('click', toggleMobileMenu);
            });

            // Close menu on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            });
        });
        // Free Fire Form Submission
        document.addEventListener("DOMContentLoaded", () => {
            console.log("✅ freefire.js loaded");

            const form = document.getElementById("freeFireForm");
            if (!form) {
                console.error("❌ freeFireForm not found");
                return;
            }

            // Submit handler
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                console.log("🛑 Free Fire submit intercepted");

                const submitBtn = form.querySelector(".form-submit");
                if (submitBtn) submitBtn.disabled = true;

                const supabase = window.getSupabase ? window.getSupabase() : null;
                if (!supabase) {
                    alert("Supabase not initialized");
                    if (submitBtn) submitBtn.disabled = false;
                    return;
                }

                const formData = new FormData(form);

                // Collect tournament types
                const tournamentTypes = [];
                document
                    .querySelectorAll('input[name="tournament_types[]"]:checked')
                    .forEach(cb => tournamentTypes.push(cb.value));

                const payload = {
                    fullname: formData.get("fullname"),
                    email: formData.get("email"),
                    phone: formData.get("phone"),
                    country: formData.get("country"),
                    team_name: formData.get("team_name"),

                    player1_name: formData.get("player1_name"),
                    player1_uid: formData.get("player1_uid"),
                    player2_name: formData.get("player2_name"),
                    player2_uid: formData.get("player2_uid"),
                    player3_name: formData.get("player3_name"),
                    player3_uid: formData.get("player3_uid"),
                    player4_name: formData.get("player4_name"),
                    player4_uid: formData.get("player4_uid"),

                    player5_name: formData.get("player5_name") || null,
                    player5_uid: formData.get("player5_uid") || null,
                    player6_name: formData.get("player6_name") || null,
                    player6_uid: formData.get("player6_uid") || null,

                    tournament_types: tournamentTypes,
                    timezone: formData.get("timezone") || null,

                    game_type: "freefire",
                    payment_status: "pending",
                    created_at: new Date().toISOString()
                };

                console.log("📦 Payload:", payload);

                try {
                    const { data, error } = await supabase
                        .from("freefire_registrations")
                        .insert([payload])
                        .select("id")
                        .single();

                    if (error) throw error;

                    console.log("✅ Inserted ID:", data.id);

                    window.location.href = `payment.html?game=freefire&id=${data.id}`;
                } catch (err) {
                    console.error("❌ Insert failed:", err);
                    alert(err.message);
                    if (submitBtn) submitBtn.disabled = false;
                }
            });
        });
