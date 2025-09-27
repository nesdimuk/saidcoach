import { FOOD_DB_LOCAL } from '../pn/foodDb.js';
import { computeTargetsMujer } from '../pn/targets.js';
import { 
  calculatePersonalizedNutrition, 
  calculateHandPortions, 
  distributeMealPortions 
} from '../pn/metabolismCalculator.js';
import { 
  getFoodsByMacroAndQuality, 
  getFoodQuality,
  calculateMealQualityScore 
} from '../pn/foodQualitySystem.js';

export class NutritionPlanGenerator {
  constructor() {
    this.foodDb = FOOD_DB_LOCAL;
  }

  /**
   * Genera un plan nutricional completo para 7 días usando Precision Nutrition
   */
  async generateWeeklyPlan(user) {
    try {
      // Usar el nuevo sistema de Precision Nutrition
      const nutritionProfile = calculatePersonalizedNutrition(user);
      const weekPlan = [];

      for (let day = 0; day < 7; day++) {
        const dailyPlan = this.generateDailyPlan(nutritionProfile, day);
        weekPlan.push(dailyPlan);
      }

      return {
        profile: nutritionProfile,
        weekPlan,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        methodology: 'Precision Nutrition Hand Portions'
      };
    } catch (error) {
      console.error('Error generando plan semanal:', error);
      // Fallback al sistema anterior si hay problemas
      return this.generateWeeklyPlanFallback(user);
    }
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
   * Genera plan para un día específico usando porciones de mano
   */
  generateDailyPlan(nutritionProfile, dayIndex) {
    const mealDistribution = nutritionProfile.mealDistribution;
    const dailyMeals = [];

    // Generar cada comida del día
    for (const [mealType, portions] of Object.entries(mealDistribution)) {
      const meal = this.generateHandPortionMeal(mealType, portions, dayIndex);
      dailyMeals.push(meal);
    }

    return {
      day: dayIndex + 1,
      date: new Date(Date.now() + dayIndex * 24 * 60 * 60 * 1000).toLocaleDateString(),
      meals: dailyMeals,
      dailyPortions: nutritionProfile.dailyPortions,
      targetCalories: nutritionProfile.targetCalories,
      tmb: nutritionProfile.tmb,
      tdee: nutritionProfile.tdee
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
   * Genera una comida específica usando porciones de mano
   */
  generateHandPortionMeal(mealType, targetPortions, dayIndex) {
    const mealTemplates = this.getHandPortionMealTemplates(mealType);
    const template = mealTemplates[dayIndex % mealTemplates.length];
    
    const ingredients = this.selectHandPortionIngredients(template, targetPortions);
    const qualityScore = calculateMealQualityScore(ingredients.map(i => i.foodId));
    
    return {
      type: mealType,
      name: template.name,
      description: template.description,
      ingredients,
      targetPortions,
      actualPortions: this.calculateActualPortions(ingredients),
      qualityScore: qualityScore,
      timing: this.getMealTiming(mealType),
      tips: template.tips || []
    };
  }

  /**
   * Genera una comida específica (método anterior como fallback)
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

  // ====== NUEVOS MÉTODOS PRECISION NUTRITION ======

  /**
   * Selecciona ingredientes usando sistema de porciones de mano
   */
  selectHandPortionIngredients(template, targetPortions) {
    const ingredients = [];
    
    // Priorizar alimentos verdes, luego amarillos, finalmente rojos
    const qualityPriority = ['verde', 'amarillo', 'rojo'];
    
    for (const portionRequirement of template.portions) {
      const { macro, minPortions, preferredQuality } = portionRequirement;
      const targetAmount = targetPortions[macro] || 0;
      
      if (targetAmount <= 0) continue;
      
      // Buscar alimentos en orden de prioridad de calidad
      let selectedFood = null;
      for (const quality of qualityPriority) {
        if (preferredQuality && quality !== preferredQuality) continue;
        
        const availableFoods = getFoodsByMacroAndQuality(macro, quality);
        if (availableFoods.length > 0) {
          // Seleccionar aleatoriamente para variedad
          selectedFood = availableFoods[Math.floor(Math.random() * availableFoods.length)];
          break;
        }
      }
      
      if (selectedFood) {
        const portions = Math.max(minPortions, Math.min(Math.ceil(targetAmount), minPortions + 1));
        
        ingredients.push({
          foodId: selectedFood.id,
          name: selectedFood.name,
          category: selectedFood.category,
          portions: portions,
          portionSize: selectedFood.portionSize,
          quality: getFoodQuality(selectedFood.id)?.quality || 'verde',
          macro: macro,
          macros: this.calculateIngredientMacros(selectedFood, portions),
          benefits: selectedFood.benefits || [],
          warnings: selectedFood.warnings || []
        });
      }
    }
    
    return ingredients;
  }

  /**
   * Templates de comidas con porciones de mano
   */
  getHandPortionMealTemplates(mealType) {
    const templates = {
      DESAYUNO: [
        {
          name: "Desayuno Energético PN",
          description: "Combinación balanceada para comenzar el día",
          portions: [
            { macro: 'P', minPortions: 1, preferredQuality: 'verde' },
            { macro: 'C', minPortions: 1, preferredQuality: 'verde' },
            { macro: 'G', minPortions: 0.5, preferredQuality: 'verde' },
            { macro: 'V', minPortions: 0.5, preferredQuality: 'verde' }
          ],
          tips: [
            "Hidrátate bien al despertar",
            "Come dentro de las 2 horas posteriores al despertar"
          ]
        },
        {
          name: "Desayuno Proteico PN",
          description: "Alto en proteínas para mayor saciedad",
          portions: [
            { macro: 'P', minPortions: 1.5, preferredQuality: 'verde' },
            { macro: 'C', minPortions: 0.5, preferredQuality: 'amarillo' },
            { macro: 'G', minPortions: 0.5, preferredQuality: 'verde' }
          ],
          tips: [
            "Ideal para días de entrenamiento matutino",
            "Mastica bien para mejor digestión"
          ]
        }
      ],
      COLACION_AM: [
        {
          name: "Snack Matutino PN",
          description: "Energía sostenida hasta el almuerzo",
          portions: [
            { macro: 'P', minPortions: 0.5, preferredQuality: 'verde' },
            { macro: 'C', minPortions: 0.5, preferredQuality: 'verde' },
            { macro: 'G', minPortions: 0.5, preferredQuality: 'verde' }
          ],
          tips: [
            "Come solo si tienes hambre real",
            "Combina proteína con carbohidrato"
          ]
        }
      ],
      ALMUERZO: [
        {
          name: "Almuerzo Completo PN",
          description: "Comida principal balanceada y nutritiva",
          portions: [
            { macro: 'P', minPortions: 1, preferredQuality: 'verde' },
            { macro: 'C', minPortions: 1, preferredQuality: 'verde' },
            { macro: 'G', minPortions: 1, preferredQuality: 'verde' },
            { macro: 'V', minPortions: 2, preferredQuality: 'verde' }
          ],
          tips: [
            "Empieza con las verduras",
            "Come despacio y mastica bien",
            "Deja de comer cuando estés 80% satisfecho"
          ]
        },
        {
          name: "Almuerzo Ligero PN",
          description: "Opción más liviana pero nutritiva",
          portions: [
            { macro: 'P', minPortions: 1, preferredQuality: 'verde' },
            { macro: 'C', minPortions: 0.5, preferredQuality: 'amarillo' },
            { macro: 'G', minPortions: 0.5, preferredQuality: 'verde' },
            { macro: 'V', minPortions: 1.5, preferredQuality: 'verde' }
          ],
          tips: [
            "Perfecto para días menos activos",
            "Incluye variedad de colores en verduras"
          ]
        }
      ],
      COLACION_PM: [
        {
          name: "Snack Vespertino PN",
          description: "Energía para la tarde",
          portions: [
            { macro: 'P', minPortions: 0.5, preferredQuality: 'verde' },
            { macro: 'C', minPortions: 0.25, preferredQuality: 'amarillo' },
            { macro: 'G', minPortions: 0.5, preferredQuality: 'verde' }
          ],
          tips: [
            "Evita si cenarás en menos de 3 horas",
            "Opta por opciones frescas"
          ]
        }
      ],
      CENA: [
        {
          name: "Cena Liviana PN",
          description: "Comida ligera para mejor descanso",
          portions: [
            { macro: 'P', minPortions: 1, preferredQuality: 'verde' },
            { macro: 'C', minPortions: 0.25, preferredQuality: 'verde' },
            { macro: 'G', minPortions: 0.5, preferredQuality: 'verde' },
            { macro: 'V', minPortions: 1.5, preferredQuality: 'verde' }
          ],
          tips: [
            "Cena al menos 3 horas antes de dormir",
            "Evita carbohidratos procesados",
            "Incluye vegetales crucíferos"
          ]
        }
      ]
    };

    return templates[mealType] || templates.ALMUERZO;
  }

  /**
   * Calcula macronutrientes de un ingrediente
   */
  calculateIngredientMacros(food, portions) {
    const baseMacros = food.macros || { protein: 0, carbs: 0, fat: 0 };
    
    return {
      P: Math.round(baseMacros.protein * portions * 10) / 10,
      C: Math.round(baseMacros.carbs * portions * 10) / 10,
      G: Math.round(baseMacros.fat * portions * 10) / 10,
      V: food.macro === 'V' ? portions : 0
    };
  }

  /**
   * Calcula porciones reales de una comida
   */
  calculateActualPortions(ingredients) {
    return ingredients.reduce((total, ingredient) => ({
      P: total.P + (ingredient.macro === 'P' ? ingredient.portions : 0),
      C: total.C + (ingredient.macro === 'C' ? ingredient.portions : 0),
      G: total.G + (ingredient.macro === 'G' ? ingredient.portions : 0),
      V: total.V + (ingredient.macro === 'V' ? ingredient.portions : 0)
    }), { P: 0, C: 0, G: 0, V: 0 });
  }

  /**
   * Obtiene horario recomendado para cada comida
   */
  getMealTiming(mealType) {
    const timings = {
      DESAYUNO: { time: '07:00 - 09:00', description: 'Dentro de 2 horas al despertar' },
      COLACION_AM: { time: '10:00 - 11:00', description: 'Solo si hay hambre real' },
      ALMUERZO: { time: '12:00 - 14:00', description: 'Comida principal del día' },
      COLACION_PM: { time: '16:00 - 17:00', description: 'Evitar si cena temprana' },
      CENA: { time: '19:00 - 20:00', description: '3+ horas antes de dormir' }
    };

    return timings[mealType] || timings.ALMUERZO;
  }

  /**
   * Plan semanal de respaldo (sistema anterior)
   */
  async generateWeeklyPlanFallback(user) {
    const targets = this.calculateTargets(user);
    const weekPlan = [];

    for (let day = 0; day < 7; day++) {
      const dailyPlan = this.generateDailyPlanFallback(targets, day);
      weekPlan.push(dailyPlan);
    }

    return {
      targets,
      weekPlan,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      methodology: 'Sistema anterior (fallback)'
    };
  }

  /**
   * Plan diario de respaldo
   */
  generateDailyPlanFallback(targets, dayIndex) {
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
}