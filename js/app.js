/**
 * Apex Pulse - Main Application Entry Point & Controller
 */

import { db } from './db.js';
import { sound } from './sound.js';
import { NutritionController } from './nutrition.js';
import { WorkoutController } from './workouts.js';
import { MetricsController } from './metrics.js';
import { PWAManager } from './pwa.js';

class ApexPulseApp {
  constructor() {
    this.selectedDate = this.getTodayDateString();
    this.activeTab = 'dashboard';
    this.profile = null;

    this.nutrition = new NutritionController(this);
    this.workouts = new WorkoutController(this);
    this.metrics = new MetricsController(this);
    this.pwa = new PWAManager();
  }

  getTodayDateString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatDateDisplay(dateStr) {
    const today = this.getTodayDateString();
    if (dateStr === today) return 'Today';

    const d = new Date(dateStr + 'T00:00:00');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split('T')[0];
    if (dateStr === yStr) return 'Yesterday';

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tStr = tomorrow.toISOString().split('T')[0];
    if (dateStr === tStr) return 'Tomorrow';

    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  async init() {
    console.log('[Apex Pulse] Initializing application...');
    
    // Seed starter data if fresh database
    await db.seedDemoDataIfEmpty();
    this.profile = await db.getProfile();

    // Initialize sub-controllers
    await this.nutrition.init();
    await this.workouts.init();
    await this.metrics.init();
    this.pwa.init();

    this.bindGlobalEvents();
    this.switchTab('dashboard');
    await this.renderAll();

    // Check if url hash specifies tab
    const hash = window.location.hash.replace('#', '');
    if (['dashboard', 'nutrition', 'workout', 'metrics', 'settings'].includes(hash)) {
      this.switchTab(hash);
    }
  }

  bindGlobalEvents() {
    // Bottom navigation bar items
    document.querySelectorAll('.bottom-nav-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        sound.tap();
        this.switchTab(tab);
      });
    });

    // Date Navigation
    const prevDateBtn = document.getElementById('btn-prev-date');
    const nextDateBtn = document.getElementById('btn-next-date');
    const dateDisplay = document.getElementById('current-date-display');
    const datePicker = document.getElementById('hidden-date-picker');

    if (prevDateBtn) {
      prevDateBtn.addEventListener('click', () => this.shiftDate(-1));
    }
    if (nextDateBtn) {
      nextDateBtn.addEventListener('click', () => this.shiftDate(1));
    }
    if (dateDisplay && datePicker) {
      dateDisplay.addEventListener('click', () => {
        datePicker.value = this.selectedDate;
        datePicker.showPicker ? datePicker.showPicker() : datePicker.click();
      });
      datePicker.addEventListener('change', (e) => {
        if (e.target.value) {
          this.selectedDate = e.target.value;
          this.renderAll();
        }
      });
    }

    // Floating Action Button (+ Log)
    const fabMain = document.getElementById('fab-main-button');
    const fabMenu = document.getElementById('fab-quick-menu');
    if (fabMain && fabMenu) {
      fabMain.addEventListener('click', () => {
        fabMenu.classList.toggle('active');
        fabMain.classList.toggle('active');
        sound.tap();
      });

      // Close FAB menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!fabMain.contains(e.target) && !fabMenu.contains(e.target)) {
          fabMenu.classList.remove('active');
          fabMain.classList.remove('active');
        }
      });
    }

    // Quick FAB actions
    const fabAddMeal = document.getElementById('fab-action-meal');
    if (fabAddMeal) {
      fabAddMeal.addEventListener('click', () => {
        if (fabMenu) fabMenu.classList.remove('active');
        this.nutrition.openAddFoodModal('lunch');
      });
    }

    const fabStartWorkout = document.getElementById('fab-action-workout');
    if (fabStartWorkout) {
      fabStartWorkout.addEventListener('click', () => {
        if (fabMenu) fabMenu.classList.remove('active');
        this.switchTab('workout');
      });
    }

    const fabAddWeight = document.getElementById('fab-action-weight');
    if (fabAddWeight) {
      fabAddWeight.addEventListener('click', () => {
        if (fabMenu) fabMenu.classList.remove('active');
        const modal = document.getElementById('modal-log-weight');
        if (modal && typeof modal.showModal === 'function') modal.showModal();
      });
    }

    const fabAddWater = document.getElementById('fab-action-water');
    if (fabAddWater) {
      fabAddWater.addEventListener('click', () => {
        if (fabMenu) fabMenu.classList.remove('active');
        this.handleQuickWaterAdd(250);
      });
    }

    // Hydration Card Buttons
    document.querySelectorAll('.btn-water-add').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const amount = parseInt(e.currentTarget.dataset.amount, 10);
        this.handleQuickWaterAdd(amount);
      });
    });

    const btnWaterUndo = document.getElementById('btn-water-undo');
    if (btnWaterUndo) {
      btnWaterUndo.addEventListener('click', () => this.handleWaterUndo());
    }

    // Modal Close Buttons (for any dialog with [data-close-dialog])
    document.querySelectorAll('[data-close-dialog]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const dialog = e.currentTarget.closest('dialog');
        if (dialog && typeof dialog.close === 'function') {
          dialog.close();
        }
      });
    });

    // Profile Settings Form Submit
    const profileForm = document.getElementById('form-profile-settings');
    if (profileForm) {
      profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleSaveProfileSettings();
      });
    }

    // Export Data JSON
    const exportBtn = document.getElementById('btn-export-json');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.handleExportData());
    }

    // Import Data JSON
    const importInput = document.getElementById('input-import-json');
    if (importInput) {
      importInput.addEventListener('change', (e) => this.handleImportData(e));
    }
  }

  shiftDate(deltaDays) {
    const current = new Date(this.selectedDate + 'T00:00:00');
    current.setDate(current.getDate() + deltaDays);
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    this.selectedDate = `${year}-${month}-${day}`;
    sound.tap();
    this.renderAll();
  }

  switchTab(tabId) {
    this.activeTab = tabId;
    window.location.hash = tabId;

    document.querySelectorAll('.tab-view').forEach((view) => {
      view.classList.toggle('active', view.id === `view-${tabId}`);
    });

    document.querySelectorAll('.bottom-nav-item').forEach((item) => {
      item.classList.toggle('active', item.dataset.tab === tabId);
    });

    window.scrollTo({ top: 0, behavior: 'instant' });

    // Refresh specific view data if switching to it
    if (tabId === 'metrics') {
      this.metrics.renderMetricsView();
    } else if (tabId === 'workout') {
      this.workouts.renderWorkoutHistory();
    }
  }

  async handleQuickWaterAdd(amountMl) {
    await db.addWater(this.selectedDate, amountMl);
    sound.tap();
    await this.renderDashboard();
  }

  async handleWaterUndo() {
    const logs = await db.getWaterByDate(this.selectedDate);
    if (logs.length > 0) {
      const last = logs[logs.length - 1];
      await db.deleteWater(last.id);
      sound.tap();
      await this.renderDashboard();
    }
  }

  async handleSaveProfileSettings() {
    const nameInput = document.getElementById('settings-name');
    const calInput = document.getElementById('settings-cal-target');
    const pInput = document.getElementById('settings-protein-target');
    const cInput = document.getElementById('settings-carbs-target');
    const fInput = document.getElementById('settings-fat-target');
    const wInput = document.getElementById('settings-water-target');
    const unitSelect = document.getElementById('settings-unit');

    this.profile.name = nameInput ? nameInput.value.trim() : this.profile.name;
    this.profile.calorieTarget = parseInt(calInput ? calInput.value : 2400, 10);
    this.profile.proteinTarget = parseInt(pInput ? pInput.value : 175, 10);
    this.profile.carbsTarget = parseInt(cInput ? cInput.value : 240, 10);
    this.profile.fatTarget = parseInt(fInput ? fInput.value : 65, 10);
    this.profile.waterTargetMl = parseInt(wInput ? wInput.value : 3000, 10);
    this.profile.unit = unitSelect ? unitSelect.value : 'kg';

    await db.saveProfile(this.profile);
    sound.celebrate();

    const toast = document.getElementById('settings-toast');
    if (toast) {
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 2500);
    }

    this.renderAll();
  }

  async handleExportData() {
    const data = await db.exportFullData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apex-pulse-backup-${this.getTodayDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    sound.setLogged();
  }

  async handleImportData(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      await db.importFullData(parsed);
      this.profile = await db.getProfile();
      sound.celebrate();
      alert('Data restored successfully!');
      this.renderAll();
    } catch (err) {
      alert('Error importing data: ' + err.message);
    }
  }

  async renderAll() {
    this.updateDateDisplay();
    await this.renderDashboard();
    await this.nutrition.renderNutritionView(this.selectedDate);
    if (this.activeTab === 'metrics') {
      await this.metrics.renderMetricsView();
    }
  }

  updateDateDisplay() {
    const displayEl = document.getElementById('current-date-display');
    if (displayEl) {
      displayEl.textContent = this.formatDateDisplay(this.selectedDate);
    }
  }

  async renderDashboard() {
    const meals = await db.getMealsByDate(this.selectedDate);
    const waterLogs = await db.getWaterByDate(this.selectedDate);
    const workouts = await db.getWorkoutsByDate(this.selectedDate);

    // Calculate Nutrition Totals
    const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    meals.forEach((m) => {
      totals.calories += m.calories || 0;
      totals.protein += m.protein || 0;
      totals.carbs += m.carbs || 0;
      totals.fat += m.fat || 0;
    });

    const targetCal = this.profile.calorieTarget || 2400;
    const remainingCal = targetCal - totals.calories;

    // Update Hero Calorie Ring
    const calRemainingEl = document.getElementById('dash-cal-remaining');
    const calTargetEl = document.getElementById('dash-cal-target');
    const calConsumedEl = document.getElementById('dash-cal-consumed');
    const ringCalProgress = document.getElementById('ring-cal-progress');

    if (calRemainingEl) calRemainingEl.textContent = remainingCal;
    if (calTargetEl) calTargetEl.textContent = `${targetCal} kcal`;
    if (calConsumedEl) calConsumedEl.textContent = `${totals.calories} kcal`;

    if (ringCalProgress) {
      const pct = Math.min(100, Math.max(0, (totals.calories / targetCal) * 100));
      const circumference = 2 * Math.PI * 46; // r=46
      ringCalProgress.style.strokeDasharray = circumference;
      ringCalProgress.style.strokeDashoffset = circumference - (pct / 100) * circumference;
    }

    // Update Macro Sub-bars
    const updateMacroBar = (prefix, val, target, unit = 'g') => {
      const valEl = document.getElementById(`dash-${prefix}-val`);
      const targetEl = document.getElementById(`dash-${prefix}-target`);
      const barEl = document.getElementById(`dash-${prefix}-bar`);
      if (valEl) valEl.textContent = `${Math.round(val)}${unit}`;
      if (targetEl) targetEl.textContent = `/ ${target}${unit}`;
      if (barEl) {
        const pct = Math.min(100, (val / target) * 100);
        barEl.style.width = `${pct}%`;
      }
    };

    updateMacroBar('protein', totals.protein, this.profile.proteinTarget || 175);
    updateMacroBar('carbs', totals.carbs, this.profile.carbsTarget || 240);
    updateMacroBar('fat', totals.fat, this.profile.fatTarget || 65);

    // Update Hydration Card
    const totalWaterMl = waterLogs.reduce((acc, cur) => acc + (cur.amountMl || 0), 0);
    const targetWaterMl = this.profile.waterTargetMl || 3000;
    const waterCurrentEl = document.getElementById('dash-water-current');
    const waterTargetEl = document.getElementById('dash-water-target');
    const waterBarEl = document.getElementById('dash-water-progress-fill');

    if (waterCurrentEl) waterCurrentEl.textContent = `${(totalWaterMl / 1000).toFixed(1)}L`;
    if (waterTargetEl) waterTargetEl.textContent = `/ ${(targetWaterMl / 1000).toFixed(1)}L goal`;
    if (waterBarEl) {
      const waterPct = Math.min(100, (totalWaterMl / targetWaterMl) * 100);
      waterBarEl.style.width = `${waterPct}%`;
    }

    // Update Streak Badge
    const streakEl = document.getElementById('dash-streak-count');
    if (streakEl) streakEl.textContent = `${this.profile.activeStreak || 5} Day Streak`;

    // Today's Workout Quick Badge
    const dashWorkoutStatus = document.getElementById('dash-workout-summary');
    if (dashWorkoutStatus) {
      if (workouts.length > 0) {
        const w = workouts[0];
        dashWorkoutStatus.innerHTML = `
          <div class="dash-completed-workout glass-panel">
            <div class="workout-icon-done">✓</div>
            <div class="workout-meta">
              <h4>${w.name}</h4>
              <p>${Math.round((w.durationSec || 0) / 60)} mins • ${Math.round(w.volumeKg || 0)} ${this.profile.unit} volume</p>
            </div>
          </div>
        `;
      } else {
        dashWorkoutStatus.innerHTML = `
          <div class="dash-start-workout-prompt glass-panel" id="dash-prompt-start-workout">
            <div class="prompt-text">
              <h4>Ready to train?</h4>
              <p>No workout logged for this day yet.</p>
            </div>
            <button type="button" class="btn btn-emerald btn-sm" id="btn-dash-start-session">Start Session</button>
          </div>
        `;
        const startBtn = document.getElementById('btn-dash-start-session');
        if (startBtn) {
          startBtn.addEventListener('click', () => this.switchTab('workout'));
        }
      }
    }

    // Fill settings inputs with current profile
    const nameInput = document.getElementById('settings-name');
    const calInput = document.getElementById('settings-cal-target');
    const pInput = document.getElementById('settings-protein-target');
    const cInput = document.getElementById('settings-carbs-target');
    const fInput = document.getElementById('settings-fat-target');
    const wInput = document.getElementById('settings-water-target');
    const unitSelect = document.getElementById('settings-unit');

    if (nameInput) nameInput.value = this.profile.name || 'Venkat';
    if (calInput) calInput.value = this.profile.calorieTarget || 2400;
    if (pInput) pInput.value = this.profile.proteinTarget || 175;
    if (cInput) cInput.value = this.profile.carbsTarget || 240;
    if (fInput) fInput.value = this.profile.fatTarget || 65;
    if (wInput) wInput.value = this.profile.waterTargetMl || 3000;
    if (unitSelect) unitSelect.value = this.profile.unit || 'kg';
  }
}

// Instantiate and attach to window
window.app = new ApexPulseApp();
document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
