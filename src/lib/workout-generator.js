import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

class WorkoutGenerator {
  constructor() {
    this.exercisesData = null;
  }

  async loadExercises() {
    if (!this.exercisesData) {
      const fs = require('fs');
      const path = require('path');
      const dataPath = path.join(process.cwd(), 'src/data/ejercicios-sheets.json');
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      this.exercisesData = data.exercises;
    }
    return this.exercisesData;
  }

  // Filtrar ejercicios por criterios básicos
  filterExercises(exercises, criteria) {
    return exercises.filter(exercise => {
      if (criteria.muscleGroups && criteria.muscleGroups.length > 0) {
        if (!criteria.muscleGroups.includes(exercise['Muscle Group'])) {
          return false;
        }
      }
      
      if (criteria.equipment && criteria.equipment.length > 0) {
        if (!criteria.equipment.includes(exercise['Equipment'])) {
          return false;
        }
      }
      
      if (criteria.difficulty) {
        if (exercise['Difficulty'] !== criteria.difficulty) {
          return false;
        }
      }
      
      return true;
    });
  }

  // Generar workout usando Claude AI
  async generateIntelligentWorkout(userPreferences) {
    try {
      const exercises = await this.loadExercises();
      
      // Obtener ejercicios que cumplen los criterios básicos
      const availableExercises = this.filterExercises(exercises, {
        muscleGroups: userPreferences.muscleGroups,
        equipment: userPreferences.equipment,
        difficulty: userPreferences.difficulty
      });

      const prompt = `
Eres un entrenador personal experto. Necesitas generar un plan de entrenamiento personalizado basado en los siguientes datos:

PREFERENCIAS DEL USUARIO:
- Tiempo disponible: ${userPreferences.duration} minutos
- Nivel: ${userPreferences.difficulty}
- Grupos musculares objetivo: ${userPreferences.muscleGroups?.join(', ') || 'Todos'}
- Días de entrenamiento por semana: ${userPreferences.daysPerWeek}
- Equipamiento disponible: ${userPreferences.equipment?.join(', ') || 'Peso corporal'}
- Lesiones o limitaciones: ${userPreferences.limitations || 'Ninguna'}
- Objetivo principal: ${userPreferences.goal || 'Fitness general'}

EJERCICIOS DISPONIBLES (${availableExercises.length} opciones):
${availableExercises.slice(0, 100).map(ex => 
  `- ${ex.Exercise} (${ex['Muscle Group']}, ${ex.Equipment}, ${ex.Difficulty}) - Link: ${ex['Link Hombre ES']}`
).join('\n')}

INSTRUCCIONES:
1. Selecciona entre 6-12 ejercicios apropiados para el tiempo disponible
2. Distribuye los ejercicios equilibradamente entre los grupos musculares solicitados
3. Considera las limitaciones mencionadas
4. Proporciona series, repeticiones y tiempo de descanso apropiados
5. Si hay ${userPreferences.daysPerWeek} días de entrenamiento, sugiere cómo distribuir los ejercicios
6. IMPORTANTE: Incluye el link del video para cada ejercicio seleccionado

Responde en formato JSON con esta estructura:
{
  "workout": {
    "exercises": [
      {
        "name": "nombre exacto del ejercicio como aparece en la base de datos",
        "muscleGroup": "grupo muscular",
        "sets": 3,
        "reps": "10-12",
        "rest": "60 segundos",
        "videoLink": "link del video del ejercicio",
        "notes": "notas especiales si las hay"
      }
    ],
    "totalDuration": "${userPreferences.duration}",
    "warmup": "descripción del calentamiento recomendado",
    "cooldown": "descripción del enfriamiento recomendado"
  },
  "weeklyPlan": {
    "distribution": "cómo distribuir los ejercicios en ${userPreferences.daysPerWeek} días"
  },
  "tips": ["consejo1", "consejo2", "consejo3"]
}`;

      const message = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 2000,
        messages: [{
          role: "user",
          content: prompt
        }]
      });

      let response = message.content[0].text;
      
      // Limpiar caracteres de control y espacios extra
      response = response.replace(/[\x00-\x1F\x7F]/g, '');
      
      // Extraer solo el JSON si hay texto adicional
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        response = jsonMatch[0];
      }
      
      return JSON.parse(response);

    } catch (error) {
      console.error('Error generating workout:', error);
      throw new Error('No se pudo generar el entrenamiento. Intenta nuevamente.');
    }
  }

  // Sustituir ejercicio usando Claude AI
  async substituteExercise(originalExercise, reason, userPreferences) {
    try {
      const exercises = await this.loadExercises();
      
      // Filtrar ejercicios similares
      const similarExercises = exercises.filter(ex => 
        ex['Muscle Group'] === originalExercise.muscleGroup &&
        ex['Difficulty'] === userPreferences.difficulty &&
        ex.Exercise !== originalExercise.name
      );

      const prompt = `
Eres un entrenador personal experto. Necesitas encontrar un ejercicio sustituto para:

EJERCICIO ORIGINAL: ${originalExercise.name}
GRUPO MUSCULAR: ${originalExercise.muscleGroup}
RAZÓN DE SUSTITUCIÓN: ${reason}

LIMITACIONES DEL USUARIO:
- Lesiones: ${userPreferences.limitations || 'Ninguna'}
- Equipamiento disponible: ${userPreferences.equipment?.join(', ') || 'Peso corporal'}
- Nivel: ${userPreferences.difficulty}

EJERCICIOS ALTERNATIVOS DISPONIBLES:
${similarExercises.slice(0, 20).map(ex => 
  `- ${ex.Exercise} (${ex.Equipment}) - Link: ${ex['Link Hombre ES']}`
).join('\n')}

Selecciona el mejor ejercicio sustituto y explica por qué es una buena alternativa.

Responde en formato JSON:
{
  "substitute": {
    "name": "nombre exacto del ejercicio sustituto como aparece en la base de datos",
    "muscleGroup": "grupo muscular",
    "equipment": "equipamiento necesario",
    "videoLink": "link del video del ejercicio sustituto",
    "reason": "por qué es una buena sustitución"
  }
}`;

      const message = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 500,
        messages: [{
          role: "user",
          content: prompt
        }]
      });

      let response = message.content[0].text;
      
      // Limpiar caracteres de control y espacios extra
      response = response.replace(/[\x00-\x1F\x7F]/g, '');
      
      // Extraer solo el JSON si hay texto adicional
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        response = jsonMatch[0];
      }
      
      return JSON.parse(response);

    } catch (error) {
      console.error('Error substituting exercise:', error);
      throw new Error('No se pudo encontrar un ejercicio sustituto.');
    }
  }

  // Optimizar rutina usando Claude AI
  async optimizeWorkout(currentWorkout, userFeedback) {
    try {
      const prompt = `
Eres un entrenador personal experto. Necesitas optimizar esta rutina basándote en el feedback del usuario:

RUTINA ACTUAL:
${JSON.stringify(currentWorkout, null, 2)}

FEEDBACK DEL USUARIO:
${userFeedback}

Proporciona mejoras específicas para la rutina, ajustando ejercicios, series, repeticiones o estructura según sea necesario.

Responde en formato JSON con la rutina optimizada:
{
  "optimizedWorkout": {
    "exercises": [...],
    "changes": ["cambio1", "cambio2"],
    "explanation": "explicación de los cambios realizados"
  }
}`;

      const message = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 1500,
        messages: [{
          role: "user",
          content: prompt
        }]
      });

      let response = message.content[0].text;
      
      // Limpiar caracteres de control y espacios extra
      response = response.replace(/[\x00-\x1F\x7F]/g, '');
      
      // Extraer solo el JSON si hay texto adicional
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        response = jsonMatch[0];
      }
      
      return JSON.parse(response);

    } catch (error) {
      console.error('Error optimizing workout:', error);
      throw new Error('No se pudo optimizar la rutina.');
    }
  }
}

export default WorkoutGenerator;