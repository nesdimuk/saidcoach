'use client';
import { useState, useEffect } from 'react';

export default function RankingOCCIM() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Función para procesar archivos CSV y calcular puntos
  const calculateRanking = async () => {
    try {
      setLoading(true);
      
      // Ejecutar el script de actualización del ranking desde Google Sheets
      const response = await fetch('/api/update-ranking-sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setParticipants(data.participants || []);
        setLastUpdate(new Date(data.lastUpdate || new Date()));
      } else {
        // Fallback a datos estáticos si falla la API
        const fallbackData = [
          { 
            name: "Ana María Guzmán", 
            points: 40, 
            lessons: ["Lección 6", "Lección 7"],
            avatar: "🏆"
          },
          { 
            name: "Pablo Gómez", 
            points: 40, 
            lessons: ["Lección 6", "Lección 7"],
            avatar: "🥈"
          },
          { 
            name: "Daniel Hevia", 
            points: 40, 
            lessons: ["Lección 6", "Lección 7"],
            avatar: "🥉"
          },
          { 
            name: "María Teresa Mesa", 
            points: 20, 
            lessons: ["Lección 6"],
            avatar: "💪"
          },
          { 
            name: "Juan Pablo Valle", 
            points: 20, 
            lessons: ["Lección 6"],
            avatar: "⭐"
          },
          { 
            name: "Erwin Rivera", 
            points: 20, 
            lessons: ["Lección 6"],
            avatar: "🌟"
          },
          { 
            name: "Luis López", 
            points: 20, 
            lessons: ["Lección 6"],
            avatar: "💫"
          },
          { 
            name: "Natalia Araya", 
            points: 20, 
            lessons: ["Lección 6"],
            avatar: "🎯"
          }
        ];
        
        setParticipants(fallbackData);
        setLastUpdate(new Date());
      }
      
    } catch (error) {
      console.error('Error al calcular ranking:', error);
      // Usar datos estáticos como fallback
      const fallbackData = [
        { name: "Ana María Guzmán", points: 40, lessons: ["Lección 6", "Lección 7"], avatar: "🏆" },
        { name: "Pablo Gómez", points: 40, lessons: ["Lección 6", "Lección 7"], avatar: "🥈" },
        { name: "Daniel Hevia", points: 40, lessons: ["Lección 6", "Lección 7"], avatar: "🥉" }
      ];
      setParticipants(fallbackData);
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    calculateRanking();
  }, []);

  const getRankingIcon = (index) => {
    switch (index) {
      case 0: return "🥇";
      case 1: return "🥈"; 
      case 2: return "🥉";
      default: return `${index + 1}°`;
    }
  };

  const getRankingColor = (index) => {
    switch (index) {
      case 0: return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 1: return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 2: return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
      default: return "bg-white";
    }
  };

  // Evitar hidration mismatch mostrando loading hasta que el componente esté montado
  if (!mounted) {
    return (
      <div className="bg-gray-100 min-h-screen px-4 py-6 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#e79e00] mb-2">🏆 Ranking OCCIM</h1>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen px-4 py-6 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Título */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#e79e00] mb-2">
            🏆 Ranking OCCIM
          </h1>
          <p className="text-gray-600">
            Puntuación de participantes del Programa de Bienestar
          </p>
        </div>

        {/* Botón de actualizar */}
        <div className="flex justify-between items-center">
          <button
            onClick={calculateRanking}
            disabled={loading}
            className="bg-[#e79e00] hover:bg-[#d18e00] text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? '🔄 Actualizando...' : '🔄 Actualizar Ranking'}
          </button>
          <span className="text-sm text-gray-500">
            Última actualización: {mounted && lastUpdate ? lastUpdate.toLocaleString('es-CL') : 'Cargando...'}
          </span>
        </div>

        {/* Tabla de ranking */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#e79e00] text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Posición</th>
                  <th className="px-6 py-4 text-left font-semibold">Participante</th>
                  <th className="px-6 py-4 text-center font-semibold">Puntos</th>
                  <th className="px-6 py-4 text-left font-semibold">Lecciones Completadas</th>
                  <th className="px-6 py-4 text-center font-semibold">Progreso</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant, index) => (
                  <tr 
                    key={participant.name} 
                    className={`border-b hover:bg-gray-50 transition-colors ${getRankingColor(index)}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getRankingIcon(index)}</span>
                        <span className="font-semibold text-lg">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{participant.avatar}</span>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {participant.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="bg-[#e79e00] text-white px-3 py-1 rounded-full font-bold text-lg inline-block">
                        {participant.points}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {participant.lessons.map((lesson, idx) => (
                          <span 
                            key={idx}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                          >
                            {lesson}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(participant.points / 60) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 block">
                        {Math.round((participant.points / 60) * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Estadísticas generales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-[#e79e00] mb-2">
              {participants.length}
            </div>
            <div className="text-gray-600">Participantes Activos</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {participants.reduce((sum, p) => sum + p.points, 0)}
            </div>
            <div className="text-gray-600">Puntos Totales</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {participants.length > 0 ? Math.round(participants.reduce((sum, p) => sum + p.points, 0) / participants.length) : 0}
            </div>
            <div className="text-gray-600">Promedio de Puntos</div>
          </div>
        </div>

        {/* Información sobre el sistema de puntos */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            ℹ️ Sistema de Puntuación
          </h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• <strong>20 puntos</strong> por completar cada lección con respuesta correcta</li>
            <li>• Solo se cuentan las <strong>lecciones completadas</strong> para el ranking</li>
            <li>• El ranking se actualiza automáticamente con las nuevas respuestas</li>
            <li>• Las lecciones se evalúan con preguntas de comprensión</li>
            <li>• El sistema reconoce automáticamente variaciones en los nombres</li>
          </ul>
        </div>

        {/* Pie de página */}
        <div className="text-center pt-4 text-sm text-gray-500">
          © {mounted ? new Date().getFullYear() : '2025'} SaidCoach · Programa de Bienestar OCCIM
        </div>
      </div>
    </div>
  );
}