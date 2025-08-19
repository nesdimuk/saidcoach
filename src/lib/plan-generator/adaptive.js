/**
 * Sistema de ajustes automáticos y adaptación de planes
 * Analiza el progreso del usuario y ajusta los planes en consecuencia
 */

export class AdaptivePlanManager {
  constructor() {
    this.analysisThreshold = 7; // Días mínimos para análisis
    this.adjustmentFactors = {
      nutrition: {
        adherence: 0.1,    // 10% de ajuste por adherencia
        progress: 0.15,    // 15% de ajuste por progreso
        energy: 0.05       // 5% de ajuste por energía
      },
      workout: {
        completion: 0.2,   // 20% de ajuste por completitud
        difficulty: 0.15,  // 15% de ajuste por dificultad percibida
        recovery: 0.1      // 10% de ajuste por recuperación
      }
    };
  }

  /**
   * Analiza el progreso del usuario y determina si necesita ajustes
   */
  async analyzeProgress(userId, progressData) {
    const analysis = {
      nutrition: this.analyzeNutritionProgress(progressData),
      workout: this.analyzeWorkoutProgress(progressData),
      overall: this.analyzeOverallProgress(progressData)
    };

    const recommendations = this.generateRecommendations(analysis);
    
    return {
      analysis,
      recommendations,
      needsAdjustment: this.shouldAdjustPlans(analysis),
      confidence: this.calculateConfidence(progressData.length)
    };
  }

  /**
   * Analiza progreso nutricional
   */
  analyzeNutritionProgress(progressData) {
    const nutritionData = progressData.filter(p => p.consumedP !== null);
    
    if (nutritionData.length < this.analysisThreshold) {
      return { status: 'insufficient_data', confidence: 'low' };
    }

    const adherence = this.calculateNutritionAdherence(nutritionData);
    const energyTrend = this.calculateEnergyTrend(nutritionData);
    const macroBalance = this.analyzeMacroBalance(nutritionData);

    return {
      adherence: {
        score: adherence.overall,
        protein: adherence.protein,
        carbs: adherence.carbs,
        fats: adherence.fats,
        vegetables: adherence.vegetables
      },
      energy: {
        average: energyTrend.average,
        trend: energyTrend.trend,
        consistency: energyTrend.consistency
      },
      macroBalance: {
        isBalanced: macroBalance.isBalanced,
        overages: macroBalance.overages,
        shortfalls: macroBalance.shortfalls
      },
      status: this.getNutritionStatus(adherence, energyTrend, macroBalance)
    };
  }

  /**
   * Analiza progreso de entrenamiento
   */
  analyzeWorkoutProgress(progressData) {
    const workoutData = progressData.filter(p => p.workoutCompleted !== null);
    
    if (workoutData.length < this.analysisThreshold) {
      return { status: 'insufficient_data', confidence: 'low' };
    }

    const completion = this.calculateWorkoutCompletion(workoutData);
    const consistency = this.calculateWorkoutConsistency(workoutData);
    const progression = this.analyzeWorkoutProgression(workoutData);

    return {
      completion: {
        rate: completion.rate,
        trend: completion.trend
      },
      consistency: {
        score: consistency.score,
        pattern: consistency.pattern
      },
      progression: {
        difficulty: progression.difficulty,
        volume: progression.volume,
        readiness: progression.readiness
      },
      status: this.getWorkoutStatus(completion, consistency, progression)
    };
  }

  /**
   * Analiza progreso general
   */
  analyzeOverallProgress(progressData) {
    const weightData = progressData.filter(p => p.weight !== null);
    const moodData = progressData.filter(p => p.mood !== null);

    return {
      weight: this.analyzeWeightTrend(weightData),
      mood: this.analyzeMoodTrend(moodData),
      consistency: this.analyzeOverallConsistency(progressData)
    };
  }

  /**
   * Calcula adherencia nutricional
   */
  calculateNutritionAdherence(nutritionData) {
    const totals = nutritionData.reduce((acc, day) => {
      const targets = this.getDayTargets(day); // Obtener targets del día
      
      acc.protein += Math.min(day.consumedP / targets.P, 1);
      acc.carbs += Math.min(day.consumedC / targets.C, 1);
      acc.fats += Math.min(day.consumedG / targets.G, 1);
      acc.vegetables += Math.min(day.consumedV / targets.V, 1);
      acc.count += 1;
      
      return acc;
    }, { protein: 0, carbs: 0, fats: 0, vegetables: 0, count: 0 });

    const protein = totals.protein / totals.count;
    const carbs = totals.carbs / totals.count;
    const fats = totals.fats / totals.count;
    const vegetables = totals.vegetables / totals.count;

    return {
      protein: Math.round(protein * 100),
      carbs: Math.round(carbs * 100),
      fats: Math.round(fats * 100),
      vegetables: Math.round(vegetables * 100),
      overall: Math.round((protein + carbs + fats + vegetables) / 4 * 100)
    };
  }

  /**
   * Calcula tendencia de energía
   */
  calculateEnergyTrend(nutritionData) {
    const energyLevels = nutritionData.map(d => d.energy).filter(e => e !== null);
    
    if (energyLevels.length === 0) return { average: 5, trend: 'stable', consistency: 'unknown' };

    const average = energyLevels.reduce((a, b) => a + b, 0) / energyLevels.length;
    const trend = this.calculateTrend(energyLevels);
    const consistency = this.calculateConsistency(energyLevels);

    return {
      average: Math.round(average * 10) / 10,
      trend,
      consistency
    };
  }

  /**
   * Genera recomendaciones basadas en el análisis
   */
  generateRecommendations(analysis) {
    const recommendations = [];

    // Recomendaciones nutricionales
    if (analysis.nutrition.status !== 'insufficient_data') {
      if (analysis.nutrition.adherence.overall < 70) {
        recommendations.push({
          type: 'nutrition',
          priority: 'high',
          title: 'Mejorar adherencia nutricional',
          description: 'Tu adherencia al plan nutricional está por debajo del 70%. Considera simplificar las comidas.',
          action: 'simplify_meals'
        });
      }

      if (analysis.nutrition.energy.average < 6) {
        recommendations.push({
          type: 'nutrition',
          priority: 'medium',
          title: 'Aumentar energía',
          description: 'Tus niveles de energía están bajos. Podríamos ajustar tus carbohidratos.',
          action: 'increase_carbs'
        });
      }
    }

    // Recomendaciones de entrenamiento
    if (analysis.workout.status !== 'insufficient_data') {
      if (analysis.workout.completion.rate < 60) {
        recommendations.push({
          type: 'workout',
          priority: 'high',
          title: 'Reducir intensidad del entrenamiento',
          description: 'Completas menos del 60% de tus entrenamientos. Vamos a hacer el plan más manejable.',
          action: 'reduce_intensity'
        });
      }

      if (analysis.workout.completion.rate > 90 && analysis.workout.progression.readiness === 'ready') {
        recommendations.push({
          type: 'workout',
          priority: 'medium',
          title: 'Aumentar dificultad',
          description: '¡Excelente progreso! Estás listo para el siguiente nivel.',
          action: 'increase_difficulty'
        });
      }
    }

    return recommendations;
  }

  /**
   * Aplica ajustes automáticos a los planes
   */
  async applyAutomaticAdjustments(userId, analysis, currentPlans) {
    const adjustments = {
      nutrition: null,
      workout: null
    };

    // Ajustes nutricionales
    if (analysis.nutrition.status !== 'insufficient_data') {
      adjustments.nutrition = this.calculateNutritionAdjustments(
        analysis.nutrition,
        currentPlans.nutrition
      );
    }

    // Ajustes de entrenamiento
    if (analysis.workout.status !== 'insufficient_data') {
      adjustments.workout = this.calculateWorkoutAdjustments(
        analysis.workout,
        currentPlans.workout
      );
    }

    return adjustments;
  }

  /**
   * Calcula ajustes nutricionales específicos
   */
  calculateNutritionAdjustments(nutritionAnalysis, currentPlan) {
    const adjustments = { ...currentPlan.targets };
    let modified = false;

    // Ajustar por adherencia baja
    if (nutritionAnalysis.adherence.overall < 70) {
      // Simplificar: reducir ligeramente los targets más difíciles de cumplir
      const lowestAdherence = Math.min(
        nutritionAnalysis.adherence.protein,
        nutritionAnalysis.adherence.carbs,
        nutritionAnalysis.adherence.fats
      );

      if (nutritionAnalysis.adherence.protein === lowestAdherence) {
        adjustments.P *= 0.9;
        modified = true;
      }
      if (nutritionAnalysis.adherence.carbs === lowestAdherence) {
        adjustments.C *= 0.9;
        modified = true;
      }
      if (nutritionAnalysis.adherence.fats === lowestAdherence) {
        adjustments.G *= 0.9;
        modified = true;
      }
    }

    // Ajustar por energía baja
    if (nutritionAnalysis.energy.average < 6) {
      adjustments.C *= 1.1; // Aumentar carbohidratos 10%
      modified = true;
    }

    // Ajustar por energía muy alta (posible exceso)
    if (nutritionAnalysis.energy.average > 8.5) {
      adjustments.C *= 0.95; // Reducir carbohidratos 5%
      modified = true;
    }

    return modified ? {
      ...adjustments,
      P: Math.round(adjustments.P * 10) / 10,
      C: Math.round(adjustments.C * 10) / 10,
      G: Math.round(adjustments.G * 10) / 10,
      V: adjustments.V // Verduras no se ajustan
    } : null;
  }

  /**
   * Calcula ajustes de entrenamiento específicos
   */
  calculateWorkoutAdjustments(workoutAnalysis, currentPlan) {
    let adjustments = null;

    // Si la completitud es muy baja, reducir intensidad
    if (workoutAnalysis.completion.rate < 60) {
      adjustments = {
        type: 'reduce_intensity',
        changes: {
          daysPerWeek: Math.max(2, currentPlan.daysPerWeek - 1),
          reduceVolume: true,
          simplifyExercises: true
        }
      };
    }

    // Si la completitud es muy alta y la progresión es buena, aumentar
    if (workoutAnalysis.completion.rate > 90 && 
        workoutAnalysis.progression.readiness === 'ready') {
      adjustments = {
        type: 'increase_intensity',
        changes: {
          daysPerWeek: Math.min(6, currentPlan.daysPerWeek + 1),
          increaseVolume: true,
          advanceExercises: true
        }
      };
    }

    return adjustments;
  }

  /**
   * Helpers para cálculos
   */
  calculateTrend(values) {
    if (values.length < 3) return 'stable';
    
    const recent = values.slice(-Math.min(5, values.length));
    const older = values.slice(0, Math.min(5, values.length));
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    
    const diff = recentAvg - olderAvg;
    
    if (diff > 0.5) return 'improving';
    if (diff < -0.5) return 'declining';
    return 'stable';
  }

  calculateConsistency(values) {
    if (values.length < 3) return 'unknown';
    
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);
    
    if (standardDeviation < 1) return 'high';
    if (standardDeviation < 2) return 'medium';
    return 'low';
  }

  shouldAdjustPlans(analysis) {
    // Criterios para determinar si se necesitan ajustes
    const needsNutritionAdjust = 
      analysis.nutrition.status !== 'insufficient_data' &&
      (analysis.nutrition.adherence.overall < 70 || 
       analysis.nutrition.energy.average < 5 ||
       analysis.nutrition.energy.average > 9);

    const needsWorkoutAdjust = 
      analysis.workout.status !== 'insufficient_data' &&
      (analysis.workout.completion.rate < 60 || 
       (analysis.workout.completion.rate > 90 && 
        analysis.workout.progression.readiness === 'ready'));

    return needsNutritionAdjust || needsWorkoutAdjust;
  }

  calculateConfidence(dataPoints) {
    if (dataPoints < 3) return 'very_low';
    if (dataPoints < 7) return 'low';
    if (dataPoints < 14) return 'medium';
    if (dataPoints < 30) return 'high';
    return 'very_high';
  }

  // Helpers adicionales para obtener datos contextuales
  getDayTargets(progressDay) {
    // En implementación real, obtener del plan del día específico
    // Por ahora retornamos valores por defecto
    return { P: 6, C: 6, G: 6, V: 6 };
  }

  getNutritionStatus(adherence, energy, macroBalance) {
    if (adherence.overall >= 80 && energy.average >= 7) return 'excellent';
    if (adherence.overall >= 70 && energy.average >= 6) return 'good';
    if (adherence.overall >= 60 && energy.average >= 5) return 'fair';
    return 'needs_improvement';
  }

  getWorkoutStatus(completion, consistency, progression) {
    if (completion.rate >= 90 && consistency.score >= 80) return 'excellent';
    if (completion.rate >= 70 && consistency.score >= 60) return 'good';
    if (completion.rate >= 50 && consistency.score >= 40) return 'fair';
    return 'needs_improvement';
  }

  calculateWorkoutCompletion(workoutData) {
    const completedCount = workoutData.filter(d => d.workoutCompleted).length;
    const rate = (completedCount / workoutData.length) * 100;
    
    // Calcular tendencia de completitud en los últimos días
    const recent = workoutData.slice(-7);
    const recentRate = recent.filter(d => d.workoutCompleted).length / recent.length * 100;
    const older = workoutData.slice(0, -7);
    const olderRate = older.length > 0 ? older.filter(d => d.workoutCompleted).length / older.length * 100 : rate;
    
    let trend = 'stable';
    if (recentRate > olderRate + 10) trend = 'improving';
    if (recentRate < olderRate - 10) trend = 'declining';

    return { rate, trend };
  }

  calculateWorkoutConsistency(workoutData) {
    // Analizar patrones de entrenamiento por día de la semana
    const dayPattern = {};
    workoutData.forEach(d => {
      const dayOfWeek = new Date(d.date).getDay();
      if (!dayPattern[dayOfWeek]) dayPattern[dayOfWeek] = { completed: 0, total: 0 };
      dayPattern[dayOfWeek].total++;
      if (d.workoutCompleted) dayPattern[dayOfWeek].completed++;
    });

    const consistencyScores = Object.values(dayPattern).map(pattern => 
      pattern.total > 0 ? (pattern.completed / pattern.total) * 100 : 0
    );

    const avgConsistency = consistencyScores.reduce((a, b) => a + b, 0) / consistencyScores.length;

    return {
      score: Math.round(avgConsistency),
      pattern: dayPattern
    };
  }

  analyzeWorkoutProgression(workoutData) {
    // Por ahora implementación simplificada
    const recentData = workoutData.slice(-7);
    const completionRate = recentData.filter(d => d.workoutCompleted).length / recentData.length;
    
    return {
      difficulty: completionRate > 0.8 ? 'easy' : completionRate > 0.5 ? 'appropriate' : 'hard',
      volume: 'appropriate', // Placeholder
      readiness: completionRate > 0.9 ? 'ready' : 'not_ready'
    };
  }

  analyzeWeightTrend(weightData) {
    if (weightData.length < 3) return { trend: 'insufficient_data' };
    
    const weights = weightData.map(d => d.weight);
    const trend = this.calculateTrend(weights);
    const change = weights[weights.length - 1] - weights[0];
    
    return {
      trend,
      totalChange: Math.round(change * 10) / 10,
      weeklyAverage: Math.round((change / (weightData.length / 7)) * 10) / 10
    };
  }

  analyzeMoodTrend(moodData) {
    if (moodData.length < 3) return { trend: 'insufficient_data' };
    
    const moods = moodData.map(d => d.mood);
    const average = moods.reduce((a, b) => a + b, 0) / moods.length;
    const trend = this.calculateTrend(moods);
    
    return {
      average: Math.round(average * 10) / 10,
      trend,
      consistency: this.calculateConsistency(moods)
    };
  }

  analyzeOverallConsistency(progressData) {
    const totalDays = progressData.length;
    const daysWithData = progressData.filter(d => 
      d.consumedP !== null || d.workoutCompleted !== null
    ).length;
    
    return {
      dataCompleteness: Math.round((daysWithData / totalDays) * 100),
      engagementLevel: daysWithData > 21 ? 'high' : daysWithData > 14 ? 'medium' : 'low'
    };
  }

  analyzeMacroBalance(nutritionData) {
    // Análisis simplificado del balance de macronutrientes
    const averages = nutritionData.reduce((acc, day) => {
      const targets = this.getDayTargets(day);
      acc.P += (day.consumedP / targets.P);
      acc.C += (day.consumedC / targets.C);
      acc.G += (day.consumedG / targets.G);
      acc.count++;
      return acc;
    }, { P: 0, C: 0, G: 0, count: 0 });

    const avgP = averages.P / averages.count;
    const avgC = averages.C / averages.count;
    const avgG = averages.G / averages.count;

    const overages = [];
    const shortfalls = [];

    if (avgP > 1.2) overages.push('protein');
    if (avgC > 1.2) overages.push('carbs');
    if (avgG > 1.2) overages.push('fats');

    if (avgP < 0.8) shortfalls.push('protein');
    if (avgC < 0.8) shortfalls.push('carbs');
    if (avgG < 0.8) shortfalls.push('fats');

    return {
      isBalanced: overages.length === 0 && shortfalls.length === 0,
      overages,
      shortfalls
    };
  }
}