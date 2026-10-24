# ⚡ VenKinetics — Precision Fitness & Nutrition Tracker

> **VenKinetics: Premium personal fitness, workout logger, calorie and macro nutrition tracker with Obsidian & Emerald Glassmorphism aesthetics.** Engineered by **Venkat** as an offline-first Progressive Web App (PWA) ready to install on your iPhone or Android home screen.

---

## ✨ Features

### 🥗 1. Macro & Nutrition Tracker
- **Smart Macro Calculator**: Tracks daily calories, protein, carbohydrates, and fats in real-time.
- **Hero Circular Rings**: Animated SVG progress ring showing consumed vs remaining calories and visual bars for protein, carbs, and fat.
- **50+ Preloaded Foods Database**: High-protein staples (grilled chicken breast, steak, salmon, eggs, whey isolate, Greek yogurt), complex carbs (oats, quinoa, jasmine rice, sweet potatoes), and healthy fats (avocado, olive oil, almonds, peanut butter).
- **Portion Multiplier**: Scale servings seamlessly by grams or units with automatic macro recalculations.
- **Quick Calorie Add**: Instant entry for quick meals on the go.
- **Custom Foods Engine**: Add your own recipes and custom foods directly to your offline catalog.

### 🏋️‍♂️ 2. Gym & Workout Logger
- **Routine Templates**: Pre-configured with Push Day, Pull Day, Legs, Upper Body, and Full Body workouts.
- **Live Active Session Mode**: Live workout timer stopwatch, exercise order, and set-by-set weight and rep tracking.
- **Integrated Rest Timer**: Floating sticky timer with 30s, 60s, 90s presets, +30s booster, Web Audio synthesizer chime, and mobile vibration haptic alerts.
- **Exercise Library**: 60+ exercises categorized by muscle groups (Chest, Back, Quads, Hamstrings, Shoulders, Arms, Core, Cardio).
- **Personal Records (PRs)**: Automatically scans workout logs to celebrate all-time maximum weights and 1RM lifts.

### 💧 3. Hydration & Daily Habits
- **One-Tap Water Logging**: Quick +250ml, +500ml, and +1000ml buttons with animated fluid fill bar and daily goal tracking.
- **Undo Support**: Tap undo if you accidentally logged extra water.
- **Consistency Streak**: Daily active habit tracker to maintain momentum.

### 📈 4. Body Metrics & Canvas Analytics
- **Weight Progression Chart**: Hardware-accelerated High-DPI Canvas line chart with emerald glow and smoothed Bezier curves.
- **Weekly Calorie Intake**: 7-day bar chart comparing daily intake directly against your target benchmark.
- **History Logs**: Clean timeline of your weigh-ins and completed workouts.

### 🔒 5. Privacy-First & 100% Offline
- **Zero Cloud Tracking**: All your workout data, meals, and body metrics remain private on your device in **IndexedDB**.
- **Works Without Internet**: Use it in basement gyms or airplane mode without losing a beat.
- **Full JSON Backup & Restore**: One-click export to download all your data, or import it to another device anytime.

---

## 📱 How to Install on Your Phone

VenKinetics is a Progressive Web App (PWA) and can be added directly to your phone's home screen for a full-screen, standalone app experience:

### On iPhone & iPad (Safari)
1. Open the hosted URL or local network address (`http://10.0.0.253:8080`) in **Safari**.
2. Tap the **Share** button (the square icon with the upward arrow at the bottom).
3. Scroll down and tap **"Add to Home Screen"**.
4. Tap **Add** in the top right.
5. The **VenKinetics** icon will appear on your phone home screen just like an App Store app!

### On Android (Chrome)
1. Open the URL in **Chrome**.
2. Tap the three-dot menu (**⋮**) in the upper right.
3. Select **"Install app"** or **"Add to Home screen"**.
4. Confirm to install.

---

## 🚀 Running Locally

```bash
# Clone the repository
git clone <your-repo-url>
cd apex-fitness

# Start a local static server
npm start
# or using python
python -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

---

## 🐙 Pushing to Your GitHub Repository

To safely connect and push this project to your GitHub account:

### Step 1: Create a Repository on GitHub
1. Go to [GitHub.com/new](https://github.com/new) and create a new repository (e.g. `venkinetics`).
2. Do not check "Initialize with README".

### Step 2: Link and Push
```bash
# Add your repository as remote (replace with your GitHub username)
git remote add origin https://github.com/<YOUR-USERNAME>/venkinetics.git

# Push your code (Git Credential Manager will securely prompt you to log in)
git push -u origin main
```

> **Optional**: To enable **free hosting via GitHub Pages**:
> In your GitHub repository:
> Go to **Settings** → **Pages** → Under **Build and deployment**, select **Source: Deploy from a branch** → Branch: `main` / `/ (root)` → Click **Save**.
> Your app will be live on `https://<YOUR-USERNAME>.github.io/venkinetics/`!

---

*Engineered with precision for peak human performance.*
