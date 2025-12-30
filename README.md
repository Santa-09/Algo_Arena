# 🎮 Algo Arena – Esports Tournament Platform

Algo Arena is a modern, responsive **esports tournament registration platform** built using **HTML, CSS, JavaScript, and Supabase**.  
It allows players to register for **Free Fire** and **Valorant** tournaments and complete payments via **UPI QR**.

---

## 🚀 Live Features

- 🕹️ Free Fire Tournament Registration  
- 🎯 Valorant Tournament Registration  
- 💳 UPI QR-based Payment System  
- ☁️ Supabase Database Integration  
- 📱 Fully Responsive UI  
- 🔒 Secure client-side validation  
- ⚡ Fast static-site deployment (Vercel / Netlify)

---

## 📁 Project Structure

project/
├── public/
│ └── algo-arena.png # Logo / Favicon
├── js/
│ ├── main.js # Global scripts
│ ├── supabaseClient.js # Supabase configuration
│ ├── freefire.js # Free Fire logic
│ ├── valorant.js # Valorant logic
│ └── payment.js # Payment handling
├── index.html # Home page
├── free-fire.html # Free Fire registration
├── valo.html # Valorant registration
└── payment.html # Payment page


---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Database:** Supabase (PostgreSQL)
- **Payments:** UPI QR Code
- **Hosting:** Vercel / Netlify
- **Icons & Fonts:** Font Awesome, Google Fonts

---

## 🔗 Supabase Tables Used

- `freefire_registrations`
- `valorant_registrations`
- `payments`

All data is stored securely using Supabase’s REST API.

---

## 📦 Deployment Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/algo-arena.git
cd algo-arena

