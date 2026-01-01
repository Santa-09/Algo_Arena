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

        // Valorant Form Submission
        document.addEventListener("DOMContentLoaded", () => {
            console.log("✅ valorant.js loaded");

            const form = document.getElementById("valorantForm");
            if (!form) {
                console.error("❌ valorantForm not found");
                return;
            }

            // 🔒 Last line of defense (NO reload ever)
            document.addEventListener("submit", e => {
                if (e.target.id === "valorantForm") {
                    e.preventDefault();
                }
            });

            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                console.log("🛑 Valorant submit intercepted");

                const submitBtn = form.querySelector(".form-submit");
                submitBtn.disabled = true;

                let supabase;
                try {
                    supabase = window.getSupabase();
                } catch {
                    alert("Supabase not initialized");
                    submitBtn.disabled = false;
                    return;
                }

                const formData = new FormData(form);

                // ✅ Collect tournament types
                const tournamentTypes = [];
                document
                    .querySelectorAll('input[name="tournament_types[]"]:checked')
                    .forEach(cb => tournamentTypes.push(cb.value));

                // ✅ Collect multi-select playstyle
                const playstyle = formData.getAll("playstyle");

                const payload = {
                    fullname: formData.get("fullname"),
                    email: formData.get("email"),
                    phone: formData.get("phone"),
                    country: formData.get("country"),
                    team_name: formData.get("team_name") || null,

                    player1_name: formData.get("player1_name"),
                    player1_riotid: formData.get("player1_riotid"),
                    player2_name: formData.get("player2_name"),
                    player2_riotid: formData.get("player2_riotid"),
                    player3_name: formData.get("player3_name"),
                    player3_riotid: formData.get("player3_riotid"),
                    player4_name: formData.get("player4_name"),
                    player4_riotid: formData.get("player4_riotid"),
                    player5_name: formData.get("player5_name"),
                    player5_riotid: formData.get("player5_riotid"),

                    substitute1_name: formData.get("player6_name") || null,
                    substitute1_riotid: formData.get("player6_riotid") || null,
                    substitute2_name: formData.get("player7_name") || null,
                    substitute2_riotid: formData.get("player7_riotid") || null,

                    tournament_types: tournamentTypes,
                    server: formData.get("server"),
                    current_rank: formData.get("current_rank") || null,
                    playstyle: playstyle,

                    game_type: "valorant",
                    payment_status: "pending",
                    created_at: new Date().toISOString()
                };

                console.log("📦 Valorant Payload:", payload);

                try {
                    const { data, error } = await supabase
                        .from("valorant_registrations")
                        .insert([payload])
                        .select("id")
                        .single();

                    if (error) throw error;

                    console.log("✅ Valorant registered:", data.id);

                    window.location.href = `payment.html?game=valorant&id=${data.id}`;
                } catch (err) {
                    console.error("❌ Valorant insert failed:", err);
                    alert(err.message);
                    submitBtn.disabled = false;
                }
            });
        });
