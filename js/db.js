/**
 * VenKinetics - IndexedDB Database Storage Engine
 * Offline-first, fast local storage for workouts, nutrition, hydration & body metrics.
 */

const DB_NAME = 'venkinetics_db';
const DB_VERSION = 1;

class Database {
  constructor() {
    this.db = null;
    this.initPromise = null;
  }

  async init() {
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (e) => {
        console.error('IndexedDB open error:', e);
        reject(e);
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (e) => {
        const db = e.target.result;

        // Profile & Goals store
        if (!db.objectStoreNames.contains('profile')) {
          db.createObjectStore('profile', { keyPath: 'id' });
        }

        // Logged Meals store
        if (!db.objectStoreNames.contains('meals')) {
          const mealStore = db.createObjectStore('meals', { keyPath: 'id' });
          mealStore.createIndex('date', 'date', { unique: false });
          mealStore.createIndex('type', 'type', { unique: false });
        }

        // Workouts store
        if (!db.objectStoreNames.contains('workouts')) {
          const workoutStore = db.createObjectStore('workouts', { keyPath: 'id' });
          workoutStore.createIndex('date', 'date', { unique: false });
        }

        // Water hydration store
        if (!db.objectStoreNames.contains('water')) {
          const waterStore = db.createObjectStore('water', { keyPath: 'id' });
          waterStore.createIndex('date', 'date', { unique: false });
        }

        // Body metrics / Weight store
        if (!db.objectStoreNames.contains('weights')) {
          const weightStore = db.createObjectStore('weights', { keyPath: 'id' });
          weightStore.createIndex('date', 'date', { unique: false });
        }

        // Custom user foods
        if (!db.objectStoreNames.contains('custom_foods')) {
          db.createObjectStore('custom_foods', { keyPath: 'id' });
        }

        // Custom routines
        if (!db.objectStoreNames.contains('custom_routines')) {
          db.createObjectStore('custom_routines', { keyPath: 'id' });
        }
      };
    });

    await this.initPromise;
    await this.ensureInitialProfile();
    return this.db;
  }

  // Generic transaction helper
  _tx(storeName, mode = 'readonly') {
    const tx = this.db.transaction(storeName, mode);
    return tx.objectStore(storeName);
  }

  // --- Profile & Settings ---
  async getProfile() {
    await this.init();
    return new Promise((resolve) => {
      const store = this._tx('profile', 'readonly');
      const req = store.get('main_user');
      req.onsuccess = () => resolve(req.result || this.getDefaultProfile());
      req.onerror = () => resolve(this.getDefaultProfile());
    });
  }

  getDefaultProfile() {
    return {
      id: 'main_user',
      name: 'Venkat',
      calorieTarget: 2400,
      proteinTarget: 175,
      carbsTarget: 240,
      fatTarget: 65,
      waterTargetMl: 3000,
      unit: 'kg', // 'kg' or 'lbs'
      theme: 'emerald',
      activeStreak: 5,
      lastActiveDate: new Date().toISOString().split('T')[0]
    };
  }

  async saveProfile(profileData) {
    await this.init();
    return new Promise((resolve, reject) => {
      const store = this._tx('profile', 'readwrite');
      const data = { ...profileData, id: 'main_user' };
      const req = store.put(data);
      req.onsuccess = () => resolve(data);
      req.onerror = (e) => reject(e);
    });
  }

  async ensureInitialProfile() {
    const profile = await this.getProfile();
    if (!profile || !profile.calorieTarget) {
      await this.saveProfile(this.getDefaultProfile());
    }
  }

  // --- Meals / Nutrition ---
  async addMeal(meal) {
    await this.init();
    return new Promise((resolve, reject) => {
      const store = this._tx('meals', 'readwrite');
      const item = {
        id: meal.id || 'meal_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        date: meal.date, // 'YYYY-MM-DD'
        type: meal.type, // 'breakfast' | 'lunch' | 'dinner' | 'snack'
        name: meal.name,
        calories: Number(meal.calories) || 0,
        protein: Number(meal.protein) || 0,
        carbs: Number(meal.carbs) || 0,
        fat: Number(meal.fat) || 0,
        fiber: Number(meal.fiber) || 0,
        serving: meal.serving || '1 serving',
        timestamp: meal.timestamp || Date.now()
      };
      const req = store.put(item);
      req.onsuccess = () => resolve(item);
      req.onerror = (e) => reject(e);
    });
  }

  async deleteMeal(id) {
    await this.init();
    return new Promise((resolve, reject) => {
      const store = this._tx('meals', 'readwrite');
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e);
    });
  }

  async getMealsByDate(dateStr) {
    await this.init();
    return new Promise((resolve) => {
      const store = this._tx('meals', 'readonly');
      const index = store.index('date');
      const req = index.getAll(dateStr);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  async getAllMeals() {
    await this.init();
    return new Promise((resolve) => {
      const store = this._tx('meals', 'readonly');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  // --- Workouts ---
  async addWorkout(workout) {
    await this.init();
    return new Promise((resolve, reject) => {
      const store = this._tx('workouts', 'readwrite');
      const item = {
        id: workout.id || 'wo_' + Date.now(),
        date: workout.date,
        name: workout.name || 'Workout Session',
        durationSec: workout.durationSec || 0,
        volumeKg: workout.volumeKg || 0,
        exercises: workout.exercises || [],
        notes: workout.notes || '',
        timestamp: workout.timestamp || Date.now()
      };
      const req = store.put(item);
      req.onsuccess = () => resolve(item);
      req.onerror = (e) => reject(e);
    });
  }

  async getWorkoutsByDate(dateStr) {
    await this.init();
    return new Promise((resolve) => {
      const store = this._tx('workouts', 'readonly');
      const index = store.index('date');
      const req = index.getAll(dateStr);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  async getAllWorkouts() {
    await this.init();
    return new Promise((resolve) => {
      const store = this._tx('workouts', 'readonly');
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result || []).sort((a, b) => b.timestamp - a.timestamp));
      req.onerror = () => resolve([]);
    });
  }

  async deleteWorkout(id) {
    await this.init();
    return new Promise((resolve, reject) => {
      const store = this._tx('workouts', 'readwrite');
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e);
    });
  }

  // --- Hydration / Water ---
  async addWater(dateStr, amountMl) {
    await this.init();
    return new Promise((resolve, reject) => {
      const store = this._tx('water', 'readwrite');
      const item = {
        id: 'w_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
        date: dateStr,
        amountMl: Number(amountMl),
        timestamp: Date.now()
      };
      const req = store.put(item);
      req.onsuccess = () => resolve(item);
      req.onerror = (e) => reject(e);
    });
  }

  async getWaterByDate(dateStr) {
    await this.init();
    return new Promise((resolve) => {
      const store = this._tx('water', 'readonly');
      const index = store.index('date');
      const req = index.getAll(dateStr);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  async deleteWater(id) {
    await this.init();
    return new Promise((resolve, reject) => {
      const store = this._tx('water', 'readwrite');
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e);
    });
  }

  // --- Body Metrics / Weight ---
  async addWeight(entry) {
    await this.init();
    return new Promise((resolve, reject) => {
      const store = this._tx('weights', 'readwrite');
      const item = {
        id: 'wt_' + entry.date,
        date: entry.date,
        weight: Number(entry.weight),
        waistCm: Number(entry.waistCm) || null,
        bodyFatPct: Number(entry.bodyFatPct) || null,
        notes: entry.notes || '',
        timestamp: Date.now()
      };
      const req = store.put(item);
      req.onsuccess = () => resolve(item);
      req.onerror = (e) => reject(e);
    });
  }

  async getAllWeights() {
    await this.init();
    return new Promise((resolve) => {
      const store = this._tx('weights', 'readonly');
      const req = store.getAll();
      req.onsuccess = () => {
        const sorted = (req.result || []).sort((a, b) => a.date.localeCompare(b.date));
        resolve(sorted);
      };
      req.onerror = () => resolve([]);
    });
  }

  // --- Custom Foods ---
  async getCustomFoods() {
    await this.init();
    return new Promise((resolve) => {
      const store = this._tx('custom_foods', 'readonly');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  async addCustomFood(food) {
    await this.init();
    return new Promise((resolve, reject) => {
      const store = this._tx('custom_foods', 'readwrite');
      const item = {
        ...food,
        id: food.id || 'cf_' + Date.now()
      };
      const req = store.put(item);
      req.onsuccess = () => resolve(item);
      req.onerror = (e) => reject(e);
    });
  }

  // --- Full Backup & Restore ---
  async exportFullData() {
    await this.init();
    const profile = await this.getProfile();
    const meals = await this.getAllMeals();
    const workouts = await this.getAllWorkouts();
    const weights = await this.getAllWeights();
    const customFoods = await this.getCustomFoods();

    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      profile,
      meals,
      workouts,
      weights,
      customFoods
    };
  }

  async importFullData(data) {
    if (!data || typeof data !== 'object') throw new Error('Invalid backup data format');
    await this.init();

    if (data.profile) await this.saveProfile(data.profile);

    if (Array.isArray(data.meals)) {
      const store = this._tx('meals', 'readwrite');
      for (const m of data.meals) store.put(m);
    }

    if (Array.isArray(data.workouts)) {
      const store = this._tx('workouts', 'readwrite');
      for (const w of data.workouts) store.put(w);
    }

    if (Array.isArray(data.weights)) {
      const store = this._tx('weights', 'readwrite');
      for (const wt of data.weights) store.put(wt);
    }

    if (Array.isArray(data.customFoods)) {
      const store = this._tx('custom_foods', 'readwrite');
      for (const cf of data.customFoods) store.put(cf);
    }

    return true;
  }

  // Seed sample starter data if fresh database
  async seedDemoDataIfEmpty() {
    const weights = await this.getAllWeights();
    if (weights.length > 0) return; // Already initialized

    console.log('[Apex Pulse DB] Seeding initial rich tracker history');
    const today = new Date();
    
    // Seed 14 days of realistic weight progression (slight steady downward cut)
    let currentWeight = 78.5;
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      currentWeight -= (Math.random() * 0.15 - 0.05); // trend down
      await this.addWeight({
        date: dateStr,
        weight: Math.round(currentWeight * 10) / 10,
        notes: i === 0 ? 'Morning check-in' : ''
      });
    }

    // Seed Today's sample meals
    const todayStr = today.toISOString().split('T')[0];
    await this.addMeal({
      date: todayStr,
      type: 'breakfast',
      name: 'Oatmeal with Blueberries & Whey',
      calories: 420,
      protein: 36,
      carbs: 52,
      fat: 6,
      fiber: 7,
      serving: '1 bowl'
    });

    await this.addMeal({
      date: todayStr,
      type: 'lunch',
      name: 'Grilled Herb Chicken Bowl with Quinoa & Avocado',
      calories: 580,
      protein: 48,
      carbs: 45,
      fat: 18,
      fiber: 8,
      serving: '1 bowl'
    });

    // Seed Hydration for today
    await this.addWater(todayStr, 750);
    await this.addWater(todayStr, 500);
    await this.addWater(todayStr, 500);

    // Seed a completed workout yesterday
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yStr = yesterday.toISOString().split('T')[0];

    await this.addWorkout({
      date: yStr,
      name: 'Push Day Hypertrophy',
      durationSec: 3240, // 54 mins
      volumeKg: 7850,
      exercises: [
        {
          name: 'Barbell Bench Press',
          muscle: 'Chest',
          sets: [
            { setNum: 1, weight: 80, reps: 10, completed: true, rpe: 7 },
            { setNum: 2, weight: 85, reps: 8, completed: true, rpe: 8 },
            { setNum: 3, weight: 90, reps: 6, completed: true, rpe: 9 },
            { setNum: 4, weight: 92.5, reps: 5, completed: true, rpe: 9.5 }
          ]
        },
        {
          name: 'Incline Dumbbell Press',
          muscle: 'Chest',
          sets: [
            { setNum: 1, weight: 28, reps: 10, completed: true, rpe: 8 },
            { setNum: 2, weight: 30, reps: 8, completed: true, rpe: 8.5 },
            { setNum: 3, weight: 30, reps: 8, completed: true, rpe: 9 }
          ]
        },
        {
          name: 'Dumbbell Lateral Raise',
          muscle: 'Shoulders',
          sets: [
            { setNum: 1, weight: 12, reps: 15, completed: true, rpe: 8 },
            { setNum: 2, weight: 12, reps: 14, completed: true, rpe: 9 },
            { setNum: 3, weight: 12, reps: 12, completed: true, rpe: 10 }
          ]
        }
      ]
    });
  }
}

export const db = new Database();
