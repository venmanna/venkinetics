export const DEFAULT_FOODS = [
  // Lean Proteins
  { id: 'f_chicken_breast', name: 'Chicken Breast (Grilled)', category: 'Protein', servingUnit: '100g', defaultGrams: 100, calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
  { id: 'f_chicken_thigh', name: 'Chicken Thigh (Skinless, Boneless)', category: 'Protein', servingUnit: '100g', defaultGrams: 100, calories: 209, protein: 26, carbs: 0, fat: 10.9, fiber: 0 },
  { id: 'f_egg_whole', name: 'Large Whole Egg', category: 'Protein', servingUnit: '1 egg (50g)', defaultGrams: 50, calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8, fiber: 0 },
  { id: 'f_egg_whites', name: 'Liquid Egg Whites', category: 'Protein', servingUnit: '100g', defaultGrams: 100, calories: 52, protein: 11, carbs: 0.7, fat: 0.2, fiber: 0 },
  { id: 'f_salmon', name: 'Atlantic Salmon (Baked)', category: 'Protein', servingUnit: '100g', defaultGrams: 100, calories: 206, protein: 22, carbs: 0, fat: 12.3, fiber: 0 },
  { id: 'f_canned_tuna', name: 'Chunk Light Tuna (in Water)', category: 'Protein', servingUnit: '1 can (130g drained)', defaultGrams: 130, calories: 140, protein: 30, carbs: 0, fat: 1, fiber: 0 },
  { id: 'f_lean_ground_beef', name: 'Lean Ground Beef (93/7)', category: 'Protein', servingUnit: '100g', defaultGrams: 100, calories: 172, protein: 24, carbs: 0, fat: 8, fiber: 0 },
  { id: 'f_top_sirloin', name: 'Top Sirloin Steak (Grilled)', category: 'Protein', servingUnit: '100g', defaultGrams: 100, calories: 183, protein: 29, carbs: 0, fat: 6.5, fiber: 0 },
  { id: 'f_turkey_breast', name: 'Ground Turkey (93/7)', category: 'Protein', servingUnit: '100g', defaultGrams: 100, calories: 150, protein: 22, carbs: 0, fat: 7, fiber: 0 },
  { id: 'f_cottage_cheese', name: 'Low Fat Cottage Cheese (2%)', category: 'Protein', servingUnit: '100g', defaultGrams: 100, calories: 84, protein: 12, carbs: 4.3, fat: 2.3, fiber: 0 },
  { id: 'f_greek_yogurt', name: 'Non-Fat Greek Yogurt (Plain)', category: 'Protein', servingUnit: '1 cup (170g)', defaultGrams: 170, calories: 100, protein: 17, carbs: 6, fat: 0.7, fiber: 0 },
  { id: 'f_tofu_firm', name: 'Extra Firm Tofu', category: 'Protein', servingUnit: '100g', defaultGrams: 100, calories: 83, protein: 10, carbs: 2, fat: 5, fiber: 1 },
  { id: 'f_shrimp', name: 'Shrimp (Steamed/Grilled)', category: 'Protein', servingUnit: '100g', defaultGrams: 100, calories: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0 },
  
  // Supplements & Shakes
  { id: 'f_whey_protein', name: 'Whey Protein Isolate', category: 'Supplements', servingUnit: '1 scoop (30g)', defaultGrams: 30, calories: 120, protein: 25, carbs: 2, fat: 1, fiber: 0 },
  { id: 'f_casein_protein', name: 'Micellar Casein Protein', category: 'Supplements', servingUnit: '1 scoop (32g)', defaultGrams: 32, calories: 120, protein: 24, carbs: 3, fat: 1, fiber: 0 },
  { id: 'f_plant_protein', name: 'Plant Pea/Rice Protein', category: 'Supplements', servingUnit: '1 scoop (35g)', defaultGrams: 35, calories: 130, protein: 24, carbs: 4, fat: 2.5, fiber: 2 },
  { id: 'f_protein_bar', name: 'High Protein Quest Bar', category: 'Supplements', servingUnit: '1 bar (60g)', defaultGrams: 60, calories: 200, protein: 21, carbs: 21, fat: 7, fiber: 14 },

  // Complex Carbs & Grains
  { id: 'f_rolled_oats', name: 'Rolled Oats (Dry)', category: 'Carbohydrates', servingUnit: '1/2 cup (40g)', defaultGrams: 40, calories: 150, protein: 5, carbs: 27, fat: 2.5, fiber: 4 },
  { id: 'f_white_rice', name: 'Jasmine White Rice (Cooked)', category: 'Carbohydrates', servingUnit: '100g', defaultGrams: 100, calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
  { id: 'f_brown_rice', name: 'Brown Rice (Cooked)', category: 'Carbohydrates', servingUnit: '100g', defaultGrams: 100, calories: 123, protein: 2.7, carbs: 25.6, fat: 1, fiber: 1.6 },
  { id: 'f_sweet_potato', name: 'Sweet Potato (Baked, Flesh only)', category: 'Carbohydrates', servingUnit: '100g', defaultGrams: 100, calories: 90, protein: 2, carbs: 21, fat: 0.2, fiber: 3.3 },
  { id: 'f_russet_potato', name: 'Russet Potato (Boiled/Baked)', category: 'Carbohydrates', servingUnit: '100g', defaultGrams: 100, calories: 87, protein: 1.9, carbs: 20, fat: 0.1, fiber: 1.8 },
  { id: 'f_quinoa', name: 'Quinoa (Cooked)', category: 'Carbohydrates', servingUnit: '100g', defaultGrams: 100, calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9, fiber: 2.8 },
  { id: 'f_whole_wheat_bread', name: '100% Whole Wheat Bread', category: 'Carbohydrates', servingUnit: '1 slice (38g)', defaultGrams: 38, calories: 80, protein: 4, carbs: 14, fat: 1, fiber: 2 },
  { id: 'f_whole_wheat_pasta', name: 'Whole Wheat Pasta (Cooked)', category: 'Carbohydrates', servingUnit: '100g', defaultGrams: 100, calories: 149, protein: 5.3, carbs: 30, fat: 0.8, fiber: 3.9 },
  { id: 'f_black_beans', name: 'Black Beans (Cooked/Canned)', category: 'Carbohydrates', servingUnit: '100g', defaultGrams: 100, calories: 132, protein: 8.9, carbs: 23.7, fat: 0.5, fiber: 8.7 },

  // Healthy Fats
  { id: 'f_avocado', name: 'Avocado (Fresh)', category: 'Fats', servingUnit: '1/2 medium (100g)', defaultGrams: 100, calories: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7 },
  { id: 'f_olive_oil', name: 'Extra Virgin Olive Oil', category: 'Fats', servingUnit: '1 tbsp (14g)', defaultGrams: 14, calories: 119, protein: 0, carbs: 0, fat: 13.5, fiber: 0 },
  { id: 'f_almonds', name: 'Raw Almonds', category: 'Fats', servingUnit: '1 oz (28g / ~23 nuts)', defaultGrams: 28, calories: 164, protein: 6, carbs: 6.1, fat: 14.2, fiber: 3.5 },
  { id: 'f_walnuts', name: 'Raw Walnuts', category: 'Fats', servingUnit: '1 oz (28g)', defaultGrams: 28, calories: 185, protein: 4.3, carbs: 3.9, fat: 18.5, fiber: 1.9 },
  { id: 'f_peanut_butter', name: 'Natural Peanut Butter', category: 'Fats', servingUnit: '2 tbsp (32g)', defaultGrams: 32, calories: 190, protein: 8, carbs: 7, fat: 16, fiber: 2 },
  { id: 'f_chia_seeds', name: 'Chia Seeds', category: 'Fats', servingUnit: '1 tbsp (12g)', defaultGrams: 12, calories: 58, protein: 2, carbs: 5, fat: 3.7, fiber: 4.1 },

  // Fruits & Berries
  { id: 'f_banana', name: 'Banana (Medium, ~118g)', category: 'Fruit', servingUnit: '1 medium', defaultGrams: 118, calories: 105, protein: 1.3, carbs: 27, fat: 0.3, fiber: 3.1 },
  { id: 'f_blueberries', name: 'Fresh Blueberries', category: 'Fruit', servingUnit: '1 cup (148g)', defaultGrams: 148, calories: 84, protein: 1.1, carbs: 21.4, fat: 0.5, fiber: 3.6 },
  { id: 'f_strawberries', name: 'Fresh Strawberries', category: 'Fruit', servingUnit: '1 cup (150g)', defaultGrams: 150, calories: 48, protein: 1, carbs: 11.5, fat: 0.5, fiber: 3 },
  { id: 'f_apple', name: 'Fuji / Honeycrisp Apple', category: 'Fruit', servingUnit: '1 medium (182g)', defaultGrams: 182, calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4 },
  { id: 'f_orange', name: 'Navel Orange', category: 'Fruit', servingUnit: '1 medium (131g)', defaultGrams: 131, calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2, fiber: 3.1 },

  // Vegetables & Greens
  { id: 'f_broccoli', name: 'Steamed Broccoli', category: 'Vegetables', servingUnit: '1 cup (91g)', defaultGrams: 91, calories: 31, protein: 2.6, carbs: 6, fat: 0.3, fiber: 2.4 },
  { id: 'f_spinach', name: 'Raw Baby Spinach', category: 'Vegetables', servingUnit: '2 cups (60g)', defaultGrams: 60, calories: 14, protein: 1.7, carbs: 2.2, fat: 0.2, fiber: 1.3 },
  { id: 'f_asparagus', name: 'Grilled Asparagus', category: 'Vegetables', servingUnit: '100g', defaultGrams: 100, calories: 22, protein: 2.4, carbs: 4.1, fat: 0.2, fiber: 2 },
  { id: 'f_bell_peppers', name: 'Red Bell Pepper (Sliced)', category: 'Vegetables', servingUnit: '1 cup (149g)', defaultGrams: 149, calories: 46, protein: 1.5, carbs: 9, fat: 0.4, fiber: 3.1 },

  // Beverages & Dairy
  { id: 'f_almond_milk', name: 'Unsweetened Almond Milk', category: 'Beverages', servingUnit: '1 cup (240ml)', defaultGrams: 240, calories: 30, protein: 1, carbs: 1, fat: 2.5, fiber: 1 },
  { id: 'f_fairlife_milk', name: 'Fairlife Ultra-Filtered Skim Milk', category: 'Beverages', servingUnit: '1 cup (240ml)', defaultGrams: 240, calories: 80, protein: 13, carbs: 6, fat: 0, fiber: 0 },
  { id: 'f_coffee_black', name: 'Black Coffee (Espresso / Filter)', category: 'Beverages', servingUnit: '1 cup (240ml)', defaultGrams: 240, calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0 }
];
