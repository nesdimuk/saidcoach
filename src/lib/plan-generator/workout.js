export class WorkoutPlanGenerator {
  constructor() {
    this.exerciseDatabase = this.initializeExerciseDatabase();
  }

  /**
   * Genera un plan de entrenamiento semanal
   */
  async generateWeeklyPlan(user) {
    const { goal, level, daysPerWeek } = this.parseUserPreferences(user);
    const template = this.selectTemplate(goal, level, daysPerWeek);
    
    const weeklyPlan = this.buildWeeklySchedule(template, daysPerWeek);
    
    return {
      goal,
      level,
      daysPerWeek,
      workouts: weeklyPlan,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
  }

  /**
   * Parsea preferencias del usuario con algoritmo mejorado
   */
  parseUserPreferences(user) {
    const activityLevel = user.activityLevel || 'MODERATE';
    const age = user.age || 30;
    const goal = user.goal || 'MAINTENANCE';
    
    // Algoritmo inteligente para determinar nivel
    let level = 'INTERMEDIATE'; // default
    
    if (activityLevel === 'SEDENTARY') {
      level = 'BEGINNER';
    } else if (activityLevel === 'LIGHT') {
      level = age > 50 ? 'BEGINNER' : 'INTERMEDIATE';
    } else if (activityLevel === 'MODERATE') {
      level = 'INTERMEDIATE';
    } else if (activityLevel === 'ACTIVE') {
      level = age > 45 ? 'INTERMEDIATE' : 'ADVANCED';
    } else if (activityLevel === 'VERY_ACTIVE') {
      level = 'ADVANCED';
    }

    // Días por semana basado en objetivo y nivel
    let daysPerWeek;
    if (goal === 'WEIGHT_LOSS') {
      daysPerWeek = level === 'BEGINNER' ? 4 : level === 'INTERMEDIATE' ? 5 : 6;
    } else if (goal === 'MUSCLE_GAIN') {
      daysPerWeek = level === 'BEGINNER' ? 3 : level === 'INTERMEDIATE' ? 4 : 5;
    } else { // MAINTENANCE
      daysPerWeek = level === 'BEGINNER' ? 3 : 4;
    }

    return {
      goal,
      level,
      daysPerWeek,
      age,
      activityLevel
    };
  }

  /**
   * Selecciona template de entrenamiento
   */
  selectTemplate(goal, level, daysPerWeek) {
    const templates = {
      'WEIGHT_LOSS': {
        'BEGINNER': this.getWeightLossBeginnerTemplate(),
        'INTERMEDIATE': this.getWeightLossIntermediateTemplate(),
        'ADVANCED': this.getWeightLossAdvancedTemplate()
      },
      'MUSCLE_GAIN': {
        'BEGINNER': this.getMuscleGainBeginnerTemplate(),
        'INTERMEDIATE': this.getMuscleGainIntermediateTemplate(),
        'ADVANCED': this.getMuscleGainAdvancedTemplate()
      },
      'MAINTENANCE': {
        'BEGINNER': this.getMaintenanceBeginnerTemplate(),
        'INTERMEDIATE': this.getMaintenanceIntermediateTemplate(),
        'ADVANCED': this.getMaintenanceAdvancedTemplate()
      }
    };

    return templates[goal][level];
  }

  /**
   * Construye horario semanal
   */
  buildWeeklySchedule(template, daysPerWeek) {
    const schedule = [];
    
    for (let day = 0; day < daysPerWeek; day++) {
      const workoutTemplate = template[day % template.length];
      const workout = this.generateWorkout(workoutTemplate, day + 1);
      schedule.push(workout);
    }

    return schedule;
  }

  /**
   * Genera un entrenamiento específico
   */
  generateWorkout(template, dayNumber) {
    const exercises = template.exercises.map((exerciseTemplate, index) => {
      const exercise = this.selectExercise(exerciseTemplate);
      return {
        ...exercise,
        sets: exerciseTemplate.sets,
        reps: exerciseTemplate.reps,
        rest: exerciseTemplate.rest,
        order: index + 1
      };
    });

    return {
      name: `Día ${dayNumber}: ${template.name}`,
      dayOfWeek: dayNumber,
      exercises,
      estimatedTime: this.calculateEstimatedTime(exercises),
      warmup: template.warmup,
      cooldown: template.cooldown
    };
  }

  /**
   * Selecciona ejercicio específico
   */
  selectExercise(template) {
    const availableExercises = this.exerciseDatabase.filter(ex => 
      ex.category === template.category && 
      ex.bodyPart === template.bodyPart
    );

    const exercise = availableExercises[Math.floor(Math.random() * availableExercises.length)];
    
    return exercise || {
      name: `Ejercicio de ${template.bodyPart}`,
      category: template.category,
      bodyPart: template.bodyPart,
      notes: 'Ejercicio básico para esta zona'
    };
  }

  /**
   * Calcula tiempo estimado del entrenamiento
   */
  calculateEstimatedTime(exercises) {
    // Promedio: 45 segundos por serie + descanso
    const totalSets = exercises.reduce((total, ex) => total + ex.sets, 0);
    const avgRestTime = 60; // segundos
    const avgSetTime = 45; // segundos
    
    return Math.round((totalSets * (avgSetTime + avgRestTime)) / 60); // minutos
  }

  // Templates para pérdida de peso
  getWeightLossBeginnerTemplate() {
    return [
      {
        name: "Cuerpo Completo A",
        exercises: [
          { category: 'FUERZA', bodyPart: 'PIERNAS', sets: 3, reps: '12-15', rest: '60 seg' },
          { category: 'FUERZA', bodyPart: 'PECHO', sets: 3, reps: '8-12', rest: '60 seg' },
          { category: 'FUERZA', bodyPart: 'ESPALDA', sets: 3, reps: '8-12', rest: '60 seg' },
          { category: 'CARDIO', bodyPart: 'CUERPO_COMPLETO', sets: 1, reps: '15 min', rest: '2 min' }
        ],
        warmup: "5 minutos de caminata ligera",
        cooldown: "5 minutos de estiramiento"
      },
      {
        name: "Cuerpo Completo B",
        exercises: [
          { category: 'FUERZA', bodyPart: 'CORE', sets: 3, reps: '10-15', rest: '45 seg' },
          { category: 'FUERZA', bodyPart: 'HOMBROS', sets: 3, reps: '8-12', rest: '60 seg' },
          { category: 'FUERZA', bodyPart: 'BRAZOS', sets: 3, reps: '10-15', rest: '45 seg' },
          { category: 'CARDIO', bodyPart: 'CUERPO_COMPLETO', sets: 1, reps: '15 min', rest: '2 min' }
        ],
        warmup: "5 minutos de movilidad articular",
        cooldown: "5 minutos de estiramiento"
      }
    ];
  }

  getWeightLossIntermediateTemplate() {
    return [
      {
        name: "Tren Superior",
        exercises: [
          { category: 'FUERZA', bodyPart: 'PECHO', sets: 4, reps: '8-12', rest: '75 seg' },
          { category: 'FUERZA', bodyPart: 'ESPALDA', sets: 4, reps: '8-12', rest: '75 seg' },
          { category: 'FUERZA', bodyPart: 'HOMBROS', sets: 3, reps: '10-15', rest: '60 seg' },
          { category: 'FUERZA', bodyPart: 'BRAZOS', sets: 3, reps: '12-15', rest: '45 seg' },
          { category: 'CARDIO', bodyPart: 'CUERPO_COMPLETO', sets: 1, reps: '10 min', rest: '2 min' }
        ],
        warmup: "7 minutos de activación",
        cooldown: "7 minutos de estiramiento"
      },
      {
        name: "Tren Inferior",
        exercises: [
          { category: 'FUERZA', bodyPart: 'PIERNAS', sets: 4, reps: '10-15', rest: '90 seg' },
          { category: 'FUERZA', bodyPart: 'PIERNAS', sets: 3, reps: '12-15', rest: '75 seg' },
          { category: 'FUERZA', bodyPart: 'CORE', sets: 4, reps: '15-20', rest: '45 seg' },
          { category: 'CARDIO', bodyPart: 'CUERPO_COMPLETO', sets: 1, reps: '15 min', rest: '2 min' }
        ],
        warmup: "7 minutos de movilidad",
        cooldown: "7 minutos de estiramiento"
      }
    ];
  }

  getWeightLossAdvancedTemplate() {
    return [
      {
        name: "Push (Empuje)",
        exercises: [
          { category: 'FUERZA', bodyPart: 'PECHO', sets: 4, reps: '6-10', rest: '90 seg' },
          { category: 'FUERZA', bodyPart: 'HOMBROS', sets: 4, reps: '8-12', rest: '75 seg' },
          { category: 'FUERZA', bodyPart: 'BRAZOS', sets: 3, reps: '10-15', rest: '60 seg' },
          { category: 'CARDIO', bodyPart: 'CUERPO_COMPLETO', sets: 1, reps: '8 min HIIT', rest: '2 min' }
        ],
        warmup: "10 minutos de activación",
        cooldown: "8 minutos de estiramiento"
      },
      {
        name: "Pull (Tirón)",
        exercises: [
          { category: 'FUERZA', bodyPart: 'ESPALDA', sets: 4, reps: '6-10', rest: '90 seg' },
          { category: 'FUERZA', bodyPart: 'ESPALDA', sets: 3, reps: '8-12', rest: '75 seg' },
          { category: 'FUERZA', bodyPart: 'BRAZOS', sets: 3, reps: '10-15', rest: '60 seg' },
          { category: 'CARDIO', bodyPart: 'CUERPO_COMPLETO', sets: 1, reps: '8 min HIIT', rest: '2 min' }
        ],
        warmup: "10 minutos de movilidad",
        cooldown: "8 minutos de estiramiento"
      },
      {
        name: "Piernas + Core",
        exercises: [
          { category: 'FUERZA', bodyPart: 'PIERNAS', sets: 5, reps: '6-10', rest: '2 min' },
          { category: 'FUERZA', bodyPart: 'PIERNAS', sets: 4, reps: '8-12', rest: '90 seg' },
          { category: 'FUERZA', bodyPart: 'CORE', sets: 4, reps: '15-25', rest: '45 seg' },
          { category: 'CARDIO', bodyPart: 'CUERPO_COMPLETO', sets: 1, reps: '10 min', rest: '2 min' }
        ],
        warmup: "10 minutos de activación",
        cooldown: "8 minutos de estiramiento"
      }
    ];
  }

  // Templates para ganancia muscular
  getMuscleGainBeginnerTemplate() {
    return [
      {
        name: "Cuerpo Completo A",
        exercises: [
          { category: 'FUERZA', bodyPart: 'PIERNAS', sets: 3, reps: '8-12', rest: '90 seg' },
          { category: 'FUERZA', bodyPart: 'PECHO', sets: 3, reps: '8-12', rest: '90 seg' },
          { category: 'FUERZA', bodyPart: 'ESPALDA', sets: 3, reps: '8-12', rest: '90 seg' },
          { category: 'FUERZA', bodyPart: 'CORE', sets: 2, reps: '10-15', rest: '60 seg' }
        ],
        warmup: "7 minutos de activación",
        cooldown: "5 minutos de estiramiento"
      },
      {
        name: "Cuerpo Completo B",
        exercises: [
          { category: 'FUERZA', bodyPart: 'PIERNAS', sets: 3, reps: '8-12', rest: '90 seg' },
          { category: 'FUERZA', bodyPart: 'HOMBROS', sets: 3, reps: '8-12', rest: '75 seg' },
          { category: 'FUERZA', bodyPart: 'BRAZOS', sets: 3, reps: '8-12', rest: '75 seg' },
          { category: 'FUERZA', bodyPart: 'CORE', sets: 2, reps: '10-15', rest: '60 seg' }
        ],
        warmup: "7 minutos de movilidad",
        cooldown: "5 minutos de estiramiento"
      }
    ];
  }

  getMuscleGainIntermediateTemplate() {
    return [
      {
        name: "Tren Superior",
        exercises: [
          { category: 'FUERZA', bodyPart: 'PECHO', sets: 4, reps: '6-10', rest: '2 min' },
          { category: 'FUERZA', bodyPart: 'ESPALDA', sets: 4, reps: '6-10', rest: '2 min' },
          { category: 'FUERZA', bodyPart: 'HOMBROS', sets: 3, reps: '8-12', rest: '90 seg' },
          { category: 'FUERZA', bodyPart: 'BRAZOS', sets: 3, reps: '8-12', rest: '75 seg' }
        ],
        warmup: "8 minutos de activación",
        cooldown: "6 minutos de estiramiento"
      },
      {
        name: "Tren Inferior",
        exercises: [
          { category: 'FUERZA', bodyPart: 'PIERNAS', sets: 4, reps: '6-10', rest: '2.5 min' },
          { category: 'FUERZA', bodyPart: 'PIERNAS', sets: 3, reps: '8-12', rest: '2 min' },
          { category: 'FUERZA', bodyPart: 'PIERNAS', sets: 3, reps: '10-15', rest: '90 seg' },
          { category: 'FUERZA', bodyPart: 'CORE', sets: 3, reps: '12-20', rest: '60 seg' }
        ],
        warmup: "8 minutos de movilidad",
        cooldown: "6 minutos de estiramiento"
      }
    ];
  }

  getMuscleGainAdvancedTemplate() {
    return [
      {
        name: "Push (Empuje)",
        exercises: [
          { category: 'FUERZA', bodyPart: 'PECHO', sets: 5, reps: '4-8', rest: '3 min' },
          { category: 'FUERZA', bodyPart: 'PECHO', sets: 4, reps: '6-10', rest: '2.5 min' },
          { category: 'FUERZA', bodyPart: 'HOMBROS', sets: 4, reps: '8-12', rest: '2 min' },
          { category: 'FUERZA', bodyPart: 'BRAZOS', sets: 4, reps: '8-15', rest: '90 seg' }
        ],
        warmup: "10 minutos de activación",
        cooldown: "8 minutos de estiramiento"
      },
      {
        name: "Pull (Tirón)",
        exercises: [
          { category: 'FUERZA', bodyPart: 'ESPALDA', sets: 5, reps: '4-8', rest: '3 min' },
          { category: 'FUERZA', bodyPart: 'ESPALDA', sets: 4, reps: '6-10', rest: '2.5 min' },
          { category: 'FUERZA', bodyPart: 'ESPALDA', sets: 3, reps: '8-12', rest: '2 min' },
          { category: 'FUERZA', bodyPart: 'BRAZOS', sets: 4, reps: '8-15', rest: '90 seg' }
        ],
        warmup: "10 minutos de movilidad",
        cooldown: "8 minutos de estiramiento"
      },
      {
        name: "Piernas",
        exercises: [
          { category: 'FUERZA', bodyPart: 'PIERNAS', sets: 5, reps: '4-8', rest: '3 min' },
          { category: 'FUERZA', bodyPart: 'PIERNAS', sets: 4, reps: '6-10', rest: '2.5 min' },
          { category: 'FUERZA', bodyPart: 'PIERNAS', sets: 3, reps: '8-12', rest: '2 min' },
          { category: 'FUERZA', bodyPart: 'CORE', sets: 4, reps: '12-20', rest: '75 seg' }
        ],
        warmup: "10 minutos de activación",
        cooldown: "8 minutos de estiramiento"
      }
    ];
  }

  // Templates para mantenimiento (similares a pérdida de peso pero menos cardio)
  getMaintenanceBeginnerTemplate() {
    const template = this.getWeightLossBeginnerTemplate();
    // Reducir cardio
    return template.map(workout => ({
      ...workout,
      exercises: workout.exercises.filter(ex => ex.category !== 'CARDIO')
    }));
  }

  getMaintenanceIntermediateTemplate() {
    const template = this.getWeightLossIntermediateTemplate();
    return template.map(workout => ({
      ...workout,
      exercises: workout.exercises.filter(ex => ex.category !== 'CARDIO')
    }));
  }

  getMaintenanceAdvancedTemplate() {
    const template = this.getMuscleGainAdvancedTemplate();
    return template;
  }

  /**
   * Base de datos de ejercicios
   */
  initializeExerciseDatabase() {
    return [
      // PECHO
      { name: "Flexiones", category: 'FUERZA', bodyPart: 'PECHO', notes: "Mantén el core activo" },
      { name: "Press de pecho con mancuernas", category: 'FUERZA', bodyPart: 'PECHO', notes: "Controla el movimiento" },
      { name: "Aperturas con mancuernas", category: 'FUERZA', bodyPart: 'PECHO', notes: "Siente el estiramiento" },
      
      // ESPALDA
      { name: "Remo con mancuernas", category: 'FUERZA', bodyPart: 'ESPALDA', notes: "Aprieta los omóplatos" },
      { name: "Dominadas asistidas", category: 'FUERZA', bodyPart: 'ESPALDA', notes: "Controla la bajada" },
      { name: "Peso muerto", category: 'FUERZA', bodyPart: 'ESPALDA', notes: "Mantén la espalda recta" },
      
      // PIERNAS
      { name: "Sentadillas", category: 'FUERZA', bodyPart: 'PIERNAS', notes: "Baja hasta donde puedas" },
      { name: "Zancadas", category: 'FUERZA', bodyPart: 'PIERNAS', notes: "Alterna las piernas" },
      { name: "Peso muerto rumano", category: 'FUERZA', bodyPart: 'PIERNAS', notes: "Siente los isquiotibiales" },
      { name: "Elevaciones de pantorrilla", category: 'FUERZA', bodyPart: 'PIERNAS', notes: "Pausa arriba" },
      
      // HOMBROS
      { name: "Press militar", category: 'FUERZA', bodyPart: 'HOMBROS', notes: "Core activo" },
      { name: "Elevaciones laterales", category: 'FUERZA', bodyPart: 'HOMBROS', notes: "Control del movimiento" },
      { name: "Elevaciones frontales", category: 'FUERZA', bodyPart: 'HOMBROS', notes: "No uses impulso" },
      
      // BRAZOS
      { name: "Curl de bíceps", category: 'FUERZA', bodyPart: 'BRAZOS', notes: "Controla la bajada" },
      { name: "Extensiones de tríceps", category: 'FUERZA', bodyPart: 'BRAZOS', notes: "Codos fijos" },
      { name: "Martillo", category: 'FUERZA', bodyPart: 'BRAZOS', notes: "Agarre neutro" },
      
      // CORE
      { name: "Plancha", category: 'FUERZA', bodyPart: 'CORE', notes: "Línea recta del cuerpo" },
      { name: "Abdominales", category: 'FUERZA', bodyPart: 'CORE', notes: "No tires del cuello" },
      { name: "Russian twists", category: 'FUERZA', bodyPart: 'CORE', notes: "Controla la rotación" },
      { name: "Mountain climbers", category: 'FUERZA', bodyPart: 'CORE', notes: "Mantén la cadera estable" },
      
      // CARDIO
      { name: "Caminata rápida", category: 'CARDIO', bodyPart: 'CUERPO_COMPLETO', notes: "Mantén un ritmo constante" },
      { name: "Burpees", category: 'CARDIO', bodyPart: 'CUERPO_COMPLETO', notes: "Modifica si es necesario" },
      { name: "Jumping jacks", category: 'CARDIO', bodyPart: 'CUERPO_COMPLETO', notes: "Aterriza suave" },
      { name: "HIIT en bicicleta", category: 'CARDIO', bodyPart: 'CUERPO_COMPLETO', notes: "30 seg intenso, 30 seg suave" }
    ];
  }
}