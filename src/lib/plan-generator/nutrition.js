import { FOOD_DB_LOCAL } from '../pn/foodDb.js';
import { computeTargetsMujer } from '../pn/targets.js';

export class NutritionPlanGenerator {
  constructor() {
    this.foodDb = FOOD_DB_LOCAL;
  }

  /**
   * Genera un plan nutricional completo para 7 días
   */
  async generateWeeklyPlan(user) {
    const targets = this.calculateTargets(user);
    const weekPlan = [];

    for (let day = 0; day < 7; day++) {
      const dailyPlan = this.generateDailyPlan(targets, day);
      weekPlan.push(dailyPlan);
    }

    return {
      targets,
      weekPlan,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
    };
  }

  /**
   * Calcula objetivos nutricionales basado en el perfil del usuario
   */
  calculateTargets(user) {
    const goal = user.goal || 'MAINTENANCE';
    const preference = user.preference || 'BALANCED';
    const activityLevel = user.activityLevel || 'MODERATE';
    const weight = user.weight || 70;
    const height = user.height || 170;
    const age = user.age || 30;
    const gender = user.gender || 'FEMALE';
    
    // Usar tu sistema existente como base
    const baseTargets = computeTargetsMujer(goal.toLowerCase(), preference.toLowerCase(), activityLevel === 'VERY_ACTIVE');
    
    // Ajustar según características del usuario
    const multiplier = this.getMultiplier(weight, height, age, gender, activityLevel);
    
    return {
      P: Math.round(baseTargets.P * multiplier * 10) / 10,
      C: Math.round(baseTargets.C * multiplier * 10) / 10,
      G: Math.round(baseTargets.G * multiplier * 10) / 10,
      V: baseTargets.V // Verduras se mantienen igual
    };
  }

  /**
   * Genera plan para un día específico
   */
  generateDailyPlan(targets, dayIndex) {
    const meals = this.distributeMacros(targets);
    const dailyMeals = [];

    // Generar cada comida del día
    for (const [mealType, macros] of Object.entries(meals)) {
      const meal = this.generateMeal(mealType, macros, dayIndex);
      dailyMeals.push(meal);
    }

    return {
      day: dayIndex + 1,
      meals: dailyMeals,
      totalMacros: targets
    };
  }

  /**
   * Distribuye macronutrientes entre las comidas del día
   */
  distributeMacros(targets) {
    return {
      DESAYUNO: {
        P: Math.round(targets.P * 0.25 * 10) / 10,
        C: Math.round(targets.C * 0.3 * 10) / 10,
        G: Math.round(targets.G * 0.25 * 10) / 10,
        V: Math.round(targets.V * 0.2 * 10) / 10
      },
      ALMUERZO: {
        P: Math.round(targets.P * 0.35 * 10) / 10,
        C: Math.round(targets.C * 0.4 * 10) / 10,
        G: Math.round(targets.G * 0.35 * 10) / 10,
        V: Math.round(targets.V * 0.4 * 10) / 10
      },
      ONCE: {
        P: Math.round(targets.P * 0.15 * 10) / 10,
        C: Math.round(targets.C * 0.2 * 10) / 10,
        G: Math.round(targets.G * 0.2 * 10) / 10,
        V: Math.round(targets.V * 0.2 * 10) / 10
      },
      CENA: {
        P: Math.round(targets.P * 0.25 * 10) / 10,
        C: Math.round(targets.C * 0.1 * 10) / 10,
        G: Math.round(targets.G * 0.2 * 10) / 10,
        V: Math.round(targets.V * 0.2 * 10) / 10
      }
    };
  }

  /**
   * Genera una comida específica
   */
  generateMeal(mealType, targetMacros, dayIndex) {
    const mealTemplates = this.getMealTemplates(mealType);
    const template = mealTemplates[dayIndex % mealTemplates.length];
    
    const ingredients = this.selectIngredients(template, targetMacros);
    
    return {
      type: mealType,
      name: template.name,
      description: template.description,
      ingredients,
      macros: this.calculateMealMacros(ingredients)
    };
  }

  /**
   * Selecciona ingredientes para cumplir con los macros objetivo
   */
  selectIngredients(template, targetMacros) {
    const ingredients = [];
    let remainingMacros = { ...targetMacros };

    for (const ingredientTemplate of template.ingredients) {
      const foodItems = this.getFoodsByMacro(ingredientTemplate.macro, ingredientTemplate.quality);
      const selectedFood = foodItems[Math.floor(Math.random() * Math.min(foodItems.length, 3))]; // Variedad
      
      if (selectedFood) {
        const amount = this.calculateAmount(selectedFood, ingredientTemplate.macro, remainingMacros);
        
        ingredients.push({
          name: selectedFood.name,
          amount: amount.display,
          proteins: amount.macros.P,
          carbs: amount.macros.C,
          fats: amount.macros.G,
          vegetables: amount.macros.V,
          quality: ingredientTemplate.quality
        });

        // Actualizar macros restantes
        remainingMacros.P -= amount.macros.P;
        remainingMacros.C -= amount.macros.C;
        remainingMacros.G -= amount.macros.G;
        remainingMacros.V -= amount.macros.V;
      }
    }

    return ingredients;
  }

  /**
   * Obtiene alimentos por macro y calidad
   */
  getFoodsByMacro(macro, quality) {
    return this.foodDb.filter(food => 
      food.pieces.some(piece => 
        piece.macro === macro && piece.calidad === quality
      )
    );
  }

  /**
   * Calcula cantidad necesaria de un alimento
   */
  calculateAmount(food, macro, remainingMacros) {
    const piece = food.pieces.find(p => p.macro === macro);
    const targetAmount = remainingMacros[macro];
    
    // Simplificado: 1 porción = 1 macro
    const portions = Math.max(1, Math.round(targetAmount));
    
    const macros = {
      P: piece.macro === 'P' ? portions : 0,
      C: piece.macro === 'C' ? portions : 0,
      G: piece.macro === 'G' ? portions : 0,
      V: piece.macro === 'V' ? portions : 0
    };

    return {
      display: `${portions} porción${portions > 1 ? 'es' : ''}`,
      macros
    };
  }

  /**
   * Templates de comidas por tipo
   */
  getMealTemplates(mealType) {
    const templates = {
      DESAYUNO: [
        {
          name: "Desayuno Energético",
          description: "Perfecto para comenzar el día con energía",
          ingredients: [
            { macro: 'P', quality: 'verde' },
            { macro: 'C', quality: 'verde' },
            { macro: 'G', quality: 'verde' },
            { macro: 'V', quality: 'verde' }
          ]
        },
        {
          name: "Desayuno Proteico",
          description: "Alto en proteínas para mantener la saciedad",
          ingredients: [
            { macro: 'P', quality: 'verde' },
            { macro: 'P', quality: 'verde' },
            { macro: 'C', quality: 'amarillo' },
            { macro: 'G', quality: 'verde' }
          ]
        }
      ],
      ALMUERZO: [
        {
          name: "Almuerzo Completo",
          description: "Comida principal balanceada",
          ingredients: [
            { macro: 'P', quality: 'verde' },
            { macro: 'C', quality: 'verde' },
            { macro: 'G', quality: 'verde' },
            { macro: 'V', quality: 'verde' },
            { macro: 'V', quality: 'verde' }
          ]
        },
        {
          name: "Almuerzo Ligero",
          description: "Opción más liviana pero nutritiva",
          ingredients: [
            { macro: 'P', quality: 'verde' },
            { macro: 'C', quality: 'amarillo' },
            { macro: 'G', quality: 'amarillo' },
            { macro: 'V', quality: 'verde' }
          ]
        }
      ],
      ONCE: [
        {
          name: "Once Saludable",
          description: "Merienda nutritiva",
          ingredients: [
            { macro: 'P', quality: 'verde' },
            { macro: 'C', quality: 'verde' },
            { macro: 'G', quality: 'verde' }
          ]
        }
      ],
      CENA: [
        {
          name: "Cena Liviana",
          description: "Cena ligera para mejor descanso",
          ingredients: [
            { macro: 'P', quality: 'verde' },
            { macro: 'C', quality: 'verde' },
            { macro: 'V', quality: 'verde' },
            { macro: 'V', quality: 'verde' }
          ]
        }
      ]
    };

    return templates[mealType] || templates.ALMUERZO;
  }

  /**
   * Calcula macros totales de una comida
   */
  calculateMealMacros(ingredients) {
    return ingredients.reduce(
      (total, ingredient) => ({
        P: total.P + ingredient.proteins,
        C: total.C + ingredient.carbs,
        G: total.G + ingredient.fats,
        V: total.V + ingredient.vegetables
      }),
      { P: 0, C: 0, G: 0, V: 0 }
    );
  }

  /**
   * Calcula multiplicador basado en características del usuario
   */
  getMultiplier(weight, height, age, gender, activityLevel) {
    // Fórmula básica Harris-Benedict simplificada
    let bmr = gender === 'MALE' 
      ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
      : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);

    const activityMultipliers = {
      SEDENTARY: 1.2,
      LIGHT: 1.375,
      MODERATE: 1.55,
      ACTIVE: 1.725,
      VERY_ACTIVE: 1.9
    };

    const tdee = bmr * (activityMultipliers[activityLevel] || 1.375);
    
    // Normalizar para que el plan base sea para ~1800 calorías
    return tdee / 1800;
  }
}