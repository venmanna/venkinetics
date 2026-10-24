/**
 * Apex Pulse - Nutrition & Meal Management Controller
 */

import { db } from './db.js';
import { sound } from './sound.js';
import { DEFAULT_FOODS } from './data/default-foods.js';

export class NutritionController {
  constructor(app) {
    this.app = app;
    this.currentDate = app.selectedDate;
    this.selectedFood = null;
    this.activeMealType = 'breakfast';
    this.allFoods = [...DEFAULT_FOODS];
  }

  async init() {
    // Load custom foods from DB
    const customFoods = await db.getCustomFoods();
    this.allFoods = [...DEFAULT_FOODS, ...customFoods];
    this.bindEvents();
  }

  bindEvents() {
    // Food Search Input
    const searchInput = document.getElementById('food-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.filterFoodList(e.target.value));
    }

    // Category filter pills in food modal
    const categoryPills = document.querySelectorAll('.food-cat-pill');
    categoryPills.forEach((pill) => {
      pill.addEventListener('click', (e) => {
        categoryPills.forEach((p) => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.filterFoodList(searchInput ? searchInput.value : '', e.currentTarget.dataset.cat);
      });
    });

    // Serving input multiplier
    const servingInput = document.getElementById('food-serving-amount');
    if (servingInput) {
      servingInput.addEventListener('input', () => this.updateSelectedFoodPreview());
    }

    // Log selected food submit button
    const submitBtn = document.getElementById('btn-confirm-add-food');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.handleLogSelectedFood());
    }

    // Quick calorie form submit
    const quickCalBtn = document.getElementById('btn-submit-quick-cal');
    if (quickCalBtn) {
      quickCalBtn.addEventListener('click', () => this.handleQuickCalorieSubmit());
    }

    // Custom food form submit
    const customFoodBtn = document.getElementById('btn-submit-custom-food');
    if (customFoodBtn) {
      customFoodBtn.addEventListener('click', () => this.handleCustomFoodSubmit());
    }
  }

  // Open Log Food Dialog for a specific meal category
  openAddFoodModal(mealType = 'breakfast') {
    this.activeMealType = mealType;
    const modal = document.getElementById('modal-add-food');
    const modalTitle = document.getElementById('modal-add-food-title');
    if (modalTitle) {
      modalTitle.textContent = `Log to ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`;
    }

    // Reset search & selection
    const searchInput = document.getElementById('food-search-input');
    if (searchInput) searchInput.value = '';
    
    this.selectedFood = null;
    const previewBox = document.getElementById('food-selected-preview');
    if (previewBox) previewBox.classList.add('hidden');

    this.renderFoodList(this.allFoods);
    if (modal && typeof modal.showModal === 'function') {
      modal.showModal();
    }
  }

  filterFoodList(query = '', category = 'all') {
    const q = query.toLowerCase().trim();
    const filtered = this.allFoods.filter((food) => {
      const matchQuery = !q || food.name.toLowerCase().includes(q) || food.category.toLowerCase().includes(q);
      const matchCat = category === 'all' || food.category.toLowerCase() === category.toLowerCase();
      return matchQuery && matchCat;
    });
    this.renderFoodList(filtered);
  }

  renderFoodList(foods) {
    const container = document.getElementById('food-list-container');
    if (!container) return;

    if (foods.length === 0) {
      container.innerHTML = `
        <div class="empty-list-placeholder">
          <p>No matching foods found</p>
          <button type="button" class="btn btn-outline btn-sm" id="btn-switch-to-custom-food">Create Custom Food</button>
        </div>
      `;
      const switchBtn = document.getElementById('btn-switch-to-custom-food');
      if (switchBtn) {
        switchBtn.addEventListener('click', () => {
          this.switchModalTab('custom');
        });
      }
      return;
    }

    container.innerHTML = foods
      .map(
        (f) => `
      <div class="food-item-row" data-food-id="${f.id}">
        <div class="food-info">
          <div class="food-name">${f.name}</div>
          <div class="food-sub">${f.servingUnit} • P: ${f.protein}g | C: ${f.carbs}g | F: ${f.fat}g</div>
        </div>
        <div class="food-cal-badge">
          <span class="cal-num">${f.calories}</span>
          <span class="cal-unit">kcal</span>
        </div>
      </div>
    `
      )
      .join('');

    // Attach click listeners
    container.querySelectorAll('.food-item-row').forEach((row) => {
      row.addEventListener('click', () => {
        container.querySelectorAll('.food-item-row').forEach((r) => r.classList.remove('selected'));
        row.classList.add('selected');
        const foodId = row.dataset.foodId;
        this.selectFood(this.allFoods.find((f) => f.id === foodId));
      });
    });
  }

  selectFood(food) {
    if (!food) return;
    this.selectedFood = food;
    const previewBox = document.getElementById('food-selected-preview');
    const nameEl = document.getElementById('preview-food-name');
    const servingInput = document.getElementById('food-serving-amount');
    const unitLabel = document.getElementById('preview-food-unit');

    if (nameEl) nameEl.textContent = food.name;
    if (unitLabel) unitLabel.textContent = food.servingUnit.includes('g') ? 'grams' : 'servings';
    if (servingInput) {
      servingInput.value = food.servingUnit.includes('g') ? food.defaultGrams || 100 : 1;
    }

    if (previewBox) {
      previewBox.classList.remove('hidden');
      previewBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    this.updateSelectedFoodPreview();
    sound.tap();
  }

  updateSelectedFoodPreview() {
    if (!this.selectedFood) return;
    const servingInput = document.getElementById('food-serving-amount');
    const val = parseFloat(servingInput ? servingInput.value : 1) || 1;

    let multiplier = 1;
    if (this.selectedFood.servingUnit.includes('g')) {
      const baseGrams = this.selectedFood.defaultGrams || 100;
      multiplier = val / baseGrams;
    } else {
      multiplier = val;
    }

    const calcCal = Math.round(this.selectedFood.calories * multiplier);
    const calcP = Math.round(this.selectedFood.protein * multiplier * 10) / 10;
    const calcC = Math.round(this.selectedFood.carbs * multiplier * 10) / 10;
    const calcF = Math.round(this.selectedFood.fat * multiplier * 10) / 10;

    const calEl = document.getElementById('preview-calculated-cal');
    const macroEl = document.getElementById('preview-calculated-macros');

    if (calEl) calEl.textContent = `${calcCal} kcal`;
    if (macroEl) macroEl.textContent = `Protein: ${calcP}g  •  Carbs: ${calcC}g  •  Fat: ${calcF}g`;
  }

  async handleLogSelectedFood() {
    if (!this.selectedFood) return;
    const servingInput = document.getElementById('food-serving-amount');
    const val = parseFloat(servingInput ? servingInput.value : 1) || 1;

    let multiplier = 1;
    let servingText = `${val} serving`;
    if (this.selectedFood.servingUnit.includes('g')) {
      const baseGrams = this.selectedFood.defaultGrams || 100;
      multiplier = val / baseGrams;
      servingText = `${val}g`;
    } else {
      multiplier = val;
      servingText = `${val} x (${this.selectedFood.servingUnit})`;
    }

    const mealItem = {
      date: this.app.selectedDate,
      type: this.activeMealType,
      name: this.selectedFood.name,
      calories: Math.round(this.selectedFood.calories * multiplier),
      protein: Math.round(this.selectedFood.protein * multiplier * 10) / 10,
      carbs: Math.round(this.selectedFood.carbs * multiplier * 10) / 10,
      fat: Math.round(this.selectedFood.fat * multiplier * 10) / 10,
      fiber: Math.round((this.selectedFood.fiber || 0) * multiplier * 10) / 10,
      serving: servingText
    };

    await db.addMeal(mealItem);
    sound.setLogged();

    const modal = document.getElementById('modal-add-food');
    if (modal && typeof modal.close === 'function') modal.close();

    this.app.renderAll();
  }

  async handleQuickCalorieSubmit() {
    const calInput = document.getElementById('quick-cal-amount');
    const descInput = document.getElementById('quick-cal-desc');
    const pInput = document.getElementById('quick-cal-protein');

    const cal = parseInt(calInput ? calInput.value : 0, 10);
    if (!cal || cal <= 0) return;

    const desc = descInput && descInput.value.trim() ? descInput.value.trim() : 'Quick Calories';
    const protein = parseFloat(pInput ? pInput.value : 0) || 0;

    await db.addMeal({
      date: this.app.selectedDate,
      type: this.activeMealType,
      name: desc,
      calories: cal,
      protein: protein,
      carbs: 0,
      fat: 0,
      serving: 'Quick Entry'
    });

    sound.setLogged();
    if (calInput) calInput.value = '';
    if (descInput) descInput.value = '';
    if (pInput) pInput.value = '';

    const modal = document.getElementById('modal-add-food');
    if (modal && typeof modal.close === 'function') modal.close();

    this.app.renderAll();
  }

  async handleCustomFoodSubmit() {
    const nameInput = document.getElementById('custom-food-name');
    const calInput = document.getElementById('custom-food-cal');
    const pInput = document.getElementById('custom-food-protein');
    const cInput = document.getElementById('custom-food-carbs');
    const fInput = document.getElementById('custom-food-fat');

    const name = nameInput ? nameInput.value.trim() : '';
    const calories = parseInt(calInput ? calInput.value : 0, 10);
    if (!name || isNaN(calories)) return;

    const newFood = {
      name,
      category: 'Custom',
      servingUnit: '100g',
      defaultGrams: 100,
      calories,
      protein: parseFloat(pInput ? pInput.value : 0) || 0,
      carbs: parseFloat(cInput ? cInput.value : 0) || 0,
      fat: parseFloat(fInput ? fInput.value : 0) || 0,
      fiber: 0
    };

    const saved = await db.addCustomFood(newFood);
    this.allFoods.unshift(saved);

    sound.celebrate();
    this.switchModalTab('search');
    this.selectFood(saved);
  }

  switchModalTab(tabName) {
    const tabs = document.querySelectorAll('.food-modal-tab');
    const contents = document.querySelectorAll('.modal-tab-content');
    tabs.forEach((t) => t.classList.toggle('active', t.dataset.tab === tabName));
    contents.forEach((c) => c.classList.toggle('active', c.id === `tab-${tabName}`));
  }

  async renderNutritionView(dateStr) {
    const meals = await db.getMealsByDate(dateStr);
    const profile = await db.getProfile();

    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    };

    const categories = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: []
    };

    meals.forEach((m) => {
      totals.calories += m.calories || 0;
      totals.protein += m.protein || 0;
      totals.carbs += m.carbs || 0;
      totals.fat += m.fat || 0;

      const cat = categories[m.type] ? m.type : 'snack';
      categories[cat].push(m);
    });

    // Update Nutrition Page Elements
    const renderCategory = (catKey) => {
      const container = document.getElementById(`meal-list-${catKey}`);
      const calHeader = document.getElementById(`meal-cal-${catKey}`);
      if (!container) return;

      const items = categories[catKey];
      const catCal = items.reduce((acc, cur) => acc + (cur.calories || 0), 0);
      if (calHeader) calHeader.textContent = `${catCal} kcal`;

      if (items.length === 0) {
        container.innerHTML = `
          <div class="empty-meal-slot">
            <span>No items logged yet</span>
            <button type="button" class="btn btn-ghost btn-xs btn-log-meal-trigger" data-type="${catKey}">+ Add</button>
          </div>
        `;
        return;
      }

      container.innerHTML = items
        .map(
          (item) => `
        <div class="logged-meal-item" data-id="${item.id}">
          <div class="logged-meal-main">
            <span class="logged-meal-name">${item.name}</span>
            <span class="logged-meal-sub">${item.serving} • P: ${item.protein}g | C: ${item.carbs}g | F: ${item.fat}g</span>
          </div>
          <div class="logged-meal-actions">
            <span class="logged-meal-cal">${item.calories} kcal</span>
            <button type="button" class="btn-delete-meal" data-id="${item.id}" title="Remove item" aria-label="Delete ${item.name}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      `
        )
        .join('');
    };

    renderCategory('breakfast');
    renderCategory('lunch');
    renderCategory('dinner');
    renderCategory('snack');

    // Attach delete listeners
    document.querySelectorAll('.btn-delete-meal').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = e.currentTarget.dataset.id;
        await db.deleteMeal(id);
        sound.tap();
        this.app.renderAll();
      });
    });

    // Attach "+ Add" triggers
    document.querySelectorAll('.btn-log-meal-trigger').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const type = e.currentTarget.dataset.type || 'breakfast';
        this.openAddFoodModal(type);
      });
    });

    return { totals, profile };
  }
}
