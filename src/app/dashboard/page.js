'use client';

import { useState, useEffect } from 'react';
import { NutritionPlanGenerator } from '../../lib/plan-generator/nutrition';
import { WorkoutPlanGenerator } from '../../lib/plan-generator/workout';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    loadPlans();
  }, []);

  const loadUserData = () => {
    // Por ahora usamos datos de ejemplo, luego conectar con DB
    const mockUser = {
      id: '1',
      name: 'Usuario Demo',
      email: 'demo@saidcoach.com',
      age: 30,
      weight: 70,
      height: 170,
      gender: 'FEMALE',
      activityLevel: 'MODERATE',
      goal: 'WEIGHT_LOSS'
    };
    setUser(mockUser);
  };

  const loadPlans = async () => {
    try {
      // Verificar si hay planes existentes en localStorage
      const savedNutritionPlan = localStorage.getItem('currentNutritionPlan');
      const savedWorkoutPlan = localStorage.getItem('currentWorkoutPlan');

      if (savedNutritionPlan) {
        setNutritionPlan(JSON.parse(savedNutritionPlan));
      }

      if (savedWorkoutPlan) {
        setWorkoutPlan(JSON.parse(savedWorkoutPlan));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading plans:', error);
      setLoading(false);
    }
  };

  const generateNewPlans = async () => {
    if (!user) return;

    setLoading(true);
    
    try {
      const nutritionGenerator = new NutritionPlanGenerator();
      const workoutGenerator = new WorkoutPlanGenerator();

      const newNutritionPlan = await nutritionGenerator.generateWeeklyPlan(user);
      const newWorkoutPlan = await workoutGenerator.generateWeeklyPlan(user);

      setNutritionPlan(newNutritionPlan);
      setWorkoutPlan(newWorkoutPlan);

      // Guardar en localStorage (luego migrar a DB)
      localStorage.setItem('currentNutritionPlan', JSON.stringify(newNutritionPlan));
      localStorage.setItem('currentWorkoutPlan', JSON.stringify(newWorkoutPlan));

    } catch (error) {
      console.error('Error generating plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTodayPlan = () => {
    const today = new Date().getDay(); // 0 = Domingo, 1 = Lunes, etc.
    const dayIndex = today === 0 ? 6 : today - 1; // Convertir a 0 = Lunes

    return {
      nutrition: nutritionPlan?.weekPlan?.[dayIndex] || null,
      workout: workoutPlan?.workouts?.[dayIndex] || null
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e79c00] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tu dashboard...</p>
        </div>
      </div>
    );
  }

  const todayPlan = getTodayPlan();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                ¡Hola, {user?.name}! 👋
              </h1>
              <p className="text-gray-600">Tu plan personalizado te espera</p>
            </div>
            <button
              onClick={generateNewPlans}
              className="bg-[#e79c00] text-white px-4 py-2 rounded-lg hover:bg-[#d68c00] transition"
              disabled={loading}
            >
              {nutritionPlan || workoutPlan ? 'Renovar Planes' : 'Generar Planes'}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', name: 'Resumen' },
              { id: 'nutrition', name: 'Nutrición' },
              { id: 'workout', name: 'Entrenamiento' },
              { id: 'progress', name: 'Progreso' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-[#e79c00] text-[#e79c00]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewTab 
            user={user} 
            todayPlan={todayPlan} 
            nutritionPlan={nutritionPlan}
            workoutPlan={workoutPlan}
          />
        )}
        
        {activeTab === 'nutrition' && (
          <NutritionTab nutritionPlan={nutritionPlan} />
        )}
        
        {activeTab === 'workout' && (
          <WorkoutTab workoutPlan={workoutPlan} />
        )}
        
        {activeTab === 'progress' && (
          <ProgressTab user={user} />
        )}
      </main>
    </div>
  );
}

// Componente de resumen
function OverviewTab({ user, todayPlan, nutritionPlan, workoutPlan }) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard 
          title="Meta Actual" 
          value={user?.goal === 'WEIGHT_LOSS' ? 'Pérdida de Peso' : user?.goal === 'MUSCLE_GAIN' ? 'Ganar Músculo' : 'Mantenimiento'}
          icon="🎯"
        />
        <StatsCard 
          title="Días de Entrenamiento" 
          value={`${workoutPlan?.daysPerWeek || 0}/semana`}
          icon="💪"
        />
        <StatsCard 
          title="Proteína Diaria" 
          value={`${nutritionPlan?.targets?.P || 0}P`}
          icon="🥩"
        />
        <StatsCard 
          title="Nivel" 
          value={workoutPlan?.level || 'Sin definir'}
          icon="⭐"
        />
      </div>

      {/* Today's Plan */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Plan de Hoy</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Nutrition */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-[#e79c00]">🍽️ Comidas de Hoy</h3>
            {todayPlan.nutrition ? (
              <div className="space-y-2">
                {todayPlan.nutrition.meals.map((meal, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <div className="font-medium">{meal.name}</div>
                    <div className="text-sm text-gray-600">{meal.type}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Genera tu plan nutricional para ver las comidas de hoy</p>
            )}
          </div>

          {/* Today's Workout */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-[#e79c00]">🏋️ Entrenamiento de Hoy</h3>
            {todayPlan.workout ? (
              <div className="space-y-2">
                <div className="font-medium">{todayPlan.workout.name}</div>
                <div className="text-sm text-gray-600">
                  Duración estimada: {todayPlan.workout.estimatedTime} min
                </div>
                <div className="text-sm text-gray-600">
                  {todayPlan.workout.exercises.length} ejercicios
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Genera tu plan de entrenamiento para ver la rutina de hoy</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionButton 
            title="Registrar Comida"
            description="Trackea tus macros del día"
            icon="📝"
            href="/pn/tablero"
          />
          <ActionButton 
            title="Marcar Entrenamiento"
            description="Completa tu rutina diaria"
            icon="✅"
            onClick={() => alert('Funcionalidad próximamente')}
          />
          <ActionButton 
            title="Ver Progreso"
            description="Revisa tu evolución"
            icon="📈"
            onClick={() => setActiveTab('progress')}
          />
        </div>
      </div>
    </div>
  );
}

// Componente de nutrición
function NutritionTab({ nutritionPlan }) {
  const [selectedDay, setSelectedDay] = useState(0);

  if (!nutritionPlan) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🍽️</div>
        <h2 className="text-2xl font-semibold mb-2">Sin Plan Nutricional</h2>
        <p className="text-gray-600">Genera tu plan personalizado para comenzar</p>
      </div>
    );
  }

  const selectedDayPlan = nutritionPlan.weekPlan[selectedDay];

  return (
    <div className="space-y-6">
      {/* Targets Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Objetivos Nutricionales</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#e79c00]">{nutritionPlan.targets.P}</div>
            <div className="text-sm text-gray-600">Proteínas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{nutritionPlan.targets.C}</div>
            <div className="text-sm text-gray-600">Carbohidratos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{nutritionPlan.targets.G}</div>
            <div className="text-sm text-gray-600">Grasas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{nutritionPlan.targets.V}</div>
            <div className="text-sm text-gray-600">Verduras</div>
          </div>
        </div>
      </div>

      {/* Day Selector */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex space-x-2 mb-4">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => (
            <button
              key={index}
              onClick={() => setSelectedDay(index)}
              className={`px-4 py-2 rounded-lg ${
                selectedDay === index 
                  ? 'bg-[#e79c00] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Meals for Selected Day */}
        <div className="space-y-4">
          {selectedDayPlan?.meals.map((meal, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{meal.name}</h3>
                  <p className="text-sm text-gray-600">{meal.type}</p>
                </div>
                <div className="text-right text-sm">
                  <div>P: {meal.macros.P} | C: {meal.macros.C}</div>
                  <div>G: {meal.macros.G} | V: {meal.macros.V}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Ingredientes:</h4>
                {meal.ingredients.map((ingredient, idx) => (
                  <div key={idx} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                    <span>{ingredient.name}</span>
                    <span className="text-gray-600">{ingredient.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente de entrenamiento
function WorkoutTab({ workoutPlan }) {
  const [selectedWorkout, setSelectedWorkout] = useState(0);

  if (!workoutPlan) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏋️</div>
        <h2 className="text-2xl font-semibold mb-2">Sin Plan de Entrenamiento</h2>
        <p className="text-gray-600">Genera tu rutina personalizada para comenzar</p>
      </div>
    );
  }

  const workout = workoutPlan.workouts[selectedWorkout];

  return (
    <div className="space-y-6">
      {/* Plan Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Tu Plan de Entrenamiento</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#e79c00]">{workoutPlan.daysPerWeek}</div>
            <div className="text-sm text-gray-600">Días por semana</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{workoutPlan.level}</div>
            <div className="text-sm text-gray-600">Nivel</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{workoutPlan.goal}</div>
            <div className="text-sm text-gray-600">Objetivo</div>
          </div>
        </div>
      </div>

      {/* Workout Selector */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex space-x-2 mb-4 overflow-x-auto">
          {workoutPlan.workouts.map((workout, index) => (
            <button
              key={index}
              onClick={() => setSelectedWorkout(index)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedWorkout === index 
                  ? 'bg-[#e79c00] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {workout.name}
            </button>
          ))}
        </div>

        {/* Selected Workout Details */}
        {workout && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{workout.name}</h3>
              <span className="text-sm text-gray-600">~{workout.estimatedTime} min</span>
            </div>

            {/* Warmup */}
            {workout.warmup && (
              <div className="bg-yellow-50 p-3 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-1">Calentamiento</h4>
                <p className="text-sm text-yellow-700">{workout.warmup}</p>
              </div>
            )}

            {/* Exercises */}
            <div className="space-y-3">
              {workout.exercises.map((exercise, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{exercise.name}</h4>
                    <div className="text-right text-sm text-gray-600">
                      <div>{exercise.sets} series × {exercise.reps}</div>
                      <div>Descanso: {exercise.rest}</div>
                    </div>
                  </div>
                  {exercise.notes && (
                    <p className="text-sm text-gray-600">{exercise.notes}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Cooldown */}
            {workout.cooldown && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-1">Enfriamiento</h4>
                <p className="text-sm text-blue-700">{workout.cooldown}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Componente de progreso
function ProgressTab({ user }) {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📈</div>
        <h2 className="text-2xl font-semibold mb-2">Seguimiento de Progreso</h2>
        <p className="text-gray-600">Próximamente: Gráficos de evolución, métricas y estadísticas</p>
      </div>
    </div>
  );
}

// Componentes auxiliares
function StatsCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="text-2xl mr-3">{icon}</div>
        <div>
          <div className="text-sm text-gray-600">{title}</div>
          <div className="text-xl font-semibold">{value}</div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ title, description, icon, href, onClick }) {
  const buttonContent = (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-medium">{title}</div>
      <div className="text-sm text-gray-600">{description}</div>
    </div>
  );

  if (href) {
    return <a href={href}>{buttonContent}</a>;
  }

  return <div onClick={onClick}>{buttonContent}</div>;
}