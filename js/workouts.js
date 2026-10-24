/**
 * Apex Pulse - Workout & Gym Session Controller
 * Set-by-set weight logging, routine templates, active workout timer, and rest timer.
 */

import { db } from './db.js';
import { sound } from './sound.js';
import { DEFAULT_EXERCISES, DEFAULT_ROUTINES } from './data/default-exercises.js';

export class WorkoutController {
  constructor(app) {
    this.app = app;
    this.activeWorkout = null;
    this.workoutTimerInterval = null;
    this.workoutSeconds = 0;

    // Rest Timer state
    this.restTimerInterval = null;
    this.restSecondsRemaining = 0;
    this.restTotalSeconds = 90;
    this.isRestRunning = false;
  }

  async init() {
    this.bindEvents();
    this.renderRoutinesList();
  }

  bindEvents() {
    // Start empty workout button
    const startEmptyBtn = document.getElementById('btn-start-empty-workout');
    if (startEmptyBtn) {
      startEmptyBtn.addEventListener('click', () => this.startNewWorkout('Custom Workout'));
    }

    // Add Exercise to active workout
    const addExBtn = document.getElementById('btn-add-exercise-to-active');
    if (addExBtn) {
      addExBtn.addEventListener('click', () => this.openExerciseSelectorModal());
    }

    // Finish Active Workout
    const finishBtn = document.getElementById('btn-finish-workout');
    if (finishBtn) {
      finishBtn.addEventListener('click', () => this.finishActiveWorkout());
    }

    // Discard Active Workout
    const discardBtn = document.getElementById('btn-discard-workout');
    if (discardBtn) {
      discardBtn.addEventListener('click', () => this.discardActiveWorkout());
    }

    // Rest timer bar quick controls
    const restPlus30 = document.getElementById('btn-rest-plus-30');
    if (restPlus30) {
      restPlus30.addEventListener('click', () => this.adjustRestTime(30));
    }

    const restDismiss = document.getElementById('btn-rest-dismiss');
    if (restDismiss) {
      restDismiss.addEventListener('click', () => this.stopRestTimer());
    }

    // Exercise selector search filter
    const exSearchInput = document.getElementById('exercise-search-input');
    if (exSearchInput) {
      exSearchInput.addEventListener('input', (e) => this.filterExerciseList(e.target.value));
    }

    // Exercise muscle filter pills
    document.querySelectorAll('.muscle-filter-pill').forEach((pill) => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('.muscle-filter-pill').forEach((p) => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.filterExerciseList(exSearchInput ? exSearchInput.value : '', e.currentTarget.dataset.muscle);
      });
    });
  }

  renderRoutinesList() {
    const container = document.getElementById('routines-grid');
    if (!container) return;

    container.innerHTML = DEFAULT_ROUTINES.map(
      (r) => `
      <div class="routine-card glass-panel" data-id="${r.id}">
        <div class="routine-header">
          <h4 class="routine-title">${r.name}</h4>
          <span class="badge badge-emerald">${r.exercises.length} exercises</span>
        </div>
        <p class="routine-desc">${r.description}</p>
        <button type="button" class="btn btn-emerald btn-sm btn-start-routine" data-id="${r.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          Start Routine
        </button>
      </div>
    `
    ).join('');

    container.querySelectorAll('.btn-start-routine').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const routine = DEFAULT_ROUTINES.find((r) => r.id === id);
        if (routine) this.startRoutine(routine);
      });
    });
  }

  startRoutine(routine) {
    const exercises = routine.exercises.map((item) => {
      const baseEx = DEFAULT_EXERCISES.find((e) => e.id === item.id) || { name: item.id, muscle: 'General' };
      const sets = [];
      for (let s = 1; s <= item.targetSets; s++) {
        sets.push({
          setNum: s,
          weight: 0,
          reps: item.defaultReps || 10,
          completed: false,
          rpe: 8
        });
      }
      return {
        id: item.id,
        name: baseEx.name,
        muscle: baseEx.muscle,
        sets
      };
    });

    this.startNewWorkout(routine.name, exercises);
  }

  startNewWorkout(name = 'Workout Session', initialExercises = []) {
    this.activeWorkout = {
      name,
      date: this.app.selectedDate,
      startTime: Date.now(),
      exercises: initialExercises.length > 0 ? initialExercises : []
    };

    this.workoutSeconds = 0;
    clearInterval(this.workoutTimerInterval);
    this.workoutTimerInterval = setInterval(() => {
      this.workoutSeconds++;
      this.updateWorkoutTimerDisplay();
    }, 1000);

    sound.celebrate();
    this.renderActiveWorkoutUI();
    this.app.switchTab('workout');
  }

  updateWorkoutTimerDisplay() {
    const el = document.getElementById('active-workout-timer');
    if (!el) return;
    const mins = Math.floor(this.workoutSeconds / 60);
    const secs = this.workoutSeconds % 60;
    el.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  renderActiveWorkoutUI() {
    const emptyState = document.getElementById('workout-empty-view');
    const activeView = document.getElementById('workout-active-view');
    const titleEl = document.getElementById('active-workout-name');
    const container = document.getElementById('active-exercises-list');

    if (!this.activeWorkout) {
      if (emptyState) emptyState.classList.remove('hidden');
      if (activeView) activeView.classList.add('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (activeView) activeView.classList.remove('hidden');
    if (titleEl) titleEl.textContent = this.activeWorkout.name;

    if (!container) return;

    if (this.activeWorkout.exercises.length === 0) {
      container.innerHTML = `
        <div class="empty-exercise-slot">
          <p>No exercises added yet</p>
          <button type="button" class="btn btn-outline btn-sm" id="btn-trigger-add-ex">+ Add First Exercise</button>
        </div>
      `;
      const trigger = document.getElementById('btn-trigger-add-ex');
      if (trigger) trigger.addEventListener('click', () => this.openExerciseSelectorModal());
      return;
    }

    container.innerHTML = this.activeWorkout.exercises
      .map(
        (ex, exIdx) => `
      <div class="exercise-card glass-panel" data-ex-idx="${exIdx}">
        <div class="exercise-card-header">
          <div class="exercise-meta">
            <h4 class="exercise-name">${ex.name}</h4>
            <span class="badge badge-subtle">${ex.muscle}</span>
          </div>
          <button type="button" class="btn-icon-subtle btn-remove-exercise" data-ex-idx="${exIdx}" title="Remove exercise">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="sets-table">
          <div class="sets-table-header">
            <span class="col-set">SET</span>
            <span class="col-input">WEIGHT (${this.app.profile.unit})</span>
            <span class="col-input">REPS</span>
            <span class="col-check">DONE</span>
          </div>
          <div class="sets-rows">
            ${ex.sets
              .map(
                (set, setIdx) => `
              <div class="set-row ${set.completed ? 'completed' : ''}" data-set-idx="${setIdx}">
                <span class="col-set set-number">${set.setNum}</span>
                <div class="col-input">
                  <input type="number" step="0.5" class="set-input input-weight" value="${set.weight || ''}" placeholder="0" data-ex-idx="${exIdx}" data-set-idx="${setIdx}">
                </div>
                <div class="col-input">
                  <input type="number" class="set-input input-reps" value="${set.reps || ''}" placeholder="0" data-ex-idx="${exIdx}" data-set-idx="${setIdx}">
                </div>
                <div class="col-check">
                  <button type="button" class="btn-set-check ${set.completed ? 'active' : ''}" data-ex-idx="${exIdx}" data-set-idx="${setIdx}">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </button>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <div class="exercise-card-footer">
          <button type="button" class="btn btn-ghost btn-xs btn-add-set" data-ex-idx="${exIdx}">+ Add Set</button>
        </div>
      </div>
    `
      )
      .join('');

    // Attach listeners for weight/rep changes
    container.querySelectorAll('.input-weight').forEach((input) => {
      input.addEventListener('change', (e) => {
        const exIdx = parseInt(e.target.dataset.exIdx, 10);
        const setIdx = parseInt(e.target.dataset.setIdx, 10);
        this.activeWorkout.exercises[exIdx].sets[setIdx].weight = parseFloat(e.target.value) || 0;
      });
    });

    container.querySelectorAll('.input-reps').forEach((input) => {
      input.addEventListener('change', (e) => {
        const exIdx = parseInt(e.target.dataset.exIdx, 10);
        const setIdx = parseInt(e.target.dataset.setIdx, 10);
        this.activeWorkout.exercises[exIdx].sets[setIdx].reps = parseInt(e.target.value, 10) || 0;
      });
    });

    // Checkmark listener (marks set complete & triggers rest timer)
    container.querySelectorAll('.btn-set-check').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const exIdx = parseInt(e.currentTarget.dataset.exIdx, 10);
        const setIdx = parseInt(e.currentTarget.dataset.setIdx, 10);
        const set = this.activeWorkout.exercises[exIdx].sets[setIdx];

        // Ensure current input values are captured
        const row = e.currentTarget.closest('.set-row');
        const wInput = row.querySelector('.input-weight');
        const rInput = row.querySelector('.input-reps');
        set.weight = parseFloat(wInput.value) || 0;
        set.reps = parseInt(rInput.value, 10) || 0;

        set.completed = !set.completed;
        if (set.completed) {
          sound.setLogged();
          this.startRestTimer(90); // Start 90s rest timer
        } else {
          sound.tap();
        }

        this.renderActiveWorkoutUI();
      });
    });

    // Add set to exercise
    container.querySelectorAll('.btn-add-set').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const exIdx = parseInt(e.currentTarget.dataset.exIdx, 10);
        const ex = this.activeWorkout.exercises[exIdx];
        const lastSet = ex.sets[ex.sets.length - 1];
        ex.sets.push({
          setNum: ex.sets.length + 1,
          weight: lastSet ? lastSet.weight : 0,
          reps: lastSet ? lastSet.reps : 10,
          completed: false,
          rpe: 8
        });
        sound.tap();
        this.renderActiveWorkoutUI();
      });
    });

    // Remove exercise
    container.querySelectorAll('.btn-remove-exercise').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const exIdx = parseInt(e.currentTarget.dataset.exIdx, 10);
        this.activeWorkout.exercises.splice(exIdx, 1);
        sound.tap();
        this.renderActiveWorkoutUI();
      });
    });
  }

  openExerciseSelectorModal() {
    const modal = document.getElementById('modal-select-exercise');
    this.filterExerciseList('');
    if (modal && typeof modal.showModal === 'function') {
      modal.showModal();
    }
  }

  filterExerciseList(query = '', muscle = 'all') {
    const q = query.toLowerCase().trim();
    const filtered = DEFAULT_EXERCISES.filter((ex) => {
      const matchQ = !q || ex.name.toLowerCase().includes(q) || ex.muscle.toLowerCase().includes(q);
      const matchM = muscle === 'all' || ex.muscle.toLowerCase() === muscle.toLowerCase();
      return matchQ && matchM;
    });

    const container = document.getElementById('exercise-selection-list');
    if (!container) return;

    container.innerHTML = filtered
      .map(
        (ex) => `
      <div class="exercise-select-row" data-id="${ex.id}">
        <div class="ex-select-info">
          <span class="ex-select-name">${ex.name}</span>
          <span class="ex-select-sub">${ex.muscle} • ${ex.equipment}</span>
        </div>
        <button type="button" class="btn btn-outline btn-xs btn-pick-exercise" data-id="${ex.id}">+ Add</button>
      </div>
    `
      )
      .join('');

    container.querySelectorAll('.btn-pick-exercise').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const ex = DEFAULT_EXERCISES.find((item) => item.id === id);
        if (ex && this.activeWorkout) {
          this.activeWorkout.exercises.push({
            id: ex.id,
            name: ex.name,
            muscle: ex.muscle,
            sets: [
              { setNum: 1, weight: 0, reps: 10, completed: false, rpe: 8 },
              { setNum: 2, weight: 0, reps: 10, completed: false, rpe: 8 },
              { setNum: 3, weight: 0, reps: 10, completed: false, rpe: 8 }
            ]
          });
          sound.tap();
          this.renderActiveWorkoutUI();
          const modal = document.getElementById('modal-select-exercise');
          if (modal && typeof modal.close === 'function') modal.close();
        }
      });
    });
  }

  // Rest Timer
  startRestTimer(seconds = 90) {
    clearInterval(this.restTimerInterval);
    this.restTotalSeconds = seconds;
    this.restSecondsRemaining = seconds;
    this.isRestRunning = true;

    const bar = document.getElementById('rest-timer-bar');
    if (bar) bar.classList.remove('hidden');

    this.updateRestTimerDisplay();
    this.restTimerInterval = setInterval(() => {
      if (this.restSecondsRemaining > 0) {
        this.restSecondsRemaining--;
        this.updateRestTimerDisplay();

        if (this.restSecondsRemaining <= 3 && this.restSecondsRemaining > 0) {
          sound.tick();
        } else if (this.restSecondsRemaining === 0) {
          sound.restComplete();
          this.stopRestTimer();
        }
      }
    }, 1000);
  }

  adjustRestTime(deltaSeconds) {
    this.restSecondsRemaining = Math.max(0, this.restSecondsRemaining + deltaSeconds);
    this.updateRestTimerDisplay();
    sound.tap();
  }

  stopRestTimer() {
    clearInterval(this.restTimerInterval);
    this.isRestRunning = false;
    const bar = document.getElementById('rest-timer-bar');
    if (bar) bar.classList.add('hidden');
  }

  updateRestTimerDisplay() {
    const timeEl = document.getElementById('rest-timer-display');
    const ringProgress = document.getElementById('rest-ring-fill');
    if (timeEl) {
      const m = Math.floor(this.restSecondsRemaining / 60);
      const s = this.restSecondsRemaining % 60;
      timeEl.textContent = `${m}:${String(s).padStart(2, '0')}`;
    }
    if (ringProgress && this.restTotalSeconds > 0) {
      const pct = (this.restSecondsRemaining / this.restTotalSeconds) * 100;
      ringProgress.style.strokeDashoffset = 100 - pct;
    }
  }

  // Finish Workout
  async finishActiveWorkout() {
    if (!this.activeWorkout) return;

    let totalVolume = 0;
    let completedSetsCount = 0;

    this.activeWorkout.exercises.forEach((ex) => {
      ex.sets.forEach((set) => {
        if (set.completed && set.weight > 0 && set.reps > 0) {
          totalVolume += set.weight * set.reps;
          completedSetsCount++;
        }
      });
    });

    const finished = {
      date: this.app.selectedDate,
      name: this.activeWorkout.name,
      durationSec: this.workoutSeconds,
      volumeKg: totalVolume,
      exercises: this.activeWorkout.exercises,
      timestamp: Date.now()
    };

    await db.addWorkout(finished);
    sound.celebrate();

    clearInterval(this.workoutTimerInterval);
    this.stopRestTimer();
    this.activeWorkout = null;

    this.renderActiveWorkoutUI();
    await this.renderWorkoutHistory();
    this.app.renderAll();
  }

  discardActiveWorkout() {
    if (confirm('Discard this current workout session?')) {
      clearInterval(this.workoutTimerInterval);
      this.stopRestTimer();
      this.activeWorkout = null;
      this.renderActiveWorkoutUI();
      sound.tap();
    }
  }

  async renderWorkoutHistory() {
    const list = document.getElementById('workout-history-list');
    if (!list) return;

    const all = await db.getAllWorkouts();
    if (all.length === 0) {
      list.innerHTML = `
        <div class="empty-list-placeholder">
          <p>No logged workouts yet. Hit "Start Routine" above to begin!</p>
        </div>
      `;
      return;
    }

    list.innerHTML = all
      .map((w) => {
        const mins = Math.round((w.durationSec || 0) / 60);
        const totalSets = (w.exercises || []).reduce((acc, ex) => acc + (ex.sets ? ex.sets.filter((s) => s.completed).length : 0), 0);

        return `
        <div class="history-workout-card glass-panel" data-id="${w.id}">
          <div class="history-card-header">
            <div>
              <h4 class="history-name">${w.name}</h4>
              <span class="history-date">${w.date} • ${mins} mins • ${totalSets} sets</span>
            </div>
            <div class="history-volume-badge">
              <span class="vol-num">${Math.round(w.volumeKg || 0)}</span>
              <span class="vol-unit">${this.app.profile.unit} vol</span>
            </div>
          </div>
          <div class="history-exercises-preview">
            ${(w.exercises || []).map((e) => `<span class="history-ex-pill">${e.name} (${e.sets ? e.sets.length : 0}s)</span>`).join('')}
          </div>
        </div>
      `;
      })
      .join('');
  }
}
