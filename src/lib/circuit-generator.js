import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

class CircuitGenerator {
  constructor() {
    this.localExercises = null;
  }

  async loadLocalExercises() {
    if (!this.localExercises) {
      const fs = require('fs');
      const path = require('path');
      const dataPath = path.join(process.cwd(), 'src/data/ejercicios.json');
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      this.localExercises = data.ejercicios;
    }
    return this.localExercises;
  }

  // Generar circuitos HIIT usando Claude AI
  async generateHIITCircuits(userPreferences) {
    try {
      const exercises = await this.loadLocalExercises();
      
      // Filtrar ejercicios disponibles según preferencias
      const availableExercises = exercises.filter(exercise => {
        if (userPreferences.difficulty && userPreferences.difficulty !== 'todos') {
          return exercise.dificultad === userPreferences.difficulty;
        }
        if (userPreferences.excludeImplements && userPreferences.excludeImplements.length > 0) {
          return !userPreferences.excludeImplements.includes(exercise.implemento);
        }
        return true;
      });

      // Verificar si hay ejercicios unilaterales disponibles
      const unilateralExercises = availableExercises.filter(ex => ex.nombre.includes('1'));
      console.log('Ejercicios unilaterales disponibles:', unilateralExercises.length);
      console.log('Incluir unilaterales solicitado:', userPreferences.includeUnilateral);

      const prompt = `
Eres un entrenador personal especializado en entrenamientos HIIT. Necesitas crear 2 circuitos de 4 ejercicios cada uno usando SOLO los ejercicios disponibles.

FORMATO REQUERIDO:
- 2 circuitos de 4 ejercicios cada uno (8 ejercicios totales)
- Cada ejercicio: 45 segundos de trabajo + 15 segundos de descanso
- Alternar grupos musculares entre ejercicios para optimizar recuperación
- NO repetir ejercicios entre circuitos

PREFERENCIAS DEL USUARIO:
- Nivel: ${userPreferences.difficulty || 'intermedio'}
- Objetivo: ${userPreferences.goal || 'Acondicionamiento general'}
- Limitaciones: ${userPreferences.limitations || 'Ninguna'}
- Incluir ejercicios unilaterales: ${userPreferences.includeUnilateral ? 'SÍ (90s por ejercicio)' : 'NO (45s por ejercicio)'}
- Tiempo total disponible: ${userPreferences.totalTime || 16} minutos

EJERCICIOS DISPONIBLES (${availableExercises.length} opciones):
${availableExercises.map(ex => 
  `- ${ex.nombre} (${ex.grupoMuscular.join(', ')}, ${ex.implemento}, ${ex.dificultad})`
).join('\n')}

INSTRUCCIONES ESPECÍFICAS:
1. Selecciona exactamente 8 ejercicios diferentes (4 por circuito)
2. En cada circuito, alterna grupos musculares (ej: piernas → core → brazos → cardio)
3. Considera las limitaciones del usuario
4. Equilibra la intensidad entre ejercicios dentro de cada circuito
5. El primer circuito debe ser ligeramente menos intenso que el segundo
${userPreferences.includeUnilateral ? `
6. MANDATORIO: DEBES incluir al menos 1-2 ejercicios que terminen con "1" (unilaterales). Ejemplos de ejercicios unilaterales disponibles: "Estocada Atrás 1", "Peso Muerto Mancuernas 1 Pierna", "Puente Lateral 1", "Subida Banco Peso Corporal 1".
7. Para ejercicios unilaterales (que terminan en "1"): marca "isUnilateral": true
` : `
6. PROHIBIDO: NO incluyas ejercicios que terminen con "1" (unilaterales).
`}
8. IMPORTANTE: Los ejercicios que contienen "2" son ejercicios alternados donde se alterna de lado durante los 45s completos

ESTRUCTURA DE TIEMPO:
- Circuito 1: 4 ejercicios × (45s trabajo + 15s descanso) = 4 minutos
- Descanso entre circuitos: 2 minutos
- Circuito 2: 4 ejercicios × (45s trabajo + 15s descanso) = 4 minutos
- Enfriamiento: 2 minutos
- TOTAL: 12 minutos

NOTA SOBRE EJERCICIOS ESPECIALES:
${userPreferences.includeUnilateral ? `
- IMPORTANTE: El usuario QUIERE ejercicios unilaterales. DEBES incluir al menos 1-2 ejercicios unilaterales (que contengan "1" en el nombre).
- Ejercicios UNILATERALES (con "1"): 60 segundos totales (30s cada lado) + 15s descanso = 75s por ejercicio
- Marca estos ejercicios con "isUnilateral": true
` : `
- El usuario NO quiere ejercicios unilaterales. EVITA completamente ejercicios que contengan "1" en el nombre.
`}
- Ejercicios ALTERNADOS (con "2"): 45s alternando continuamente + 15s descanso = 60s por ejercicio  
- Ejercicios NORMALES (sin número): 45s + 15s descanso = 60s por ejercicio

${userPreferences.priorityMuscleGroups && userPreferences.priorityMuscleGroups.length > 0 ? `
GRUPOS MUSCULARES PRIORITARIOS:
El usuario quiere enfatizar: ${userPreferences.priorityMuscleGroups.join(', ')}
Asegúrate de incluir más ejercicios que trabajen estos grupos musculares.
` : ''}

Responde EXACTAMENTE en este formato JSON:
{
  "circuits": [
    {
      "name": "Circuito 1",
      "exercises": [
        {
          "name": "nombre exacto del ejercicio como aparece en la lista",
          "muscleGroups": ["grupo1", "grupo2"],
          "workTime": "45 segundos",
          "restTime": "15 segundos",
          "gifFile": "archivo.gif",
          "isUnilateral": false,
          "tips": "consejos específicos para este ejercicio"
        }
      ]
    },
    {
      "name": "Circuito 2", 
      "exercises": [
        {
          "name": "nombre exacto del ejercicio",
          "muscleGroups": ["grupo1", "grupo2"],
          "workTime": "45 segundos", 
          "restTime": "15 segundos",
          "gifFile": "archivo.gif",
          "isUnilateral": false,
          "tips": "consejos específicos"
        }
      ]
    }
  ],
  "timing": {
    "circuit1Duration": "4 minutos",
    "restBetween": "2 minutos", 
    "circuit2Duration": "4 minutos",
    "cooldown": "2 minutos",
    "totalTime": "12 minutos"
  },
  "instructions": [
    "Realiza cada ejercicio durante 45 segundos",
    "Descansa 15 segundos entre ejercicios",
    "Descansa 2 minutos entre circuitos",
    "Mantén buena forma técnica",
    "Hidrátate durante los descansos"
  ],
  "warmup": "Descripción del calentamiento recomendado (3-5 minutos)",
  "cooldown": "Descripción del enfriamiento y estiramientos (2-3 minutos)"
}`;

      const message = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 2500,
        messages: [{
          role: "user",
          content: prompt
        }]
      });

      let response = message.content[0].text;
      
      // Limpiar respuesta
      response = response.replace(/[\x00-\x1F\x7F]/g, '');
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        response = jsonMatch[0];
      }

      const circuitData = JSON.parse(response);
      
      // Enriquecer con datos locales (agregar rutas de GIF)
      circuitData.circuits.forEach(circuit => {
        circuit.exercises.forEach(exercise => {
          const localEx = availableExercises.find(ex => ex.nombre === exercise.name);
          if (localEx) {
            exercise.gifFile = localEx.archivo;
            exercise.gifPath = `/ejercicios/${localEx.archivo}`;
            exercise.difficulty = localEx.dificultad;
            exercise.equipment = localEx.implemento;
          }
          // Marcar como unilateral si el nombre contiene "1"
          exercise.isUnilateral = exercise.name.includes('1');
          // Marcar como alternado si el nombre contiene "2"
          exercise.isAlternating = exercise.name.includes('2');
        });
      });

      return circuitData;

    } catch (error) {
      console.error('Error generating HIIT circuits:', error);
      throw new Error('No se pudo generar los circuitos HIIT. Intenta nuevamente.');
    }
  }

  // Sustituir ejercicio en circuito
  async substituteCircuitExercise(originalExercise, circuitIndex, exerciseIndex, reason, userPreferences) {
    try {
      const exercises = await this.loadLocalExercises();
      
      // Filtrar ejercicios similares
      const similarExercises = exercises.filter(ex => 
        ex.grupoMuscular.some(group => originalExercise.muscleGroups.includes(group)) &&
        ex.nombre !== originalExercise.name &&
        ex.dificultad === userPreferences.difficulty
      );

      const prompt = `
Necesitas encontrar un sustituto para este ejercicio en un circuito HIIT:

EJERCICIO A SUSTITUIR: ${originalExercise.name}
GRUPOS MUSCULARES: ${originalExercise.muscleGroups.join(', ')}
RAZÓN: ${reason}
POSICIÓN: Circuito ${circuitIndex + 1}, Ejercicio ${exerciseIndex + 1}

CONSIDERACIONES:
- Debe trabajar grupos musculares similares
- Formato HIIT: 45 segundos trabajo + 15 segundos descanso
- Nivel: ${userPreferences.difficulty}
- Limitaciones: ${userPreferences.limitations || 'Ninguna'}

OPCIONES DISPONIBLES:
${similarExercises.slice(0, 10).map(ex => 
  `- ${ex.nombre} (${ex.grupoMuscular.join(', ')}, ${ex.dificultad})`
).join('\n')}

Responde en JSON:
{
  "substitute": {
    "name": "nombre exacto del ejercicio sustituto",
    "muscleGroups": ["grupo1", "grupo2"],
    "workTime": "45 segundos",
    "restTime": "15 segundos", 
    "reason": "por qué es una buena sustitución para HIIT"
  }
}`;

      const message = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 600,
        messages: [{
          role: "user",
          content: prompt
        }]
      });

      let response = message.content[0].text;
      response = response.replace(/[\x00-\x1F\x7F]/g, '');
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        response = jsonMatch[0];
      }

      const substituteData = JSON.parse(response);
      
      // Enriquecer con datos locales
      const localEx = exercises.find(ex => ex.nombre === substituteData.substitute.name);
      if (localEx) {
        substituteData.substitute.gifFile = localEx.archivo;
        substituteData.substitute.gifPath = `/ejercicios/${localEx.archivo}`;
        substituteData.substitute.difficulty = localEx.dificultad;
        substituteData.substitute.equipment = localEx.implemento;
      }

      return substituteData;

    } catch (error) {
      console.error('Error substituting circuit exercise:', error);
      throw new Error('No se pudo encontrar un ejercicio sustituto.');
    }
  }
}

export default CircuitGenerator;