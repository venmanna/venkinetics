/**
 * Apex Pulse - Metrics, Body Stats & PR Controller
 */

import { db } from './db.js';
import { sound } from './sound.js';
import { ChartEngine } from './chart.js';

export class MetricsController {
  constructor(app) {
    this.app = app;
    this.timeframeDays = 14;
  }

  async init() {
    this.bindEvents();
  }

  bindEvents() {
    // Timeframe selector buttons (7d, 14d, 30d, all)
    document.querySelectorAll('.timeframe-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.timeframe-btn').forEach((b) => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.timeframeDays = parseInt(e.currentTarget.dataset.days, 10) || 14;
        this.renderMetricsView();
      });
    });

    // Log weight form submit
    const logWeightBtn = document.getElementById('btn-submit-weight-log');
    if (logWeightBtn) {
      logWeightBtn.addEventListener('click', () => this.handleLogWeightSubmit());
    }
  }

  async handleLogWeightSubmit() {
    const input = document.getElementById('input-log-weight');
    const notesInput = document.getElementById('input-log-weight-notes');
    const val = parseFloat(input ? input.value : 0);
    if (!val || val <= 0) return;

    await db.addWeight({
      date: this.app.selectedDate,
      weight: val,
      notes: notesInput ? notesInput.value.trim() : ''
    });

    sound.setLogged();
    if (input) input.value = '';
    if (notesInput) notesInput.value = '';

    const modal = document.getElementById('modal-log-weight');
    if (modal && typeof modal.close === 'function') modal.close();

    this.app.renderAll();
  }

  async renderMetricsView() {
    const weights = await db.getAllWeights();
    const workouts = await db.getAllWorkouts();
    const unit = this.app.profile.unit || 'kg';

    // Current & Delta Weight
    const currentWeightEl = document.getElementById('metric-current-weight');
    const deltaWeightEl = document.getElementById('metric-weight-delta');
    const latest = weights.length > 0 ? weights[weights.length - 1] : null;

    if (currentWeightEl) {
      currentWeightEl.textContent = latest ? `${latest.weight} ${unit}` : `-- ${unit}`;
    }

    if (deltaWeightEl && weights.length >= 2) {
      const first = weights[0];
      const diff = Math.round((latest.weight - first.weight) * 10) / 10;
      const sign = diff > 0 ? '+' : '';
      deltaWeightEl.textContent = `${sign}${diff} ${unit} since ${first.date.slice(5)}`;
      deltaWeightEl.className = 'metric-delta ' + (diff < 0 ? 'text-emerald' : 'text-neutral');
    }

    // Filter weights by timeframe
    let chartWeights = [...weights];
    if (this.timeframeDays > 0 && chartWeights.length > this.timeframeDays) {
      chartWeights = chartWeights.slice(-this.timeframeDays);
    }

    // Render Canvas Weight Chart
    const weightCanvas = document.getElementById('weight-chart-canvas');
    if (weightCanvas) {
      ChartEngine.renderWeightChart(weightCanvas, chartWeights, unit);
    }

    // Weekly Calorie Bar Chart
    const calCanvas = document.getElementById('weekly-calorie-canvas');
    if (calCanvas) {
      const weeklyDays = await this.getWeeklyCalorieData();
      ChartEngine.renderCalorieBarChart(calCanvas, weeklyDays, this.app.profile.calorieTarget || 2400);
    }

    // Render PRs (Personal Records)
    this.renderPersonalRecords(workouts, unit);

    // Render Weight History Table
    this.renderWeightHistoryList(weights, unit);
  }

  async getWeeklyCalorieData() {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const meals = await db.getMealsByDate(dateStr);
      const totalCal = meals.reduce((acc, m) => acc + (m.calories || 0), 0);

      days.push({
        date: dateStr,
        label: i === 0 ? 'Today' : dayNames[d.getDay()],
        calories: totalCal
      });
    }
    return days;
  }

  renderPersonalRecords(workouts, unit) {
    const prContainer = document.getElementById('prs-container');
    if (!prContainer) return;

    // Track max weight lifted per exercise name
    const prMap = {};
    workouts.forEach((w) => {
      (w.exercises || []).forEach((ex) => {
        (ex.sets || []).forEach((s) => {
          if (s.completed && s.weight > 0) {
            const current = prMap[ex.name];
            if (!current || s.weight > current.weight) {
              prMap[ex.name] = {
                weight: s.weight,
                reps: s.reps,
                date: w.date
              };
            }
          }
        });
      });
    });

    const entries = Object.entries(prMap);
    if (entries.length === 0) {
      prContainer.innerHTML = `
        <div class="empty-list-placeholder">
          <p>No Personal Records logged yet. Complete sets in the workout logger to track PRs!</p>
        </div>
      `;
      return;
    }

    // Top PRs
    prContainer.innerHTML = entries
      .sort((a, b) => b[1].weight - a[1].weight)
      .slice(0, 6)
      .map(
        ([name, pr]) => `
      <div class="pr-card glass-panel">
        <div class="pr-trophy-badge">🏆</div>
        <div class="pr-info">
          <div class="pr-title">${name}</div>
          <div class="pr-sub">${pr.reps} reps • ${pr.date}</div>
        </div>
        <div class="pr-weight-badge">
          <span class="pr-num">${pr.weight}</span>
          <span class="pr-unit">${unit}</span>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderWeightHistoryList(weights, unit) {
    const list = document.getElementById('weight-history-list');
    if (!list) return;

    if (weights.length === 0) {
      list.innerHTML = `<div class="empty-list-placeholder"><p>No weight entries recorded yet.</p></div>`;
      return;
    }

    const reversed = [...weights].reverse();
    list.innerHTML = reversed
      .slice(0, 10)
      .map(
        (w) => `
      <div class="weight-history-row">
        <span class="weight-row-date">${w.date}</span>
        <span class="weight-row-notes">${w.notes || 'Routine check-in'}</span>
        <span class="weight-row-val">${w.weight} ${unit}</span>
      </div>
    `
      )
      .join('');
  }
}
