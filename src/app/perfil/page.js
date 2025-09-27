'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PerfilPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
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
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      
      if (response.ok) {
        const data = await response.json();
        const userData = data.user;
        setUser(userData);
        setFormData({
          name: userData.name || '',
          age: userData.age || '',
          weight: userData.weight || '',
          height: userData.height || '',
          gender: userData.gender || '',
          activityLevel: userData.activityLevel || '',
          goal: userData.goal || ''
        });
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (message) setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Perfil actualizado exitosamente');
        setUser({ ...user, ...formData });
      } else {
        setMessage(data.error || 'Error al actualizar el perfil');
      }
    } catch (error) {
      setMessage('Error de conexión. Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e79c00] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-[#e79c00] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  {(user?.name || user?.email)[0].toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'Usuario'}</h1>
                  <p className="text-gray-600">{user?.email}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e79c00] text-white mt-1">
                    {user?.membershipType === 'FREE' ? 'Cuenta Gratuita' : `Membresía ${user?.membershipType}`}
                  </span>
                </div>
              </div>
              <Link 
                href="/dashboard"
                className="text-[#e79c00] hover:text-[#d68c00] font-medium"
              >
                ← Volver al Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Información Personal</h2>

            {/* Message */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.includes('exitosamente') 
                  ? 'bg-green-50 border border-green-200 text-green-600' 
                  : 'bg-red-50 border border-red-200 text-red-600'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e79c00] focus:border-[#e79c00] transition-colors"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                    Edad
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="16"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e79c00] focus:border-[#e79c00] transition-colors"
                    placeholder="Ej: 30"
                  />
                </div>
              </div>

              {/* Datos físicos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (kg)
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e79c00] focus:border-[#e79c00] transition-colors"
                    placeholder="Ej: 70.5"
                  />
                </div>

                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    min="120"
                    max="250"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e79c00] focus:border-[#e79c00] transition-colors"
                    placeholder="Ej: 170"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e79c00] focus:border-[#e79c00] transition-colors"
                  >
                    <option value="">Seleccionar</option>
                    <option value="MALE">Masculino</option>
                    <option value="FEMALE">Femenino</option>
                    <option value="OTHER">Otro</option>
                  </select>
                </div>
              </div>

              {/* Nivel de actividad */}
              <div>
                <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel de Actividad
                </label>
                <select
                  id="activityLevel"
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e79c00] focus:border-[#e79c00] transition-colors"
                >
                  <option value="">Seleccionar</option>
                  <option value="SEDENTARY">Sedentario (poco o nada de ejercicio)</option>
                  <option value="LIGHT">Ligero (ejercicio ligero 1-3 días/semana)</option>
                  <option value="MODERATE">Moderado (ejercicio moderado 3-5 días/semana)</option>
                  <option value="ACTIVE">Activo (ejercicio intenso 6-7 días/semana)</option>
                  <option value="VERY_ACTIVE">Muy activo (ejercicio muy intenso, trabajo físico)</option>
                </select>
              </div>

              {/* Objetivo */}
              <div>
                <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivo Principal
                </label>
                <select
                  id="goal"
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e79c00] focus:border-[#e79c00] transition-colors"
                >
                  <option value="">Seleccionar</option>
                  <option value="WEIGHT_LOSS">Pérdida de peso</option>
                  <option value="MAINTENANCE">Mantenimiento</option>
                  <option value="MUSCLE_GAIN">Ganancia muscular</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full md:w-auto bg-[#e79c00] text-white py-3 px-8 rounded-lg font-medium hover:bg-[#d68c00] focus:ring-2 focus:ring-[#e79c00] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Guardando...
                    </div>
                  ) : (
                    'Guardar Cambios'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Membership Info */}
        <div className="bg-white rounded-lg shadow mt-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Información de Membresía</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-600">Tipo de Cuenta</div>
                <div className="text-lg font-semibold text-[#e79c00]">
                  {user?.membershipType === 'FREE' ? 'Cuenta Gratuita' : `Membresía ${user?.membershipType}`}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Estado</div>
                <div className="text-lg font-semibold text-green-600">
                  {user?.isActive ? 'Activa' : 'Inactiva'}
                </div>
              </div>
            </div>

            {user?.membershipType === 'FREE' && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <div className="text-2xl mr-3">⭐</div>
                  <div>
                    <h3 className="font-semibold text-yellow-800">¿Quieres más funciones?</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Mejora tu plan para acceder a planes ilimitados, seguimiento avanzado y soporte prioritario.
                    </p>
                    <button className="mt-3 bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition">
                      Mejorar Plan
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}