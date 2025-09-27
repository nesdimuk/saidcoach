'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NutritionPlanGenerator } from '../../lib/plan-generator/nutrition';
import { WorkoutPlanGenerator } from '../../lib/plan-generator/workout';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadUserData();
    loadPlans();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      
      if (response.ok) {
        const data = await response.json();
        const userData = data.user;
        
        // Si el usuario no ha completado su perfil, redirigir al onboarding
        // Verificamos que tenga los campos más importantes
        if (!userData.name || !userData.goal) {
          router.push('/onboarding');
          return;
        }
        
        setUser(userData);
      } else {
        // Si no está autenticado, redirigir a login
        router.push('/auth/login');
        return;
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      router.push('/auth/login');
    }
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
                ¡Hola, {user?.name || user?.email}! 👋
              </h1>
              <p className="text-gray-600">
                {user?.membershipType === 'FREE' ? 'Cuenta Gratuita' : `Membresía ${user?.membershipType}`} • Tu plan personalizado te espera
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={generateNewPlans}
                className="bg-[#e79c00] text-white px-4 py-2 rounded-lg hover:bg-[#d68c00] transition"
                disabled={loading}
              >
                {nutritionPlan || workoutPlan ? 'Renovar Planes' : 'Generar Planes'}
              </button>
              <UserMenu user={user} />
            </div>
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
            <div className="text-2xl font-bold text-[#e79c00]">{nutritionPlan.profile?.dailyPortions?.P || nutritionPlan.targets?.P || 0}</div>
            <div className="text-sm text-gray-600">Proteínas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{nutritionPlan.profile?.dailyPortions?.C || nutritionPlan.targets?.C || 0}</div>
            <div className="text-sm text-gray-600">Carbohidratos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{nutritionPlan.profile?.dailyPortions?.G || nutritionPlan.targets?.G || 0}</div>
            <div className="text-sm text-gray-600">Grasas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{nutritionPlan.profile?.dailyPortions?.V || nutritionPlan.targets?.V || 0}</div>
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
                  <div>P: {meal.actualPortions?.P || meal.macros?.P || 0} | C: {meal.actualPortions?.C || meal.macros?.C || 0}</div>
                  <div>G: {meal.actualPortions?.G || meal.macros?.G || 0} | V: {meal.actualPortions?.V || meal.macros?.V || 0}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Ingredientes:</h4>
                {meal.ingredients.map((ingredient, idx) => (
                  <div key={idx} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                    <span>{ingredient.name}</span>
                    <span className="text-gray-600">
                      {ingredient.portions ? `${ingredient.portions} porción${ingredient.portions !== 1 ? 'es' : ''}` : ingredient.amount || 'N/A'}
                    </span>
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

function UserMenu({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
      router.refresh();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <div className="w-8 h-8 bg-[#e79c00] text-white rounded-full flex items-center justify-center font-semibold">
          {(user.name || user.email)[0].toUpperCase()}
        </div>
        <span className="text-sm font-medium">{user.name || user.email.split('@')[0]}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
          <div className="p-3 border-b">
            <div className="font-medium text-sm">{user.name || 'Usuario'}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
            <div className="text-xs text-[#e79c00] font-semibold mt-1">
              {user.membershipType === 'FREE' ? 'Cuenta Gratuita' : `Membresía ${user.membershipType}`}
            </div>
          </div>
          
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/perfil');
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition"
            >
              👤 Mi Perfil
            </button>
            
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/configuracion');
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition"
            >
              ⚙️ Configuración
            </button>
            
            {user.membershipType === 'FREE' && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push('/mejorar-plan');
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition text-[#e79c00] font-medium"
              >
                ⭐ Mejorar Plan
              </button>
            )}
            
            <hr className="my-2" />
            
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition text-red-600"
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}