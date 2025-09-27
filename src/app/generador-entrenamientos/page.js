'use client';

import { useState } from 'react';

export default function GeneradorEntrenamientos() {
  const [preferences, setPreferences] = useState({
    duration: 30,
    difficulty: 'Beginner',
    muscleGroups: [],
    daysPerWeek: 3,
    equipment: ['Body Weight'],
    limitations: '',
    goal: ''
  });

  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const muscleGroupOptions = [
    'Abdominals', 'Biceps', 'Calves', 'Chest', 'Forearms', 'Glutes',
    'Hamstrings', 'Lats', 'Lower Back', 'Middle Back', 'Neck', 'Quadriceps',
    'Shoulders', 'Traps', 'Triceps'
  ];

  const equipmentOptions = [
    'Body Weight', 'Barbell', 'Dumbbell', 'Cable', 'Machine', 'Kettlebell',
    'Resistance Bands', 'Medicine Ball', 'Stability Ball'
  ];

  const handleMuscleGroupChange = (group) => {
    setPreferences(prev => ({
      ...prev,
      muscleGroups: prev.muscleGroups.includes(group)
        ? prev.muscleGroups.filter(g => g !== group)
        : [...prev.muscleGroups, group]
    }));
  };

  const handleEquipmentChange = (equipment) => {
    setPreferences(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter(e => e !== equipment)
        : [...prev.equipment, equipment]
    }));
  };

  const generateWorkout = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      const data = await response.json();
      
      if (data.success) {
        setWorkout(data.workout);
      } else {
        setError(data.error || 'Error generando entrenamiento');
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
    }
    
    setLoading(false);
  };

  const substituteExercise = async (exercise, reason) => {
    try {
      const response = await fetch('/api/substitute-exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalExercise: exercise,
          reason,
          userPreferences: preferences
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Actualizar el ejercicio en el workout
        setWorkout(prev => ({
          ...prev,
          workout: {
            ...prev.workout,
            exercises: prev.workout.exercises.map(ex =>
              ex.name === exercise.name ? {
                ...ex,
                name: data.substitute.substitute.name,
                videoLink: data.substitute.substitute.videoLink,
                notes: `Sustituido: ${data.substitute.substitute.reason}`
              } : ex
            )
          }
        }));
      } else {
        alert('Error sustituyendo ejercicio: ' + (data.error || 'Error desconocido'));
      }
    } catch (err) {
      alert('Error de conexión al sustituir ejercicio');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Generador de Entrenamientos Inteligente
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Configura tu Entrenamiento
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Duración */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiempo Disponible (minutos)
              </label>
              <input
                type="number"
                value={preferences.duration || 30}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  duration: parseInt(e.target.value) || 30
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="15"
                max="120"
              />
            </div>

            {/* Nivel de Dificultad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de Dificultad
              </label>
              <select
                value={preferences.difficulty}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  difficulty: e.target.value
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Beginner">Principiante</option>
                <option value="Intermediate">Intermedio</option>
                <option value="Advanced">Avanzado</option>
              </select>
            </div>

            {/* Días por semana */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Días de Entrenamiento por Semana
              </label>
              <input
                type="number"
                value={preferences.daysPerWeek || 3}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  daysPerWeek: parseInt(e.target.value) || 3
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="7"
              />
            </div>

            {/* Objetivo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivo Principal
              </label>
              <input
                type="text"
                value={preferences.goal}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  goal: e.target.value
                }))}
                placeholder="Ej: Perder peso, ganar masa muscular, mejorar resistencia"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Grupos Musculares */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grupos Musculares a Trabajar
            </label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {muscleGroupOptions.map(group => (
                <label key={group} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.muscleGroups.includes(group)}
                    onChange={() => handleMuscleGroupChange(group)}
                    className="mr-2 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm">{group}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Equipamiento */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equipamiento Disponible
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {equipmentOptions.map(equipment => (
                <label key={equipment} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.equipment.includes(equipment)}
                    onChange={() => handleEquipmentChange(equipment)}
                    className="mr-2 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm">{equipment}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Limitaciones */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lesiones o Limitaciones
            </label>
            <textarea
              value={preferences.limitations}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                limitations: e.target.value
              }))}
              placeholder="Describe cualquier lesión o limitación que tengas"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>

          <button
            onClick={generateWorkout}
            disabled={loading}
            className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Generando Entrenamiento...' : 'Generar Entrenamiento'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Mostrar Workout Generado */}
        {workout && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Tu Entrenamiento Personalizado
            </h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Calentamiento</h3>
              <p className="text-gray-700 bg-blue-50 p-3 rounded">
                {workout.workout.warmup}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Ejercicios</h3>
              <div className="space-y-4">
                {workout.workout.exercises.map((exercise, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-lg">{exercise.name}</h4>
                      <div className="flex gap-2">
                        {exercise.videoLink && (
                          <a
                            href={exercise.videoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          >
                            Ver Video
                          </a>
                        )}
                        <button
                          onClick={() => {
                            const reason = prompt('¿Por qué quieres cambiar este ejercicio? (ej: lesión, no me gusta, etc.)');
                            if (reason) {
                              substituteExercise(exercise, reason);
                            }
                          }}
                          className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Cambiar
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">Grupo muscular: {exercise.muscleGroup}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Series:</span> {exercise.sets}
                      </div>
                      <div>
                        <span className="font-medium">Repeticiones:</span> {exercise.reps}
                      </div>
                      <div>
                        <span className="font-medium">Descanso:</span> {exercise.rest}
                      </div>
                    </div>
                    {exercise.notes && (
                      <p className="text-blue-600 text-sm mt-2 italic">{exercise.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Enfriamiento</h3>
              <p className="text-gray-700 bg-green-50 p-3 rounded">
                {workout.workout.cooldown}
              </p>
            </div>

            {workout.weeklyPlan && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Plan Semanal</h3>
                <p className="text-gray-700 bg-purple-50 p-3 rounded">
                  {workout.weeklyPlan.distribution}
                </p>
              </div>
            )}

            {workout.tips && workout.tips.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Consejos</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {workout.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}