'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function CircuitosHIIT() {
  const [preferences, setPreferences] = useState({
    difficulty: 'intermedio',
    goal: '',
    limitations: '',
    excludeImplements: [],
    includeUnilateral: true,
    series: 3,
    timeAvailable: 20, // tiempo en minutos
    priorityMuscleGroups: [] // grupos musculares prioritarios
  });

  const [circuits, setCircuits] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTimer, setActiveTimer] = useState(null);
  
  // Estados para el modo entrenamiento guiado
  const [workoutMode, setWorkoutMode] = useState(false);
  const [currentCircuit, setCurrentCircuit] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentSeries, setCurrentSeries] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [workoutTimer, setWorkoutTimer] = useState(null);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);
  const [currentSide, setCurrentSide] = useState('derecho'); // Para ejercicios unilaterales
  const [isChangingSide, setIsChangingSide] = useState(false); // Pausa entre lados
  const [isLongRest, setIsLongRest] = useState(false); // Pausa entre series o circuitos

  // Calcular tiempo real del entrenamiento
  const calculateRealWorkoutTime = () => {
    if (!circuits || !circuits.circuits) return 0;
    
    let totalSeconds = 0;
    const series = preferences.series || 3;
    
    circuits.circuits.forEach(circuit => {
      // Por cada circuito, hacer todas las series
      for (let serie = 1; serie <= series; serie++) {
        circuit.exercises.forEach(exercise => {
          // Tiempo de trabajo: 60s si es unilateral (30s cada lado), 45s si no
          const isUnilateral = exercise.name && exercise.name.includes('1');
          // Unilaterales: 60s (30s cada lado), Alternadas y Normales: 45s
          totalSeconds += isUnilateral ? 60 : 45;
          // Tiempo de descanso: siempre 15s
          totalSeconds += 15;
        });
        
        // Descanso entre series del mismo circuito: 60s
        if (serie < series) {
          totalSeconds += 60;
        }
      }
      
      // Descanso entre circuitos: 2 minutos
      if (circuits.circuits.indexOf(circuit) < circuits.circuits.length - 1) {
        totalSeconds += 120;
      }
    });
    
    // Calentamiento y enfriamiento (estimado)
    totalSeconds += 300; // 5 minutos total
    
    return Math.ceil(totalSeconds / 60); // convertir a minutos
  };

  // Limpiar timer al desmontar componente
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  const generateCircuits = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-circuits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      const data = await response.json();
      
      if (data.success) {
        setCircuits(data.circuits);
      } else {
        setError(data.error || 'Error generando circuitos');
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
    }
    
    setLoading(false);
  };

  const substituteExercise = async (exercise, circuitIndex, exerciseIndex, reason) => {
    try {
      const response = await fetch('/api/substitute-circuit-exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalExercise: exercise,
          circuitIndex,
          exerciseIndex, 
          reason,
          userPreferences: preferences
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Actualizar el ejercicio en el circuito
        setCircuits(prev => {
          const newCircuits = { ...prev };
          newCircuits.circuits[circuitIndex].exercises[exerciseIndex] = {
            ...data.substitute.substitute,
            tips: `Sustituido: ${data.substitute.substitute.reason}`
          };
          return newCircuits;
        });
      } else {
        alert('Error sustituyendo ejercicio: ' + (data.error || 'Error desconocido'));
      }
    } catch (err) {
      alert('Error de conexión al sustituir ejercicio');
    }
  };

  const startTimer = (duration, exerciseName) => {
    setActiveTimer({ duration, remaining: duration, exercise: exerciseName });
    
    const interval = setInterval(() => {
      setActiveTimer(prev => {
        if (!prev || prev.remaining <= 1) {
          clearInterval(interval);
          return null;
        }
        return { ...prev, remaining: prev.remaining - 1 };
      });
    }, 1000);
  };

  // Limpiar timer anterior si existe
  const clearWorkoutTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  // Iniciar modo entrenamiento guiado
  const startGuidedWorkout = () => {
    if (!circuits || !circuits.circuits || !circuits.circuits[0] || !circuits.circuits[0].exercises || !circuits.circuits[0].exercises[0]) return;
    
    clearWorkoutTimer();
    setWorkoutMode(true);
    setCurrentCircuit(0);
    setCurrentExercise(0);
    setCurrentSeries(1);
    setCurrentSide('derecho');
    setIsChangingSide(false);
    setIsResting(false);
    setIsLongRest(false);
    setWorkoutCompleted(false);
    
    // Usar 30s si es unilateral, 45s si no
    const firstEx = circuits.circuits[0].exercises[0];
    const isUnilateral = firstEx && firstEx.name && firstEx.name.includes('1');
    const workTime = isUnilateral ? 30 : 45;
    setWorkoutTimer({ remaining: workTime });
    startWorkoutTimer(workTime, false); // false = no es período de descanso
  };

  // Timer para el modo entrenamiento - arreglado
  const startWorkoutTimer = (duration, isRestPeriod) => {
    clearWorkoutTimer();
    
    let timeLeft = duration;
    setWorkoutTimer({ remaining: timeLeft });
    
    const interval = setInterval(() => {
      timeLeft--;
      setWorkoutTimer({ remaining: timeLeft });
      
      if (timeLeft <= 0) {
        clearInterval(interval);
        setTimerInterval(null);
        
        // Manejar qué hacer después del timer
        if (!isRestPeriod) {
          // Terminó ejercicio, verificar si estamos EN un ejercicio unilateral
          const currentEx = circuits.circuits[currentCircuit].exercises[currentExercise];
          const isCurrentlyUnilateral = currentEx.name.includes('1');
          
          // Solo aplicar lógica unilateral si ESTAMOS en un ejercicio unilateral
          if (isCurrentlyUnilateral && currentSide === 'derecho') {
            // Pausa de 10s entre lados del ejercicio unilateral actual
            setIsChangingSide(true);
            setIsResting(true);
            setWorkoutTimer({ remaining: 10 });
            startWorkoutTimer(10, true); // true = período de descanso
          } else {
            // Cambiar a descanso normal (ejercicio normal o terminó lado izquierdo de unilateral)
            if (isCurrentlyUnilateral) setCurrentSide('derecho'); // Reset para próximo ejercicio
            
            // Verificar si es el último ejercicio del circuito
            const totalExercisesInCircuit = circuits.circuits[currentCircuit].exercises.length;
            const totalSeries = preferences.series || 3;
            const isLastExerciseInCircuit = (currentExercise === totalExercisesInCircuit - 1);
            
            if (isLastExerciseInCircuit && currentSeries < totalSeries) {
              // Último ejercicio del circuito pero no la última serie -> pausa entre series (1 minuto)
              setCurrentSeries(prev => prev + 1);
              setCurrentExercise(0);
              setIsResting(true);
              setIsLongRest(true);
              setWorkoutTimer({ remaining: 60 });
              startWorkoutTimer(60, true);
            } else if (isLastExerciseInCircuit && currentSeries === totalSeries && currentCircuit + 1 < circuits.circuits.length) {
              // Último ejercicio de la última serie -> pausa entre circuitos (2 minutos)
              setCurrentCircuit(prev => prev + 1);
              setCurrentExercise(0);
              setCurrentSeries(1);
              setIsResting(true);
              setIsLongRest(true);
              setWorkoutTimer({ remaining: 120 });
              startWorkoutTimer(120, true);
            } else if (isLastExerciseInCircuit && currentSeries === totalSeries && currentCircuit + 1 >= circuits.circuits.length) {
              // Entrenamiento completado
              clearWorkoutTimer();
              setWorkoutCompleted(true);
              setWorkoutMode(false);
            } else {
              // Ejercicio normal dentro del circuito -> descanso normal
              setIsResting(true);
              setIsLongRest(false);
              setWorkoutTimer({ remaining: 15 });
              startWorkoutTimer(15, true);
            }
          }
        } else {
          // Terminó descanso
          if (isChangingSide) {
            // Cambiar a lado izquierdo después de la pausa
            setIsChangingSide(false);
            setIsResting(false);
            setCurrentSide('izquierdo');
            setWorkoutTimer({ remaining: 30 });
            startWorkoutTimer(30, false);
          } else {
            // Descanso normal, verificar qué tipo de descanso era
            if (isLongRest) {
              // Terminó pausa larga (entre series o circuitos) -> iniciar primer ejercicio
              setIsResting(false);
              setIsLongRest(false);
              const firstEx = circuits.circuits[currentCircuit].exercises[0];
              const isUnilateral = firstEx && firstEx.name && firstEx.name.includes('1');
              const workTime = isUnilateral ? 30 : 45;
              setCurrentSide('derecho');
              setWorkoutTimer({ remaining: workTime });
              startWorkoutTimer(workTime, false);
            } else {
              // Descanso normal (15s) -> avanzar al siguiente ejercicio
              setIsResting(false);
              nextExercise();
            }
          }
        }
      }
    }, 1000);
    
    setTimerInterval(interval);
  };

  // Avanzar al siguiente ejercicio/serie - con series
  const nextExercise = () => {
    if (!circuits || !circuits.circuits || !circuits.circuits[currentCircuit] || !circuits.circuits[currentCircuit].exercises) return;
    
    const totalExercisesInCircuit = circuits.circuits[currentCircuit].exercises.length;
    const totalSeries = preferences.series || 3;
    
    if (currentExercise + 1 < totalExercisesInCircuit) {
      // Siguiente ejercicio en la misma serie
      setCurrentExercise(prev => prev + 1);
      setCurrentSide('derecho');
      const nextEx = circuits.circuits[currentCircuit].exercises[currentExercise + 1];
      const isUnilateral = nextEx && nextEx.name && nextEx.name.includes('1');
      const workTime = isUnilateral ? 30 : 45;
      setWorkoutTimer({ remaining: workTime });
      startWorkoutTimer(workTime, false);
    } else {
      // Si llegamos aquí desde nextExercise(), significa que terminó el último ejercicio
      // La lógica de siguiente serie/circuito se maneja en startWorkoutTimer automáticamente
      // Esto no debería ejecutarse en flujo normal
      console.log('nextExercise: Llegó al final inesperadamente');
    }
  };

  // Saltar descanso y avanzar
  const skipRest = () => {
    if (isResting && timerInterval) {
      clearWorkoutTimer();
      if (isChangingSide) {
        // Si está en pausa de cambio de lado, cambiar a izquierdo
        setIsChangingSide(false);
        setCurrentSide('izquierdo');
        setWorkoutTimer({ remaining: 30 });
        startWorkoutTimer(30, false);
      } else {
        // Descanso normal, avanzar ejercicio
        setIsResting(false);
        nextExercise();
      }
    }
  };

  // Avanzar manualmente al siguiente paso (respeta la secuencia natural)
  const goToNextExercise = () => {
    if (!circuits || !circuits.circuits || !circuits.circuits[currentCircuit] || !circuits.circuits[currentCircuit].exercises) return;
    
    clearWorkoutTimer();
    
    const currentEx = circuits.circuits[currentCircuit].exercises[currentExercise];
    if (!currentEx || !currentEx.name) return;
    
    const isUnilateral = currentEx.name.includes('1');
    
    // LÓGICA SIMPLE: Seguir la secuencia natural paso a paso
    if (!isResting) {
      // Estamos en un ejercicio, ir al siguiente paso natural
      if (isUnilateral && currentSide === 'derecho') {
        // Ejercicio unilateral lado derecho -> pausa para cambio de lado
        setIsChangingSide(true);
        setIsResting(true);
        setWorkoutTimer({ remaining: 10 });
        startWorkoutTimer(10, true);
        return;
      }
      
      if (isUnilateral && currentSide === 'izquierdo') {
        // Ejercicio unilateral lado izquierdo -> verificar si es el último del circuito
        setCurrentSide('derecho'); // Reset para próximo ejercicio
        
        const totalExercisesInCircuit = circuits.circuits[currentCircuit].exercises.length;
        const totalSeries = preferences.series || 3;
        const isLastExerciseInCircuit = (currentExercise === totalExercisesInCircuit - 1);
        
        if (isLastExerciseInCircuit && currentSeries < totalSeries) {
          // Último ejercicio del circuito pero no la última serie -> pausa entre series (1 minuto)
          setCurrentSeries(prev => prev + 1);
          setCurrentExercise(0);
          setIsResting(true);
          setIsLongRest(true);
          setWorkoutTimer({ remaining: 60 });
          startWorkoutTimer(60, true);
        } else if (isLastExerciseInCircuit && currentSeries === totalSeries && currentCircuit + 1 < circuits.circuits.length) {
          // Último ejercicio del último circuito de la última serie -> pausa entre circuitos (2 minutos)
          setCurrentCircuit(prev => prev + 1);
          setCurrentExercise(0);
          setCurrentSeries(1);
          setIsResting(true);
          setIsLongRest(true);
          setWorkoutTimer({ remaining: 120 });
          startWorkoutTimer(120, true);
        } else if (isLastExerciseInCircuit && currentSeries === totalSeries && currentCircuit + 1 >= circuits.circuits.length) {
          // Entrenamiento completado
          clearWorkoutTimer();
          setWorkoutCompleted(true);
          setWorkoutMode(false);
        } else {
          // Ejercicio unilateral normal dentro del circuito -> descanso normal
          setIsResting(true);
          setIsLongRest(false);
          setWorkoutTimer({ remaining: 15 });
          startWorkoutTimer(15, true);
        }
        return;
      }
      
      // Ejercicio normal -> verificar si es el último del circuito
      const totalExercisesInCircuit = circuits.circuits[currentCircuit].exercises.length;
      const totalSeries = preferences.series || 3;
      const isLastExerciseInCircuit = (currentExercise === totalExercisesInCircuit - 1);
      
      if (isLastExerciseInCircuit && currentSeries < totalSeries) {
        // Último ejercicio del circuito pero no la última serie -> pausa entre series (1 minuto)
        setCurrentSeries(prev => prev + 1);
        setCurrentExercise(0);
        setIsResting(true);
        setWorkoutTimer({ remaining: 60 });
        startWorkoutTimer(60, true);
      } else if (isLastExerciseInCircuit && currentSeries === totalSeries && currentCircuit + 1 < circuits.circuits.length) {
        // Último ejercicio del último circuito de la última serie -> pausa entre circuitos (2 minutos)
        setCurrentCircuit(prev => prev + 1);
        setCurrentExercise(0);
        setCurrentSeries(1);
        setIsResting(true);
        setWorkoutTimer({ remaining: 120 });
        startWorkoutTimer(120, true);
      } else if (isLastExerciseInCircuit && currentSeries === totalSeries && currentCircuit + 1 >= circuits.circuits.length) {
        // Entrenamiento completado
        clearWorkoutTimer();
        setWorkoutCompleted(true);
        setWorkoutMode(false);
      } else {
        // Ejercicio normal dentro del circuito -> descanso normal
        setIsResting(true);
        setWorkoutTimer({ remaining: 15 });
        startWorkoutTimer(15, true);
      }
      return;
    }
    
    // Estamos en descanso, ir al siguiente paso
    if (isChangingSide) {
      // Pausa de cambio de lado -> lado izquierdo del mismo ejercicio
      setIsChangingSide(false);
      setIsResting(false);
      setCurrentSide('izquierdo');
      setWorkoutTimer({ remaining: 30 });
      startWorkoutTimer(30, false);
      return;
    }
    
    // Descanso normal -> siguiente ejercicio/serie/circuito
    setIsResting(false);
    setIsChangingSide(false);
    setCurrentSide('derecho');
    
    const totalExercisesInCircuit = circuits.circuits[currentCircuit].exercises.length;
    const totalSeries = preferences.series || 3;
    
    if (currentExercise + 1 < totalExercisesInCircuit) {
      // Siguiente ejercicio en la misma serie
      setCurrentExercise(prev => prev + 1);
      const nextEx = circuits.circuits[currentCircuit].exercises[currentExercise + 1];
      const nextIsUnilateral = nextEx && nextEx.name && nextEx.name.includes('1');
      const workTime = nextIsUnilateral ? 30 : 45;
      setWorkoutTimer({ remaining: workTime });
      startWorkoutTimer(workTime, false);
    } else if (currentSeries < totalSeries) {
      // Siguiente serie del mismo circuito - descanso entre series
      setCurrentSeries(prev => prev + 1);
      setCurrentExercise(0);
      setIsResting(true);
      setWorkoutTimer({ remaining: 60 });
      startWorkoutTimer(60, true);
    } else if (currentCircuit + 1 < circuits.circuits.length) {
      // Siguiente circuito - descanso entre circuitos
      setCurrentCircuit(prev => prev + 1);
      setCurrentExercise(0);
      setCurrentSeries(1);
      setIsResting(true);
      setWorkoutTimer({ remaining: 120 });
      startWorkoutTimer(120, true);
    } else {
      // Entrenamiento completado
      clearWorkoutTimer();
      setWorkoutCompleted(true);
      setWorkoutMode(false);
    }
  };

  // Retroceder al paso anterior (respeta la secuencia natural hacia atrás)
  const goToPreviousExercise = () => {
    if (!circuits || !circuits.circuits || !circuits.circuits[currentCircuit] || !circuits.circuits[currentCircuit].exercises) return;
    
    clearWorkoutTimer();
    
    const currentEx = circuits.circuits[currentCircuit].exercises[currentExercise];
    if (!currentEx || !currentEx.name) return;
    
    const isUnilateral = currentEx.name.includes('1');
    
    // LÓGICA SIMPLE: Retroceder paso a paso en la secuencia natural
    if (isResting) {
      // Estamos en descanso, retroceder al paso anterior
      if (isChangingSide) {
        // Pausa de cambio de lado -> lado derecho del mismo ejercicio
        setIsChangingSide(false);
        setIsResting(false);
        setCurrentSide('derecho');
        setWorkoutTimer({ remaining: 30 });
        startWorkoutTimer(30, false);
        return;
      }
      
      // Descanso normal -> verificar si el ejercicio actual es unilateral
      if (isUnilateral) {
        // Descanso de unilateral -> lado izquierdo del mismo ejercicio
        setIsResting(false);
        setCurrentSide('izquierdo');
        setWorkoutTimer({ remaining: 30 });
        startWorkoutTimer(30, false);
        return;
      }
      
      // Descanso de ejercicio normal -> ejercicio actual
      setIsResting(false);
      setWorkoutTimer({ remaining: 45 });
      startWorkoutTimer(45, false);
      return;
    }
    
    // Estamos en ejercicio, retroceder
    if (isUnilateral && currentSide === 'izquierdo') {
      // Lado izquierdo de unilateral -> pausa de cambio de lado
      setIsChangingSide(true);
      setIsResting(true);
      setWorkoutTimer({ remaining: 10 });
      startWorkoutTimer(10, true);
      return;
    }
    
    // Lado derecho de unilateral O ejercicio normal -> ir al ejercicio/descanso anterior
    setIsResting(false);
    setIsChangingSide(false);
    setCurrentSide('derecho');
    
    const totalSeries = preferences.series || 3;
    
    if (currentExercise > 0) {
      // Hay ejercicio anterior en la misma serie -> ir a su descanso
      setCurrentExercise(prev => prev - 1);
      setIsResting(true);
      setWorkoutTimer({ remaining: 15 });
      startWorkoutTimer(15, true);
    } else if (currentSeries > 1) {
      // Serie anterior del mismo circuito -> último ejercicio de la serie anterior (su descanso)
      const lastExerciseIndex = circuits.circuits[currentCircuit].exercises.length - 1;
      setCurrentSeries(prev => prev - 1);
      setCurrentExercise(lastExerciseIndex);
      setIsResting(true);
      setWorkoutTimer({ remaining: 15 });
      startWorkoutTimer(15, true);
    } else if (currentCircuit > 0) {
      // Circuito anterior -> último ejercicio de la última serie (su descanso)
      const prevCircuitLength = circuits.circuits[currentCircuit - 1].exercises.length;
      setCurrentCircuit(prev => prev - 1);
      setCurrentExercise(prevCircuitLength - 1);
      setCurrentSeries(totalSeries);
      setIsResting(true);
      setWorkoutTimer({ remaining: 15 });
      startWorkoutTimer(15, true);
    }
    // Si no hay más ejercicios anteriores, no hacer nada (estamos al principio)
  };

  // Verificar si se puede ir al anterior
  const canGoPrevious = () => {
    // Si hay ejercicios, circuitos o series anteriores
    if (currentCircuit > 0 || currentSeries > 1 || currentExercise > 0) return true;
    
    // Si estamos en el primer ejercicio pero en una fase posterior de unilateral
    const currentEx = circuits?.circuits?.[currentCircuit]?.exercises?.[currentExercise];
    if (currentEx?.name.includes('1')) {
      return isResting || currentSide === 'izquierdo';
    }
    
    return false;
  };

  // Verificar si se puede ir al siguiente
  const canGoNext = () => {
    if (!circuits || !circuits.circuits) return false;
    
    const totalExercisesInCurrentCircuit = circuits.circuits[currentCircuit].exercises.length;
    const totalSeries = preferences.series || 3;
    const isLastExerciseInSeries = currentExercise === totalExercisesInCurrentCircuit - 1;
    const isLastSeries = currentSeries === totalSeries;
    const isLastCircuit = currentCircuit === circuits.circuits.length - 1;
    
    // Si no estamos en el último ejercicio de todo, siempre se puede avanzar
    if (!(isLastExerciseInSeries && isLastSeries && isLastCircuit)) return true;
    
    // Si estamos en el último ejercicio pero es unilateral, verificar fases
    const currentEx = circuits.circuits[currentCircuit].exercises[currentExercise];
    if (currentEx.name.includes('1')) {
      // Se puede avanzar si no estamos en el descanso final
      return !isResting || isChangingSide;
    }
    
    return false;
  };

  // Salir del modo entrenamiento
  const exitWorkout = () => {
    clearWorkoutTimer();
    setWorkoutMode(false);
    setWorkoutTimer(null);
    setCurrentCircuit(0);
    setCurrentExercise(0);
    setCurrentSeries(1);
    setCurrentSide('derecho');
    setIsChangingSide(false);
    setIsResting(false);
    setIsLongRest(false);
    setWorkoutCompleted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Circuitos HIIT 🔥
          </h1>
          <p className="text-xl text-gray-600">
            4 ejercicios c/u • 45s trabajo + 15s descanso
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Configura tu Entrenamiento HIIT
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tiempo Disponible */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiempo Disponible para Entrenar
              </label>
              <select
                value={preferences.timeAvailable}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  timeAvailable: parseInt(e.target.value),
                  // Ajustar automáticamente unilaterales según el tiempo
                  includeUnilateral: parseInt(e.target.value) >= 25
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
              >
                <option value={15}>15 minutos (rápido)</option>
                <option value={20}>20 minutos (estándar)</option>
                <option value={25}>25 minutos (completo)</option>
                <option value={30}>30 minutos (intenso)</option>
              </select>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
              >
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>

            {/* Número de Series */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Series por Circuito
              </label>
              <select
                value={preferences.series}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  series: parseInt(e.target.value)
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
              >
                <option value={2}>2 series</option>
                <option value={3}>3 series (recomendado)</option>
                <option value={4}>4 series</option>
              </select>
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
                placeholder="Ej: Quemar grasa, mejorar resistencia, tonificar"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
              />
            </div>

            {/* Limitaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lesiones o Limitaciones
              </label>
              <textarea
                value={preferences.limitations}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  limitations: e.target.value
                }))}
                placeholder="Ej: problemas de rodilla, evitar saltos"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                rows="2"
              />
            </div>
          </div>

          {/* Grupos Musculares Prioritarios */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Grupos Musculares a Enfatizar (opcional)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['Piernas', 'Glúteos', 'Core/Abdomen', 'Brazos', 'Espalda', 'Pecho', 'Hombros', 'Cardio'].map(group => (
                <label key={group} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.priorityMuscleGroups.includes(group)}
                    onChange={(e) => {
                      setPreferences(prev => ({
                        ...prev,
                        priorityMuscleGroups: e.target.checked
                          ? [...prev.priorityMuscleGroups, group]
                          : prev.priorityMuscleGroups.filter(g => g !== group)
                      }));
                    }}
                    className="mr-2 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm">{group}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Selecciona los grupos que quieres trabajar más intensamente
            </p>
          </div>

          {/* Opción de ejercicios unilaterales */}
          <div className="mt-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeUnilateral"
                checked={preferences.includeUnilateral}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  includeUnilateral: e.target.checked
                }))}
                className="mr-3 text-orange-500 focus:ring-orange-500 h-5 w-5"
              />
              <label htmlFor="includeUnilateral" className="text-sm font-medium text-gray-700">
                Incluir ejercicios unilaterales (30s por cada lado = 60s total)
                {preferences.timeAvailable < 25 && (
                  <span className="text-orange-600 font-semibold"> - Recomendado para 25+ min</span>
                )}
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-8">
              {preferences.timeAvailable >= 25
                ? "Los ejercicios unilaterales ofrecen mayor equilibrio muscular y trabajan cada lado independientemente"
                : "Para entrenamientos cortos, recomendamos ejercicios bilaterales para maximizar el tiempo"
              }
            </p>
          </div>

          {/* Información de tiempo estimado */}
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">📊 Tu Entrenamiento:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-blue-700">Tiempo seleccionado</div>
                <div className="text-lg font-semibold">{preferences.timeAvailable} min</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-700">Circuitos</div>
                <div className="text-lg font-semibold">2 circuitos</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-700">Series</div>
                <div className="text-lg font-semibold">{preferences.series} por circuito</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-orange-700">Ejercicios</div>
                <div className="text-lg font-semibold">8 total (4x2)</div>
              </div>
            </div>
            {preferences.priorityMuscleGroups.length > 0 && (
              <div className="mt-3 p-2 bg-yellow-100 rounded border border-yellow-300">
                <span className="font-medium text-yellow-800">Enfoque: </span>
                <span className="text-yellow-700">{preferences.priorityMuscleGroups.join(', ')}</span>
              </div>
            )}
          </div>

          <button
            onClick={generateCircuits}
            disabled={loading}
            className="mt-6 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-md hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            {loading ? 'Generando Circuitos...' : `🔥 Generar Circuitos HIIT (${preferences.timeAvailable} min)`}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Timer Activo */}
        {activeTimer && (
          <div className="fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50">
            <div className="text-center">
              <div className="text-3xl font-bold">{activeTimer.remaining}</div>
              <div className="text-sm">{activeTimer.exercise}</div>
            </div>
          </div>
        )}

        {/* MODO ENTRENAMIENTO GUIADO */}
        {workoutMode && circuits && (
          <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 max-w-2xl w-full text-center text-white">
              {!workoutCompleted ? (
                <>
                  {/* Header del entrenamiento */}
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-2">
                      {circuits.circuits[currentCircuit].name} - Serie {currentSeries}/{preferences.series || 3}
                    </h2>
                    <p className="text-lg text-gray-300 mb-2">
                      Ejercicio {currentExercise + 1} de {circuits.circuits[currentCircuit].exercises.length} • Serie {currentSeries} de {preferences.series || 3}
                    </p>
                    
                    {/* Barra de progreso */}
                    <div className="bg-gray-700 rounded-full h-2 mb-2">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(() => {
                            const totalSeries = preferences.series || 3;
                            const exercisesPerCircuit = 4;
                            const currentProgress = (currentCircuit * totalSeries * exercisesPerCircuit) + ((currentSeries - 1) * exercisesPerCircuit) + (currentExercise + 1);
                            const totalExercises = circuits.circuits.length * totalSeries * exercisesPerCircuit;
                            return (currentProgress / totalExercises) * 100;
                          })()}%`
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400">
                      Progreso total: {(() => {
                        const totalSeries = preferences.series || 3;
                        const exercisesPerCircuit = 4;
                        const currentProgress = (currentCircuit * totalSeries * exercisesPerCircuit) + ((currentSeries - 1) * exercisesPerCircuit) + (currentExercise + 1);
                        return currentProgress;
                      })()} de {circuits.circuits.length * (preferences.series || 3) * 4} ejercicios totales
                    </p>
                  </div>

                  {!isResting && circuits.circuits[currentCircuit]?.exercises?.[currentExercise] ? (
                    // MODO EJERCICIO
                    <div>
                      <div className="mb-6">
                        <h1 className="text-4xl font-bold text-orange-400 mb-2">
                          {circuits.circuits[currentCircuit].exercises[currentExercise].name}
                          {circuits.circuits[currentCircuit].exercises[currentExercise].name.includes('1') && !isChangingSide && (
                            <span className={currentSide === 'izquierdo' ? 'text-cyan-300' : 'text-orange-400'}>
                              {` - Lado ${currentSide.charAt(0).toUpperCase() + currentSide.slice(1)}`}
                            </span>
                          )}
                        </h1>
                        
                        {circuits.circuits[currentCircuit].exercises[currentExercise].name.includes('1') && (
                          <div className="bg-yellow-600 text-black px-4 py-2 rounded-full text-lg font-bold mb-4">
                            ⚡ Ejercicio Unilateral - 30s por lado
                          </div>
                        )}
                        
                        {circuits.circuits[currentCircuit].exercises[currentExercise].name.includes('2') && (
                          <div className="bg-purple-600 text-white px-4 py-2 rounded-full text-lg font-bold mb-4">
                            🔄 Ejercicio Alternado - Cambia de lado continuamente
                          </div>
                        )}
                        
                        {circuits.circuits[currentCircuit].exercises[currentExercise].gifPath && (
                          <div className="bg-gray-800 rounded-2xl p-4 mb-6">
                            <Image
                              src={circuits.circuits[currentCircuit].exercises[currentExercise].gifPath}
                              alt={circuits.circuits[currentCircuit].exercises[currentExercise].name}
                              width={400}
                              height={300}
                              className="w-full h-64 object-contain rounded-xl"
                              unoptimized
                            />
                          </div>
                        )}

                        <div className="text-8xl font-bold text-green-400 mb-4">
                          {workoutTimer?.remaining || 45}
                        </div>
                        
                        <div className="text-2xl font-semibold text-green-300 mb-2">
                          ¡TRABAJA! 💪
                        </div>
                        
                        {circuits.circuits[currentCircuit].exercises[currentExercise].tips && (
                          <p className="text-gray-300 text-lg mb-4">
                            💡 {circuits.circuits[currentCircuit].exercises[currentExercise].tips}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    // MODO DESCANSO
                    <div>
                      <div className="mb-6">
                        <h1 className="text-4xl font-bold text-blue-400 mb-4">
                          {isChangingSide ? 'Cambio de Lado' : 
                           workoutTimer?.remaining > 60 ? 'Descanso entre circuitos' : 'Descanso'}
                        </h1>
                        
                        {/* Timer grande */}
                        <div className="text-8xl font-bold text-blue-400 mb-4">
                          {workoutTimer?.remaining || 15}
                        </div>
                        
                        <div className="text-2xl font-semibold text-blue-300 mb-6">
                          {isChangingSide ? 'Prepárate para cambiar al LADO IZQUIERDO 🔄' : 'Relájate y respira 😌'}
                        </div>
                        
                        {workoutTimer?.remaining <= 60 && !isChangingSide && (
                          <p className="text-gray-300 text-lg mb-4">
                            Siguiente: {(() => {
                              const totalSeries = preferences.series || 3;
                              const totalExercisesInCircuit = circuits.circuits[currentCircuit].exercises.length;
                              
                              if (currentExercise + 1 < totalExercisesInCircuit) {
                                return circuits.circuits[currentCircuit].exercises[currentExercise + 1].name;
                              } else if (currentSeries < totalSeries) {
                                return `${circuits.circuits[currentCircuit].exercises[0].name} (Serie ${currentSeries + 1})`;
                              } else if (currentCircuit + 1 < circuits.circuits.length) {
                                return `${circuits.circuits[currentCircuit + 1].exercises[0].name} (${circuits.circuits[currentCircuit + 1].name})`;
                              } else {
                                return 'Entrenamiento completado';
                              }
                            })()}
                          </p>
                        )}
                        
                        {isChangingSide && (
                          <div className="bg-cyan-600 text-white px-6 py-3 rounded-full text-xl font-bold mb-4 animate-pulse">
                            ➡️ CAMBIAR A LADO IZQUIERDO ⬅️
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Botones de navegación y control */}
                  <div className="flex justify-center gap-4 mb-4">
                    <button
                      onClick={goToPreviousExercise}
                      disabled={!canGoPrevious()}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-full transition-all disabled:cursor-not-allowed"
                    >
                      ⬅️ Anterior
                    </button>
                    
                    {isResting ? (
                      <button
                        onClick={skipRest}
                        className={`${isChangingSide ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-black font-bold py-2 px-4 rounded-full transition-all`}
                      >
                        {isChangingSide ? 'Cambiar ahora ➡️' : 'Saltar descanso ⏭️'}
                      </button>
                    ) : (
                      <button
                        onClick={goToNextExercise}
                        disabled={!canGoNext()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-full transition-all disabled:cursor-not-allowed"
                      >
                        Siguiente ➡️
                      </button>
                    )}
                  </div>
                  
                  {/* Botón salir */}
                  <button
                    onClick={exitWorkout}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition-all"
                  >
                    Salir ❌
                  </button>
                </>
              ) : (
                // ENTRENAMIENTO COMPLETADO
                <div>
                  <h1 className="text-5xl font-bold text-green-400 mb-4">
                    ¡Entrenamiento Completado! 🎉
                  </h1>
                  <p className="text-xl text-gray-300 mb-6">
                    ¡Excelente trabajo! Has completado tu entrenamiento HIIT.
                  </p>
                  <button
                    onClick={() => setWorkoutCompleted(false)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full text-lg transition-all"
                  >
                    Cerrar 👍
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mostrar Circuitos Generados */}
        {circuits && !workoutMode && (
          <div className="space-y-8">
            {/* Información General */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Tu Entrenamiento HIIT Personalizado
                </h2>
                <button
                  onClick={startGuidedWorkout}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  🚀 Iniciar Entrenamiento
                </button>
              </div>
              
              {/* Calentamiento */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2 text-orange-600">🔥 Calentamiento (3-5 min)</h3>
                <p className="text-gray-700 bg-orange-50 p-3 rounded">
                  {circuits.warmup}
                </p>
              </div>

              {/* Timing */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-orange-50 p-3 rounded text-center">
                  <div className="font-bold text-orange-600">Trabajo</div>
                  <div className="text-xl">45s-90s</div>
                  <div className="text-xs text-gray-500">según ejercicio</div>
                </div>
                <div className="bg-blue-50 p-3 rounded text-center">
                  <div className="font-bold text-blue-600">Descanso</div>
                  <div className="text-2xl">15s</div>
                </div>
                <div className="bg-purple-50 p-3 rounded text-center">
                  <div className="font-bold text-purple-600">Entre Circuitos</div>
                  <div className="text-2xl">2min</div>
                </div>
                <div className="bg-green-50 p-3 rounded text-center">
                  <div className="font-bold text-green-600">Total Estimado</div>
                  <div className="text-2xl">{calculateRealWorkoutTime()}min</div>
                </div>
              </div>

              {/* Instrucciones */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2 text-gray-800">📋 Instrucciones</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {circuits.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Circuitos */}
            {circuits.circuits.map((circuit, circuitIndex) => (
              <div key={circuitIndex} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
                  {circuit.name}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {circuit.exercises.map((exercise, exerciseIndex) => (
                    <div key={exerciseIndex} className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-4 hover:shadow-xl transition-all transform hover:scale-105">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-white mb-1">
                            {exerciseIndex + 1}. {exercise.name}
                          </h4>
                          {exercise.name.includes('1') && (
                            <div className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold inline-block">
                              ⚡ Unilateral
                            </div>
                          )}
                          {exercise.name.includes('2') && (
                            <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold inline-block ml-1">
                              🔄 Alternado
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startTimer(45, exercise.name)}
                            className="text-xs bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition-colors"
                          >
                            ⏱️ 45s
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('¿Por qué quieres cambiar este ejercicio?');
                              if (reason) {
                                substituteExercise(exercise, circuitIndex, exerciseIndex, reason);
                              }
                            }}
                            className="text-xs bg-yellow-500 text-white px-3 py-1 rounded-full hover:bg-yellow-600 transition-colors"
                          >
                            🔄 Cambiar
                          </button>
                        </div>
                      </div>
                      
                      {/* GIF del ejercicio */}
                      {exercise.gifPath && (
                        <div className="mb-3 bg-black rounded-lg p-1 overflow-hidden">
                          <Image
                            src={exercise.gifPath}
                            alt={exercise.name}
                            width={300}
                            height={250}
                            className="w-full h-48 object-contain rounded bg-gray-100"
                            unoptimized
                          />
                        </div>
                      )}
                      
                      <div className="space-y-3 text-sm">
                        <div className="bg-gray-700 p-2 rounded">
                          <span className="font-medium text-orange-400">Grupos musculares:</span>
                          <span className="ml-2 text-gray-200">{exercise.muscleGroups?.join(', ')}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-3 py-2 rounded-full text-sm font-black flex items-center shadow-lg">
                            ⏱️ {exercise.name.includes('1') ? '60s (30s c/lado)' : 
                                 exercise.name.includes('2') ? '45s (alternando)' : 
                                 exercise.workTime}
                          </span>
                          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3 py-2 rounded-full text-sm font-black flex items-center shadow-lg">
                            💤 {exercise.restTime}
                          </span>
                        </div>
                        {exercise.tips && (
                          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg">
                            <p className="text-xs font-medium">
                              💡 {exercise.tips}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Enfriamiento */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-medium mb-2 text-green-600">❄️ Enfriamiento (2-3 min)</h3>
              <p className="text-gray-700 bg-green-50 p-3 rounded">
                {circuits.cooldown}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}