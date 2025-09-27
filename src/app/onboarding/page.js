'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    activityLevel: '',
    goal: ''
  });
  
  const router = useRouter();

  useEffect(() => {
    checkUserData();
  }, []);

  const checkUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        
        // Si ya tiene datos completos, redirigir al dashboard
        console.log('User data:', data.user);
        if (data.user.name && data.user.goal) {
          console.log('User has complete profile, redirecting to dashboard');
          router.push('/dashboard');
          return;
        }
        console.log('User needs to complete profile');
        
        setInitialLoading(false);
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      router.push('/auth/login');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    console.log('Submitting form data:', formData);

    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Response from update-profile:', data);

      if (response.ok) {
        console.log('Profile updated successfully, redirecting to dashboard');
        // Esperar un momento y redirigir
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
        }, 500);
      } else {
        console.error('Error updating profile:', data.error);
        alert(data.error || 'Error al guardar los datos');
        setLoading(false);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Error de conexión. Intenta nuevamente.');
      setLoading(false);
    }
  };

  const canContinue = () => {
    switch (step) {
      case 1:
        return formData.name && formData.age && formData.gender;
      case 2:
        return formData.weight && formData.height && formData.activityLevel;
      case 3:
        return formData.goal;
      default:
        return false;
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e79c00] mx-auto"></div>
          <p className="mt-4 text-gray-600">Preparando tu experiencia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              ¡Bienvenido a SaidCoach! 🎉
            </h1>
            <p className="text-gray-600">
              Completemos tu perfil para crear tu plan personalizado
            </p>
            
            {/* Progress Bar */}
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i <= step ? 'bg-[#e79c00]' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Paso {step} de 3</p>
          </div>

          {/* Step 1: Información Personal */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-center">Información Personal</h2>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Cuál es tu nombre completo?
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e79c00] focus:border-[#e79c00] transition-colors text-gray-900 placeholder-gray-500"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Cuál es tu edad?
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="16"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e79c00] focus:border-[#e79c00] transition-colors text-gray-900 placeholder-gray-500"
                  placeholder="Ej: 30"
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Género
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e79c00] focus:border-[#e79c00] transition-colors text-gray-900 placeholder-gray-500"
                >
                  <option value="">Seleccionar</option>
                  <option value="MALE">Masculino</option>
                  <option value="FEMALE">Femenino</option>
                  <option value="OTHER">Otro</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Datos Físicos */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-center">Datos Físicos</h2>
              
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Cuál es tu peso actual? (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="30"
                  max="300"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e79c00] focus:border-[#e79c00] transition-colors text-gray-900 placeholder-gray-500"
                  placeholder="Ej: 70.5"
                />
              </div>

              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Cuál es tu altura? (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  min="120"
                  max="250"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e79c00] focus:border-[#e79c00] transition-colors text-gray-900 placeholder-gray-500"
                  placeholder="Ej: 170"
                />
              </div>

              <div>
                <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Cuál es tu nivel de actividad actual?
                </label>
                <select
                  id="activityLevel"
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e79c00] focus:border-[#e79c00] transition-colors text-gray-900 placeholder-gray-500"
                >
                  <option value="">Seleccionar</option>
                  <option value="SEDENTARY">Sedentario (poco o nada de ejercicio)</option>
                  <option value="LIGHT">Ligero (ejercicio ligero 1-3 días/semana)</option>
                  <option value="MODERATE">Moderado (ejercicio moderado 3-5 días/semana)</option>
                  <option value="ACTIVE">Activo (ejercicio intenso 6-7 días/semana)</option>
                  <option value="VERY_ACTIVE">Muy activo (ejercicio muy intenso, trabajo físico)</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Objetivo */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-center">Tu Objetivo</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  ¿Cuál es tu objetivo principal?
                </label>
                
                <div className="space-y-3">
                  {[
                    { value: 'WEIGHT_LOSS', label: 'Pérdida de peso', emoji: '📉', desc: 'Quiero reducir mi peso corporal' },
                    { value: 'MAINTENANCE', label: 'Mantenimiento', emoji: '⚖️', desc: 'Mantener mi peso actual y mejorar mi condición' },
                    { value: 'MUSCLE_GAIN', label: 'Ganancia muscular', emoji: '💪', desc: 'Aumentar masa muscular y fuerza' }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition ${
                        formData.goal === option.value ? 'border-[#e79c00] bg-orange-50' : 'border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="goal"
                        value={option.value}
                        checked={formData.goal === option.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center w-full">
                        <div className="text-2xl mr-3">{option.emoji}</div>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-gray-500">{option.desc}</div>
                        </div>
                        {formData.goal === option.value && (
                          <div className="ml-auto text-[#e79c00]">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                step === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Anterior
            </button>

            <button
              onClick={nextStep}
              disabled={!canContinue() || loading}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                canContinue() && !loading
                  ? 'bg-[#e79c00] text-white hover:bg-[#d68c00]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Guardando...
                </div>
              ) : step === 3 ? (
                'Completar Perfil'
              ) : (
                'Siguiente'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}