/**
 * Sistema de Calidad de Alimentos - Precision Nutrition
 * Implementa el sistema tripartito Verde/Amarillo/Rojo del manual
 */

/**
 * Base de datos de alimentos clasificados por calidad y macronutriente
 * Basado en las listas específicas del manual de Precision Nutrition
 */

export const PROTEIN_FOODS = {
  // P1 - VERDE: Proteínas de alta calidad, bajas en grasa saturada
  verde: [
    {
      id: 'p1_pollo_pechuga',
      name: 'Pechuga de pollo sin piel',
      category: 'carnes',
      portionSize: '1 palma',
      grams: { male: 120, female: 90 },
      macros: { protein: 25, fat: 2, carbs: 0 },
      benefits: ['Alto en proteína', 'Bajo en grasa saturada', 'Rico en niacina']
    },
    {
      id: 'p1_pescado_blanco',
      name: 'Pescado blanco (merluza, lenguado)',
      category: 'pescados',
      portionSize: '1 palma',
      grams: { male: 120, female: 90 },
      macros: { protein: 22, fat: 1, carbs: 0 },
      benefits: ['Proteína completa', 'Omega-3', 'Bajo en mercurio']
    },
    {
      id: 'p1_claras_huevo',
      name: 'Claras de huevo',
      category: 'huevos',
      portionSize: '4-6 claras',
      grams: { male: 150, female: 120 },
      macros: { protein: 20, fat: 0, carbs: 1 },
      benefits: ['Proteína completa', 'Sin grasa', 'Rica en leucina']
    },
    {
      id: 'p1_yogurt_griego',
      name: 'Yogur griego natural descremado',
      category: 'lacteos',
      portionSize: '3/4 taza',
      grams: { male: 170, female: 130 },
      macros: { protein: 20, fat: 0, carbs: 8 },
      benefits: ['Probióticos', 'Calcio', 'Proteína completa']
    },
    {
      id: 'p1_legumbres',
      name: 'Legumbres (lentejas, garbanzos)',
      category: 'legumbres',
      portionSize: '3/4 taza cocidas',
      grams: { male: 150, female: 120 },
      macros: { protein: 15, fat: 1, carbs: 25 },
      benefits: ['Fibra', 'Folato', 'Proteína vegetal']
    }
  ],

  // P2 - AMARILLO: Proteínas moderadas, algo más procesadas
  amarillo: [
    {
      id: 'p2_carne_magra',
      name: 'Carne roja magra',
      category: 'carnes',
      portionSize: '1 palma',
      grams: { male: 120, female: 90 },
      macros: { protein: 25, fat: 8, carbs: 0 },
      benefits: ['Hierro hemo', 'Vitamina B12', 'Zinc']
    },
    {
      id: 'p2_huevos_enteros',
      name: 'Huevos enteros',
      category: 'huevos',
      portionSize: '2-3 huevos',
      grams: { male: 150, female: 120 },
      macros: { protein: 18, fat: 15, carbs: 1 },
      benefits: ['Colina', 'Vitamina D', 'Proteína completa']
    },
    {
      id: 'p2_queso_cottage',
      name: 'Queso cottage',
      category: 'lacteos',
      portionSize: '3/4 taza',
      grams: { male: 170, female: 130 },
      macros: { protein: 14, fat: 5, carbs: 5 },
      benefits: ['Caseína', 'Calcio', 'Bajo en sodio']
    }
  ],

  // P3 - ROJO: Proteínas procesadas, altas en sodio/grasa saturada
  rojo: [
    {
      id: 'p3_embutidos',
      name: 'Embutidos y fiambres',
      category: 'procesados',
      portionSize: '1 palma',
      grams: { male: 90, female: 70 },
      macros: { protein: 15, fat: 12, carbs: 2 },
      warnings: ['Alto sodio', 'Nitratos', 'Grasa saturada']
    },
    {
      id: 'p3_carne_procesada',
      name: 'Carne procesada (hamburguesas)',
      category: 'procesados',
      portionSize: '1 palma',
      grams: { male: 120, female: 90 },
      macros: { protein: 20, fat: 20, carbs: 5 },
      warnings: ['Alto en grasa', 'Aditivos', 'Conservantes']
    }
  ]
};

export const CARBOHYDRATE_FOODS = {
  // C1 - VERDE: Carbohidratos complejos, ricos en fibra
  verde: [
    {
      id: 'c1_avena',
      name: 'Avena integral',
      category: 'cereales',
      portionSize: '1 puño seco',
      grams: { male: 80, female: 60 },
      macros: { protein: 5, fat: 3, carbs: 27 },
      benefits: ['Beta-glucanos', 'Fibra soluble', 'Índice glucémico bajo']
    },
    {
      id: 'c1_quinoa',
      name: 'Quinoa',
      category: 'pseudocereales',
      portionSize: '1 puño cocida',
      grams: { male: 150, female: 120 },
      macros: { protein: 8, fat: 4, carbs: 30 },
      benefits: ['Proteína completa', 'Sin gluten', 'Magnesio']
    },
    {
      id: 'c1_camote',
      name: 'Camote/Batata',
      category: 'tuberculos',
      portionSize: '1 puño',
      grams: { male: 150, female: 120 },
      macros: { protein: 2, fat: 0, carbs: 27 },
      benefits: ['Betacarotenos', 'Potasio', 'Fibra']
    },
    {
      id: 'c1_arroz_integral',
      name: 'Arroz integral',
      category: 'cereales',
      portionSize: '1 puño cocido',
      grams: { male: 150, female: 120 },
      macros: { protein: 5, fat: 2, carbs: 28 },
      benefits: ['Manganeso', 'Selenio', 'Fibra insoluble']
    }
  ],

  // C2 - AMARILLO: Carbohidratos refinados con algunos nutrientes
  amarillo: [
    {
      id: 'c2_pan_integral',
      name: 'Pan integral',
      category: 'panificados',
      portionSize: '2 rebanadas',
      grams: { male: 60, female: 50 },
      macros: { protein: 6, fat: 3, carbs: 24 },
      benefits: ['Fibra', 'Vitaminas B', 'Hierro']
    },
    {
      id: 'c2_pasta_integral',
      name: 'Pasta integral',
      category: 'cereales',
      portionSize: '1 puño cocida',
      grams: { male: 150, female: 120 },
      macros: { protein: 7, fat: 2, carbs: 30 },
      benefits: ['Fibra', 'Selenio', 'Manganeso']
    },
    {
      id: 'c2_frutas',
      name: 'Frutas frescas',
      category: 'frutas',
      portionSize: '1 puño',
      grams: { male: 150, female: 120 },
      macros: { protein: 1, fat: 0, carbs: 20 },
      benefits: ['Antioxidantes', 'Vitamina C', 'Potasio']
    }
  ],

  // C3 - ROJO: Carbohidratos ultra-procesados
  rojo: [
    {
      id: 'c3_pan_blanco',
      name: 'Pan blanco',
      category: 'procesados',
      portionSize: '2 rebanadas',
      grams: { male: 60, female: 50 },
      macros: { protein: 5, fat: 2, carbs: 26 },
      warnings: ['Alto índice glucémico', 'Bajo en fibra', 'Aditivos']
    },
    {
      id: 'c3_galletas',
      name: 'Galletas comerciales',
      category: 'procesados',
      portionSize: '4-6 unidades',
      grams: { male: 40, female: 30 },
      macros: { protein: 3, fat: 8, carbs: 20 },
      warnings: ['Grasas trans', 'Azúcar añadido', 'Conservantes']
    }
  ]
};

export const FAT_FOODS = {
  // G1 - VERDE: Grasas saludables, no procesadas
  verde: [
    {
      id: 'g1_palta',
      name: 'Palta/Aguacate',
      category: 'frutas',
      portionSize: '1/2 unidad mediana',
      grams: { male: 75, female: 60 },
      macros: { protein: 2, fat: 15, carbs: 4 },
      benefits: ['Omega-9', 'Potasio', 'Folato']
    },
    {
      id: 'g1_aceite_oliva',
      name: 'Aceite de oliva extra virgen',
      category: 'aceites',
      portionSize: '1 cucharada',
      grams: { male: 15, female: 12 },
      macros: { protein: 0, fat: 14, carbs: 0 },
      benefits: ['Antioxidantes', 'Vitamina E', 'Polifenoles']
    },
    {
      id: 'g1_frutos_secos',
      name: 'Frutos secos naturales',
      category: 'frutos_secos',
      portionSize: '1 pulgar',
      grams: { male: 30, female: 25 },
      macros: { protein: 6, fat: 14, carbs: 4 },
      benefits: ['Vitamina E', 'Magnesio', 'Fibra']
    },
    {
      id: 'g1_semillas',
      name: 'Semillas (chía, linaza)',
      category: 'semillas',
      portionSize: '1 cucharada',
      grams: { male: 15, female: 12 },
      macros: { protein: 3, fat: 8, carbs: 2 },
      benefits: ['Omega-3', 'Lignanos', 'Fibra']
    }
  ],

  // G2 - AMARILLO: Grasas con procesamiento mínimo
  amarillo: [
    {
      id: 'g2_mantequilla',
      name: 'Mantequilla natural',
      category: 'lacteos',
      portionSize: '1 cucharadita',
      grams: { male: 8, female: 6 },
      macros: { protein: 0, fat: 8, carbs: 0 },
      benefits: ['Vitamina A', 'Ácido butírico']
    },
    {
      id: 'g2_quesos_grasos',
      name: 'Quesos grasos',
      category: 'lacteos',
      portionSize: '1 pulgar',
      grams: { male: 30, female: 25 },
      macros: { protein: 7, fat: 9, carbs: 1 },
      benefits: ['Calcio', 'Proteína', 'Vitamina K2']
    }
  ],

  // G3 - ROJO: Grasas procesadas y trans
  rojo: [
    {
      id: 'g3_margarina',
      name: 'Margarina',
      category: 'procesados',
      portionSize: '1 cucharadita',
      grams: { male: 8, female: 6 },
      macros: { protein: 0, fat: 8, carbs: 0 },
      warnings: ['Grasas trans', 'Aceites hidrogenados', 'Aditivos']
    },
    {
      id: 'g3_frituras',
      name: 'Alimentos fritos comerciales',
      category: 'procesados',
      portionSize: '1 pulgar',
      grams: { male: 30, female: 25 },
      macros: { protein: 2, fat: 15, carbs: 10 },
      warnings: ['Grasas oxidadas', 'Acrilamidas', 'Alto en calorías']
    }
  ]
};

export const VEGETABLE_FOODS = {
  // V1 - VERDE: Verduras frescas y variadas
  verde: [
    {
      id: 'v1_hojas_verdes',
      name: 'Hojas verdes (espinaca, rúcula)',
      category: 'verduras',
      portionSize: '2 puños',
      grams: { male: 200, female: 160 },
      macros: { protein: 4, fat: 0, carbs: 6 },
      benefits: ['Folato', 'Hierro', 'Vitamina K']
    },
    {
      id: 'v1_cruciferas',
      name: 'Verduras crucíferas (brócoli, coliflor)',
      category: 'verduras',
      portionSize: '1 puño',
      grams: { male: 150, female: 120 },
      macros: { protein: 3, fat: 0, carbs: 6 },
      benefits: ['Sulforafano', 'Vitamina C', 'Fibra']
    },
    {
      id: 'v1_colores',
      name: 'Verduras de colores (zanahoria, pimentón)',
      category: 'verduras',
      portionSize: '1 puño',
      grams: { male: 150, female: 120 },
      macros: { protein: 2, fat: 0, carbs: 8 },
      benefits: ['Betacarotenos', 'Antocianinas', 'Licopeno']
    }
  ]
};

/**
 * Clasifica un alimento según su calidad nutricional
 * @param {string} foodId - ID del alimento
 * @returns {Object} Información de calidad y clasificación
 */
export function getFoodQuality(foodId) {
  const allFoods = [
    ...PROTEIN_FOODS.verde, ...PROTEIN_FOODS.amarillo, ...PROTEIN_FOODS.rojo,
    ...CARBOHYDRATE_FOODS.verde, ...CARBOHYDRATE_FOODS.amarillo, ...CARBOHYDRATE_FOODS.rojo,
    ...FAT_FOODS.verde, ...FAT_FOODS.amarillo, ...FAT_FOODS.rojo,
    ...VEGETABLE_FOODS.verde
  ];

  const food = allFoods.find(f => f.id === foodId);
  
  if (!food) return null;

  // Determinar calidad y macronutriente
  let quality, macro;
  
  if (PROTEIN_FOODS.verde.includes(food)) { quality = 'verde'; macro = 'P'; }
  else if (PROTEIN_FOODS.amarillo.includes(food)) { quality = 'amarillo'; macro = 'P'; }
  else if (PROTEIN_FOODS.rojo.includes(food)) { quality = 'rojo'; macro = 'P'; }
  else if (CARBOHYDRATE_FOODS.verde.includes(food)) { quality = 'verde'; macro = 'C'; }
  else if (CARBOHYDRATE_FOODS.amarillo.includes(food)) { quality = 'amarillo'; macro = 'C'; }
  else if (CARBOHYDRATE_FOODS.rojo.includes(food)) { quality = 'rojo'; macro = 'C'; }
  else if (FAT_FOODS.verde.includes(food)) { quality = 'verde'; macro = 'G'; }
  else if (FAT_FOODS.amarillo.includes(food)) { quality = 'amarillo'; macro = 'G'; }
  else if (FAT_FOODS.rojo.includes(food)) { quality = 'rojo'; macro = 'G'; }
  else if (VEGETABLE_FOODS.verde.includes(food)) { quality = 'verde'; macro = 'V'; }

  return {
    ...food,
    quality,
    macro,
    qualityScore: quality === 'verde' ? 3 : quality === 'amarillo' ? 2 : 1
  };
}

/**
 * Obtiene alimentos por macro y calidad
 * @param {string} macro - P, C, G, V
 * @param {string} quality - verde, amarillo, rojo
 * @returns {Array} Lista de alimentos filtrados
 */
export function getFoodsByMacroAndQuality(macro, quality) {
  const foodSets = {
    P: PROTEIN_FOODS,
    C: CARBOHYDRATE_FOODS,
    G: FAT_FOODS,
    V: VEGETABLE_FOODS
  };

  return foodSets[macro]?.[quality] || [];
}

/**
 * Calcula el puntaje de calidad de una comida
 * @param {Array} foods - Lista de alimentos en la comida
 * @returns {Object} Puntaje y recomendaciones
 */
export function calculateMealQualityScore(foods) {
  if (!foods || foods.length === 0) {
    return { score: 0, grade: 'F', recommendations: ['Agregar alimentos variados'] };
  }

  let totalScore = 0;
  let maxScore = 0;
  const macroCount = { P: 0, C: 0, G: 0, V: 0 };
  const qualityCount = { verde: 0, amarillo: 0, rojo: 0 };

  foods.forEach(foodId => {
    const food = getFoodQuality(foodId);
    if (food) {
      totalScore += food.qualityScore;
      maxScore += 3; // Puntaje máximo por alimento
      macroCount[food.macro]++;
      qualityCount[food.quality]++;
    }
  });

  const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
  
  let grade;
  if (percentage >= 90) grade = 'A+';
  else if (percentage >= 80) grade = 'A';
  else if (percentage >= 70) grade = 'B';
  else if (percentage >= 60) grade = 'C';
  else grade = 'D';

  const recommendations = [];
  
  // Verificar balance de macros
  if (macroCount.V === 0) recommendations.push('Agregar verduras para más nutrientes y fibra');
  if (qualityCount.rojo > qualityCount.verde) {
    recommendations.push('Reemplazar alimentos rojos por opciones verdes');
  }
  if (macroCount.P === 0) recommendations.push('Incluir una fuente de proteína');

  return {
    score: Math.round(percentage),
    grade,
    totalScore,
    maxScore,
    macroBalance: macroCount,
    qualityDistribution: qualityCount,
    recommendations: recommendations.length > 0 ? recommendations : ['¡Excelente selección de alimentos!']
  };
}