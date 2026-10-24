# ⚡ VenKinetics — Precision Fitness & Nutrition Tracker

> **A high-performance Progressive Web App (PWA) for logging workouts, tracking daily macros, and monitoring hydration with a sleek obsidian and emerald glassmorphism aesthetic.** Designed for seamless, distraction-free daily use and installable directly on iOS and Android home screens.

🌐 **Live App**: [https://venmanna.github.io/venkinetics/](https://venmanna.github.io/venkinetics/)

---

## ✨ Features

### 🥗 1. Nutrition & Macro Tracking
- **Smart Macro Calculator**: Real-time tracking of calories, protein, carbohydrates, and fats.
- **Hero Circular Rings**: Animated SVG progress ring showing consumed vs. remaining calorie targets with sub-bars for individual macros.
- **50+ Preloaded Healthy Foods**: High-protein staples (grilled chicken breast, steak, salmon, eggs, whey isolate, Greek yogurt), complex carbs (oats, quinoa, jasmine rice, sweet potatoes), and healthy fats (avocado, olive oil, almonds, peanut butter).
- **Portion Scaler**: Dynamically scale servings by grams or units with automatic macro recomputation.
- **Quick Calorie Entry**: Rapid entry for quick meals on the go.
- **Custom Foods Catalog**: Save custom recipes and ingredients directly to local offline storage.

### 🏋️‍♂️ 2. Gym & Workout Logger
- **Routine Templates**: Pre-configured routines including Push Day, Pull Day, Legs & Core, Upper Body Power, and Full Body Athlete.
- **Live Active Session Mode**: Live session stopwatch, exercise order, and set-by-set weight and rep logging.
- **Integrated Rest Timer**: Floating sticky timer with 30s, 60s, 90s presets, +30s booster, Web Audio synthesizer chime, and mobile vibration haptic alerts.
- **60+ Exercise Database**: Filterable exercise catalog categorized by muscle groups (Chest, Back, Quads, Hamstrings, Shoulders, Arms, Core, Cardio).
- **Personal Records (PRs)**: Automatically scans workout logs to highlight all-time maximum weights and 1RM lifts.

### 💧 3. Hydration & Daily Habits
- **One-Tap Water Logging**: Quick `+250ml`, `+500ml`, and `+1.0L` buttons with animated fluid level indicators.
- **Undo Support**: Easily correct accidental hydration entries.
- **Consistency Streak**: Daily habit tracker to maintain momentum.

### 📈 4. Body Metrics & Canvas Analytics
- **Weight Progression Chart**: Hardware-accelerated High-DPI Canvas line chart with emerald glow and smoothed Bezier curves.
- **Weekly Calorie Intake**: 7-day bar chart comparing daily intake directly against your target benchmark.
- **Timeline Logs**: Clean history of past weigh-ins and completed gym sessions.

### 🔒 5. Privacy-First & 100% Offline
- **Zero Cloud Tracking**: All workout logs, meals, and body metrics remain private on the device in **IndexedDB**.
- **Full Offline Functionality**: Works in basement gyms, outdoors, or in airplane mode without internet connectivity.
- **JSON Backup & Restore**: One-click export to download all data, or import it to another device anytime.

---

## 📱 Installation (iOS & Android)

VenKinetics is an installable Progressive Web App (PWA). It runs in full-screen standalone mode with no browser address bars:

### iPhone & iPad (Safari)
1. Open [https://venmanna.github.io/venkinetics/](https://venmanna.github.io/venkinetics/) in **Safari**.
2. Tap the **Share** button at the bottom center (box with an upward arrow).
3. Scroll down and tap **"Add to Home Screen"**.
4. Tap **Add** in the top right.

### Android (Chrome)
1. Open [https://venmanna.github.io/venkinetics/](https://venmanna.github.io/venkinetics/) in **Chrome**.
2. Tap the three-dot menu (**⋮**) in the top right.
3. Select **"Install app"** or **"Add to Home screen"**.

---

## 💻 Running Locally

To run the application locally on your machine:

```bash
# Clone the repository
git clone https://github.com/venmanna/venkinetics.git
cd venkinetics

# Start a local static server using Python
python -m http.server 8080

# Or start using npm / npx
npm start
```

Then open `http://localhost:8080` in any web browser.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: Vanilla HTML5, Modern ES Modules, CSS Custom Properties (Obsidian & Emerald Glassmorphism)
- **Local Storage**: IndexedDB (`venkinetics_db`) with transactional safety and versioning
- **Audio & Haptics**: Web Audio API oscillator synthesis and `navigator.vibrate`
- **Charts**: High-DPI Canvas 2D Rendering Engine
- **Offline / PWA**: Service Worker (`venkinetics-v4`) with cache-first and network-first fallback strategies
