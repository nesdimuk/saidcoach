'use client';

import { useState } from 'react';
import { Chart, registerables } from 'chart.js';
import Image from 'next/image';
import { generateAndSavePdf } from '../utils/pdfGenerator';

Chart.register(...registerables);

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=" + API_KEY;

export default function PlanGenerator() {
    const [loading, setLoading] = useState(false);
    const [planData, setPlanData] = useState(null);
    const [traineeName, setTraineeName] = useState('');
    const [logo, setLogo] = useState('');
    const [macroChartInstance, setMacroChartInstance] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const alumno = Object.fromEntries(formData.entries());

        try {
            const prompt = `
                Crea un plan de alimentación detallado para un día, incluyendo macros y calorías por comida, para una persona con las siguientes características:
                Nombre: ${alumno.nombre}
                Edad: ${alumno.edad} años
                Sexo: ${alumno.sexo}
                Peso: ${alumno.peso} kg
                Estatura: ${alumno.estatura} cm
                Nivel de actividad: ${alumno.actividad}
                Objetivo: ${alumno.objetivo}
                Número de comidas al día: ${alumno.comidas}
                Alimentos disponibles: ${alumno.alimentos}
                
                Crea el plan de alimentación **únicamente con los alimentos disponibles** en la lista que te proporcioné.
                
                Asegúrate de que la distribución de macronutrientes se ajuste a estos porcentajes: 30% proteínas, 40% carbohidratos, y 30% grasas.
                
                Usa medidas más visuales como "media taza", "un puñado" o "5 almendras" en lugar de solo gramos, siempre que sea posible.
                
                La respuesta debe ser un objeto JSON con las siguientes propiedades:
                {
                    "plan": [
                      {
                        "comida": "Nombre de la comida (ej: Desayuno, Almuerzo)",
                        "receta": "Descripción de la receta y cantidades exactas. Por ejemplo: 150g de pechuga de pollo, 1 taza de arroz integral. Asegúrate de solo usar los alimentos disponibles.",
                        "calorias": "Número de calorías",
                        "macros": {
                          "proteinas": "Número de gramos de proteínas",
                          "carbohidratos": "Número de gramos de carbohidratos",
                          "grasas": "Número de gramos de grasas"
                        }
                      }
                    ],
                    "totales_diarios": {
                      "calorias": "Número total de calorías",
                      "proteinas": "Número total de gramos de proteínas",
                      "carbohidratos": "Número total de gramos de carbohidratos",
                      "grasas": "Número total de gramos de grasas"
                    }
                }
            `;

            const payload = {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                },
            };
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            const planText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!response.ok || !planText) {
                throw new Error(planText || "Error al obtener la respuesta de la API.");
            }

            const parsedPlan = JSON.parse(planText);
            setPlanData(parsedPlan);
            setTraineeName(alumno.nombre);
            
            if (macroChartInstance) {
                macroChartInstance.destroy();
            }

            const ctx = document.getElementById('macro-chart');
            if (ctx) {
                const totals = parsedPlan.totales_diarios;
                const proteinCals = parseInt(totals.proteinas) * 4;
                const carbCals = parseInt(totals.carbohidratos) * 4;
                const fatCals = parseInt(totals.grasas) * 9;

                const newChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Proteínas', 'Carbohidratos', 'Grasas'],
                        datasets: [{
                            data: [proteinCals, carbCals, fatCals],
                            backgroundColor: [
                                'rgb(52, 211, 153)',
                                'rgb(56, 189, 248)',
                                'rgb(251, 113, 133)'
                            ],
                            borderColor: '#FFFFFF',
                            borderWidth: 4,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '60%',
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    padding: 20,
                                    font: {
                                        size: 14,
                                        family: 'Inter'
                                    }
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        let label = context.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        const value = context.parsed;
                                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                        const percentage = ((value / total) * 100).toFixed(1) + '%';
                                        return `${label} ${percentage} (${value} kcal)`;
                                    }
                                }
                            },
                            title: {
                                display: true,
                                text: 'Distribución calórica de macros',
                                padding: {
                                    top: 10,
                                    bottom: 10
                                },
                                font: {
                                    size: 16,
                                    weight: '600'
                                }
                            }
                        }
                    }
                });
                setMacroChartInstance(newChart);
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Hubo un error al generar el plan: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleLogoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogo(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-gray-50 text-gray-800 font-sans min-h-screen">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900">Plataforma SaidCoach</h1>
                    <p className="text-sm text-gray-500">Generador de Planes Nutricionales Asistido por IA</p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    
                    {/* Columna de Formulario */}
                    <div className="lg:col-span-5">
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-xl font-semibold mb-4">1. Datos del Alumno</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                                    <input type="text" id="nombre" name="nombre" className="form-input mt-1" required placeholder="Ej: Juan Pérez" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="edad" className="block text-sm font-medium text-gray-700">Edad</label>
                                        <input type="number" id="edad" name="edad" className="form-input mt-1" required placeholder="Ej: 28" />
                                    </div>
                                    <div>
                                        <label htmlFor="sexo" className="block text-sm font-medium text-gray-700">Sexo</label>
                                        <select id="sexo" name="sexo" className="form-input mt-1" required>
                                            <option value="masculino">Masculino</option>
                                            <option value="femenino">Femenino</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="peso" className="block text-sm font-medium text-gray-700">Peso (kg)</label>
                                        <input type="number" step="0.1" id="peso" name="peso" className="form-input mt-1" required placeholder="Ej: 85" />
                                    </div>
                                    <div>
                                        <label htmlFor="estatura" className="block text-sm font-medium text-gray-700">Estatura (cm)</label>
                                        <input type="number" id="estatura" name="estatura" className="form-input mt-1" required placeholder="Ej: 180" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="objetivo" className="block text-sm font-medium text-gray-700">Objetivo Principal</label>
                                    <select id="objetivo" name="objetivo" className="form-input mt-1" required>
                                        <option value="Bajar de peso">Bajar de peso</option>
                                        <option value="Mantener peso">Mantener peso</option>
                                        <option value="Ganar masa muscular">Ganar masa muscular</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="actividad" className="block text-sm font-medium text-gray-700">Nivel de Actividad</label>
                                    <select id="actividad" name="actividad" className="form-input mt-1" required>
                                        <option value="sedentario">Sedentario (poco o nada de ejercicio)</option>
                                        <option value="ligero">Ligero (1-3 días/semana)</option>
                                        <option value="moderado">Moderado (3-5 días/semana)</option>
                                        <option value="alto">Alto (6-7 días/semana)</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="comidas" className="block text-sm font-medium text-gray-700">Número de Comidas</label>
                                    <input type="number" id="comidas" name="comidas" min="2" max="7" className="form-input mt-1" required placeholder="Ej: 4" />
                                </div>
                                <div>
                                    <label htmlFor="alimentos" className="block text-sm font-medium text-gray-700">Alimentos Disponibles</label>
                                    <textarea id="alimentos" name="alimentos" rows={3} className="form-input mt-1" placeholder="Ej: Pollo, arroz, brócoli, avena, huevos..."></textarea>
                                </div>
                                
                                <div className="pt-4">
                                    <h2 className="text-xl font-semibold mb-4">2. Personalización</h2>
                                    <label htmlFor="logo" className="block text-sm font-medium text-gray-700">Logo del Entrenador (Opcional)</label>
                                    <input type="file" id="logo" name="logo" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" onChange={handleLogoChange} />
                                </div>
                                
                                <div className="pt-6">
                                    <h2 className="text-xl font-semibold mb-4">3. Generar Plan</h2>
                                    <button type="submit" disabled={loading} className="btn-primary">
                                        {loading ? 'Generando...' : '✨ Generar Plan de Alimentación'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Columna de Resultados */}
                    <div className="lg:col-span-7 mt-8 lg:mt-0">
                        {planData ? (
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <div id="plan-header" className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Plan para <span id="trainee-name">{traineeName}</span></h2>
                                        <p className="text-sm text-gray-500">Generado el <span id="generation-date">{new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span></p>
                                    </div>
                                    {logo && <Image id="logo-preview" src={logo} alt="Logo" width={64} height={64} className="rounded-md" />}
                                </div>

                                <div id="summary-section" className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                    <div className="bg-emerald-50 p-3 rounded-lg">
                                        <p className="text-sm text-emerald-700 font-medium">Calorías</p>
                                        <p className="text-xl font-bold text-emerald-900">{planData.totales_diarios.calorias}</p>
                                    </div>
                                    <div className="bg-sky-50 p-3 rounded-lg">
                                        <p className="text-sm text-sky-700 font-medium">Proteínas</p>
                                        <p className="text-xl font-bold text-sky-900">{planData.totales_diarios.proteinas}g</p>
                                    </div>
                                    <div className="bg-amber-50 p-3 rounded-lg">
                                        <p className="text-sm text-amber-700 font-medium">Carbs</p>
                                        <p className="text-xl font-bold text-amber-900">{planData.totales_diarios.carbohidratos}g</p>
                                    </div>
                                    <div className="bg-rose-50 p-3 rounded-lg">
                                        <p className="text-sm text-rose-700 font-medium">Grasas</p>
                                        <p className="text-xl font-bold text-rose-900">{planData.totales_diarios.grasas}g</p>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <div className="chart-container">
                                        <canvas id="macro-chart"></canvas>
                                    </div>
                                </div>
                                
                                <div id="plan-details" className="mt-8 space-y-6">
                                    {planData.plan.map((meal, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-bold text-lg text-gray-800">{meal.comida}</h4>
                                            <p className="mt-2 text-gray-600">{meal.receta}</p>
                                            <div className="mt-3 text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                                                <span><strong>CAL:</strong> {meal.calorias}</span>
                                                <span><strong>PRO:</strong> {meal.macros.proteinas}g</span>
                                                <span><strong>CAR:</strong> {meal.macros.carbohidratos}g</span>
                                                <span><strong>GRA:</strong> {meal.macros.grasas}g</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
                                    <button onClick={() => generateAndSavePdf(planData, traineeName, logo)} className="btn-primary">📄 Guardar como PDF</button>
                                    <button className="btn-secondary w-full sm:w-auto">🔗 Compartir Enlace</button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white p-8 rounded-xl shadow-md text-center flex flex-col items-center justify-center h-full">
                                <svg className="w-16 h-16 text-gray-300 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 5.25 6h.008a2.25 2.25 0 0 1 2.242 2.135M8.25 10.5h.008a.75.75 0 0 0 0-1.5H8.25V9a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 0-.75.75v1.5Z" />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-700">El plan aparecerá aquí</h3>
                                <p className="text-gray-500 mt-1">Completa el formulario de la izquierda y haz clic en "Generar Plan" para empezar.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

