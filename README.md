# ✨ Outside Invitation Web App (React 18 + Tailwind CSS)

A romantic, playful, and responsive web application to ask someone out on a date, built with **React 18**, **Vite**, **Tailwind CSS**, **Lucide Icons**, and **Canvas-Confetti**. 100% frontend with local activity records & zero-backend push notifications!

---

## 🌟 Interactive Flow & Features

1. **Step 1 — The Question & Runaway "No" Button**:
   - Two buttons: **"YES, absolutely! 🥰"** and **"No 🙈"**.
   - When she hovers, moves cursor near, or taps "No" on mobile, the button dodges and teleports away with cute messages (*"Are you sure? 🥺"*, *"Think again! 😉"*, *"You can't catch me! 💨"*).
   - Every dodge scales up the **"Yes"** button slightly to make it irresistible!

2. **Step 2 — Interactive Calendar**:
   - Multi-month navigation calendar with past dates disabled.
   - Quick date shortcuts: *"Today"*, *"Tomorrow"*, *"This Weekend"*.

3. **Step 3 — Place & Vibe Selection**:
   - 6 visual cards (*Cozy Cafe ☕, Food & Dinner 🍕, Cinema / Movie 🍿, Sunset Walk 🌅, Arcade / Games 🎮, or Custom Surprise ✨*).
   - Custom text input to specify any restaurant or activity.

4. **Step 4 — Time & Food Craving**:
   - Quick time slots (*Lunch, Afternoon, Evening*), custom time picker, and an optional note/craving text box (*"Craving sushi, or pick me up at 7!"*).

5. **Step 5 — Celebration & WhatsApp Share**:
   - Confetti celebration burst.
   - Summary recap card with Date, Place, Time, and Note.
   - 1-tap **"Send Confirmation on WhatsApp"** button.

6. **Admin Dashboard & Activity Record (100% Frontend)**:
   - **How to open Admin**:
     - Click the subtle **shield icon (🛡️)** in the top right, **OR**
     - Press <kbd>Shift</kbd> + <kbd>A</kbd>, **OR**
     - Open the link with `#admin` (e.g., `http://localhost:3000/#admin`).
   - **Default Admin PIN**: `1234`
   - **Tracks**:
     - Total visit count.
     - Number of times she tried to hover / click "No".
     - Date, Place, Time, and Note selected.
     - Timestamped activity log table with JSON export & reset options.
   - **Cross-Device Alerts (Zero-Backend)**:
     - In the Admin settings, enter an optional free **Discord Webhook** URL or Formspree endpoint. When she opens the invitation or accepts on her phone, you will receive an instant push notification on yours!

7. **URL Customization**:
   - Personalize easily via query parameters:
     `http://localhost:3000/?name=Sarah&phone=919876543210`

---

## 🚀 How to Run the React App

In this folder (`d:\outside`):

### 1. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Build for Production
```bash
npm run build
```
Generates a super-optimized production build in the `dist/` directory ready to deploy on **Vercel**, **Netlify**, or **GitHub Pages**.

---

## 📁 React Project Structure
```text
d:\outside/
├── index.html                   # HTML Entry Point
├── package.json                 # Dependencies & scripts
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── src/
│   ├── main.jsx                 # React root mount
│   ├── App.jsx                  # Main App component & step manager
│   ├── index.css                # Tailwind directives & custom animations
│   ├── components/
│   │   ├── Step1BigQuestion.jsx # Runaway No button & Yes action
│   │   ├── Step2Calendar.jsx    # Custom date picker
│   │   ├── Step3Place.jsx       # Place & vibe selector
│   │   ├── Step4Time.jsx        # Time picker & craving note
│   │   ├── Step5Confirmation.jsx# Celebration recap & WhatsApp link
│   │   ├── AdminModal.jsx       # Password-protected admin dashboard
│   │   └── FloatingHearts.jsx   # Ambient animated hearts background
│   └── utils/
│       ├── storage.js           # LocalStorage analytics & settings manager
│       └── webhook.js           # Zero-backend phone notifications
└── dist/                        # Production build
```
