'use client'; // Esto es necesario para usar hooks de React en el App Router

import React, { useState } from 'react';

// Componente principal de la aplicación
const App = () => {
  // Estados para los campos del formulario
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [goal, setGoal] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [mealsPerDay, setMealsPerDay] = useState('');
  // Nuevo estado para la preferencia de macronutrientes
  const [macroPreference, setMacroPreference] = useState('');


  // Estados para los resultados del cálculo
  const [portionResults, setPortionResults] = useState(null);
  const [trackingTemplateHtml, setTrackingTemplateHtml] = useState('');

  // Estados para la UI (carga, mensajes)
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'hidden' });

  /**
   * Muestra un mensaje en la interfaz de usuario.
   * @param {string} text - El contenido del mensaje.
   * @param {'info' | 'success' | 'error' | 'hidden'} type - El tipo de mensaje (afecta el estilo).
   */
  const displayMessage = (text, type) => {
    setMessage({ text, type });
  };

  /**
   * Calcula las porciones diarias recomendadas y genera la plantilla de seguimiento.
   */
  const calculateAndDisplayPortions = () => {
    // Validar entradas básicas
    if (!name || !age || !sex || !weight || !height || !goal || !activityLevel || !mealsPerDay || !macroPreference) {
      displayMessage("Por favor, completa todos los campos del formulario.", "error");
      setPortionResults(null);
      setTrackingTemplateHtml('');
      return;
    }

    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseInt(height);
    const mealsNum = parseInt(mealsPerDay);

    if (isNaN(ageNum) || isNaN(weightNum) || isNaN(heightNum) || isNaN(mealsNum)) {
      displayMessage("Por favor, introduce valores numéricos válidos para edad, peso, altura y comidas.", "error");
      setPortionResults(null);
      setTrackingTemplateHtml('');
      return;
    }

    // --- Lógica de cálculo de porciones basada en perfiles ---
    let proteinPortions = 0;
    let carbPortions = 0;
    let veggiePortions = 0;
    let fatPortions = 0;

    // Definición de perfiles base para mujeres y hombres
    const profiles = {
      female: {
        L1: { protein: 4, carbs: 4, veggies: 4, fats: 4 },
        L2: { protein: 5, carbs: 5, veggies: 5, fats: 5 },
        L3: { protein: 6, carbs: 6, veggies: 6, fats: 6 },
      },
      male: {
        M1: { protein: 6, carbs: 6, veggies: 5, fats: 6 },
        M2: { protein: 7, carbs: 7, veggies: 6, fats: 7 },
        M3: { protein: 8, carbs: 8, veggies: 7, fats: 8 },
      }
    };

    // Mapeo de nivel de actividad a una puntuación
    const activityScores = {
      'sedentary': 0,
      'light': 1,
      'moderate': 2,
      'active': 3,
      'very_active': 4
    };

    // Mapeo de objetivo a un modificador de puntuación
    const goalModifiers = {
      'fat_loss': -1,
      'health': 0,
      'muscle_gain': 1
    };

    // Calcular una puntuación combinada para seleccionar el perfil
    const combinedScore = activityScores[activityLevel] + goalModifiers[goal];

    let selectedProfile;
    if (sex === 'female') {
      if (combinedScore <= 1) { // Sedentario, Ligero (Fat Loss / Health)
        selectedProfile = profiles.female.L1;
      } else if (combinedScore >= 4) { // Activo, Muy Activo (Muscle Gain)
        selectedProfile = profiles.female.L3;
      } else { // Moderado (Health / Muscle Gain), Ligero (Muscle Gain), Activo (Fat Loss / Health)
        selectedProfile = profiles.female.L2;
      }
      // Asegurar mínimo de verduras para mujeres
      if (selectedProfile.veggies < 4) selectedProfile.veggies = 4;

    } else { // male
      if (combinedScore <= 2) { // Sedentario, Ligero (Fat Loss / Health), Moderado (Fat Loss)
        selectedProfile = profiles.male.M1;
      } else if (combinedScore >= 5) { // Activo, Muy Activo (Muscle Gain)
        selectedProfile = profiles.male.M3;
      } else { // Moderado (Health / Muscle Gain), Ligero (Muscle Gain), Activo (Fat Loss / Health)
        selectedProfile = profiles.male.M2;
      }
      // Asegurar mínimo de verduras para hombres
      if (selectedProfile.veggies < 5) selectedProfile.veggies = 5;
    }

    proteinPortions = selectedProfile.protein;
    carbPortions = selectedProfile.carbs;
    veggiePortions = selectedProfile.veggies;
    fatPortions = selectedProfile.fats;

    // --- Ajuste por preferencia de macronutrientes ---
    if (macroPreference === 'higher_carb') {
        carbPortions = Math.max(1, carbPortions + 1); // +1 carb
        fatPortions = Math.max(1, fatPortions - 1);   // -1 fat
    } else if (macroPreference === 'higher_fat') {
        carbPortions = Math.max(1, carbPortions - 1); // -1 carb
        fatPortions = Math.max(1, fatPortions + 1);   // +1 fat
    }


    // Redondear a medias porciones (aunque los perfiles ya son enteros o medios si se definen así)
    proteinPortions = Math.round(proteinPortions * 2) / 2;
    carbPortions = Math.round(carbPortions * 2) / 2;
    veggiePortions = Math.round(veggiePortions * 2) / 2;
    fatPortions = Math.round(fatPortions * 2) / 2;

    const calculatedPortions = {
      protein: proteinPortions,
      carbs: carbPortions,
      veggies: veggiePortions,
      fats: fatPortions,
    };

    setPortionResults(calculatedPortions);
    generateTrackingTemplate(name, mealsNum, calculatedPortions);
    displayMessage("¡Cálculo completado! Desplázate hacia abajo para ver tus resultados y plantilla.", "success");
  };

  /**
   * Genera el HTML para la plantilla de seguimiento.
   * @param {string} name - Nombre del usuario.
   * @param {number} meals - Número de comidas al día.
   * @param {object} goals - Objeto con los objetivos de porciones.
   */
  const generateTrackingTemplate = (name, meals, goals) => {
    let template = `
        <div class="p-4 bg-zinc-900 rounded-lg shadow-inner">
            <h4 class="text-lg font-semibold mb-3 text-center text-zinc-100">Plan de Seguimiento Diario Personalizado</h4>
            <p class="text-sm text-zinc-300 mb-4 text-center">Para: ${name} | Fecha: ${new Date().toLocaleDateString('es-ES')}</p>

            <div class="mb-6 bg-zinc-800 p-3 rounded-md border border-zinc-700">
                <p class="font-semibold text-zinc-100">Objetivo Diario de Porciones:</p>
                <ul class="list-disc list-inside text-zinc-200 text-sm">
                    <li>Proteína: ${goals.protein} palmas</li>
                    <li>Carbohidratos: ${goals.carbs} puñados</li>
                    <li>Vegetales: ${goals.veggies} puños</li>
                    <li>Grasas: ${goals.fats} pulgares</li>
                </ul>
            </div>

            <table class="w-full text-sm text-left text-zinc-200 border-collapse">
                <thead class="text-xs text-zinc-100 uppercase bg-zinc-700">
                    <tr>
                        <th scope="col" class="px-3 py-2 border border-zinc-600">Comida</th>
                        <th scope="col" class="px-3 py-2 border border-zinc-600">Alimentos / Notas</th>
                        <th scope="col" class="px-3 py-2 border border-zinc-600 text-center">P (palmas)</th>
                        <th scope="col" class="px-3 py-2 border border-zinc-600 text-center">C (puñados)</th>
                        <th scope="col" class="px-3 py-2 border border-zinc-600 text-center">V (puños)</th>
                        <th scope="col" class="px-3 py-2 border border-zinc-600 text-center">G (pulgares)</th>
                    </tr>
                </thead>
                <tbody>
    `;

    const mealNames = ["Desayuno", "Almuerzo", "Cena", "Snack 1", "Snack 2", "Snack 3"];
    for (let i = 0; i < meals; i++) {
      const meal = mealNames[i] || `Comida ${i + 1}`;
      template += `
                    <tr class="bg-zinc-900 border-b border-zinc-700 hover:bg-zinc-800">
                        <td class="px-3 py-2 border border-zinc-600 font-medium text-zinc-100">${meal}</td>
                        <td class="px-3 py-2 border border-zinc-600">
                            <textarea id="notes_meal_${i}" class="w-full h-16 p-2 text-zinc-100 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-[#e79c00] focus:border-[#e79c00] text-xs resize-y" placeholder="Ej: Pollo asado con arroz"></textarea>
                        </td>
                        <td class="px-3 py-2 border border-zinc-600 text-center">
                            <input type="number" id="protein_meal_${i}" class="w-full p-1 text-zinc-100 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-[#e79c00] focus:border-[#e79c00] text-xs text-center" min="0" step="0.5" placeholder="0">
                        </td>
                        <td class="px-3 py-2 border border-zinc-600 text-center">
                            <input type="number" id="carbs_meal_${i}" class="w-full p-1 text-zinc-100 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-[#e79c00] focus:border-[#e79c00] text-xs text-center" min="0" step="0.5" placeholder="0">
                        </td>
                        <td class="px-3 py-2 border border-zinc-600 text-center">
                            <input type="number" id="veggies_meal_${i}" class="w-full p-1 text-zinc-100 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-[#e79c00] focus:border-[#e79c00] text-xs text-center" min="0" step="0.5" placeholder="0">
                        </td>
                        <td class="px-3 py-2 border border-zinc-600 text-center">
                            <input type="number" id="fats_meal_${i}" class="w-full p-1 text-zinc-100 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-[#e79c00] focus:border-[#e79c00] text-xs text-center" min="0" step="0.5" placeholder="0">
                        </td>
                    </tr>
      `;
    }

    template += `
                </tbody>
                <tfoot class="text-xs text-zinc-100 uppercase bg-zinc-700 font-semibold">
                    <tr>
                        <td colspan="2" class="px-3 py-2 border border-zinc-600 text-right">Totales del Día:</td>
                        <td class="px-3 py-2 border border-zinc-600 text-center">
                            <input type="number" id="total_protein" class="w-full p-1 text-zinc-100 bg-zinc-800 border border-zinc-700 rounded-md text-xs text-center font-bold" disabled placeholder="0">
                        </td>
                        <td class="px-3 py-2 border border-zinc-600 text-center">
                            <input type="number" id="total_carbs" class="w-full p-1 text-zinc-100 bg-zinc-800 border border-zinc-700 rounded-md text-xs text-center font-bold" disabled placeholder="0">
                        </td>
                        <td class="px-3 py-2 border border-zinc-600 text-center">
                            <input type="number" id="total_veggies" class="w-full p-1 text-zinc-100 bg-zinc-800 border border-zinc-700 rounded-md text-xs text-center font-bold" disabled placeholder="0">
                        </td>
                        <td class="px-3 py-2 border border-zinc-600 text-center">
                            <input type="number" id="total_fats" class="w-full p-1 text-zinc-100 bg-zinc-800 border border-zinc-700 rounded-md text-xs text-center font-bold" disabled placeholder="0">
                        </td>
                    </tr>
                </tfoot>
            </table>
            <p class="mt-4 text-xs text-zinc-400 text-center">P = Proteína | C = Carbohidratos | V = Vegetales | G = Grasas</p>
            <p class="mt-2 text-xs text-zinc-400 text-center">Nota: Esta plantilla es para tu seguimiento personal. Rellénala con los alimentos y porciones de cada comida.</p>
        </div>
    `;
    setTrackingTemplateHtml(template);

    // After setting the HTML, attach event listeners to update totals
    // This needs a slight delay or to be done outside React's direct render cycle
    // to ensure elements are in the DOM.
    setTimeout(() => {
        attachInputListeners(meals);
    }, 0);
  };

  /**
   * Adjunta listeners a los campos de entrada para calcular totales en tiempo real.
   * @param {number} meals - Número de comidas para las que se generaron los campos.
   */
  const attachInputListeners = (meals) => {
    const macros = ['protein', 'carbs', 'veggies', 'fats'];

    macros.forEach(macro => {
      // Función para calcular el total de un macro específico
      const calculateTotal = () => {
        let total = 0;
        for (let i = 0; i < meals; i++) {
          const input = document.getElementById(`${macro}_meal_${i}`);
          if (input && !isNaN(parseFloat(input.value))) {
            total += parseFloat(input.value);
          }
        }
        const totalInput = document.getElementById(`total_${macro}`);
        if (totalInput) {
          totalInput.value = total;
        }
      };

      // Adjuntar listeners a todos los inputs de este macro
      for (let i = 0; i < meals; i++) {
        const input = document.getElementById(`${macro}_meal_${i}`);
        if (input) {
          input.addEventListener('input', calculateTotal);
        }
      }
      // Calcular el total inicial
      calculateTotal();
    });
  };

  /**
   * Maneja el envío del formulario.
   * @param {Event} event - El evento de envío del formulario.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true); // Mostrar spinner
    displayMessage('', 'hidden'); // Ocultar mensajes previos
    setTimeout(() => { // Simular tiempo de procesamiento
      calculateAndDisplayPortions();
      setIsLoading(false); // Ocultar spinner
    }, 500);
  };

  /**
   * Copia el contenido de la plantilla al portapapeles.
   */
  const copyTemplate = () => {
    const templateContent = document.getElementById('trackingTemplate').innerText;
    try {
      // Uso de la API Clipboard para copiar texto
      navigator.clipboard.writeText(templateContent)
        .then(() => {
          displayMessage('¡Plantilla copiada al portapapeles!', 'success');
        })
        .catch(err => {
          console.error('Error al copiar: ', err);
          displayMessage('No se pudo copiar la plantilla. Por favor, cópiala manualmente.', 'error');
        });
    } catch (err) {
      console.error('Fallback error al copiar: ', err);
      // Fallback para entornos donde navigator.clipboard.writeText no funcione
      const textarea = document.createElement('textarea');
      textarea.value = templateContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      displayMessage('¡Plantilla copiada al portapapeles (fallback)!', 'success');
    }
  };


  /**
   * Descarga la plantilla como un archivo de texto.
   */
  const downloadTemplate = () => {
    const templateContent = document.getElementById('trackingTemplate').innerText;
    const filename = `Plantilla_Seguimiento_PN_${name || 'Usuario'}_${new Date().toLocaleDateString('es-ES').replace(/\//g, '-')}.txt`;
    const blob = new Blob([templateContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    displayMessage('¡Plantilla descargada!', 'success');
  };

  // Renderizado del componente App
  return (
    <div className="bg-zinc-950 p-4 sm:p-8 font-['Inter']">
      {/* Superposición de carga */}
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex justify-center items-center z-50 transition-opacity duration-300">
          <div className="border-4 border-gray-200 border-l-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-zinc-900 p-6 sm:p-8 rounded-xl shadow-lg border border-zinc-700">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#e79c00] mb-6">Calculadora de Porciones PN</h1>
        <p className="text-center text-zinc-300 mb-8">
          Calcula tus porciones diarias recomendadas según el método de Precision Nutrition y genera una plantilla de seguimiento personalizada.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sección de Datos Personales */}
          <div className="md:col-span-2 bg-zinc-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-[#e79c00] mb-4">1. Datos Personales</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-100 mb-1">Nombre</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-zinc-700 rounded-md focus:ring-[#e79c00] focus:border-[#e79c00] bg-zinc-900 text-zinc-100" placeholder="Tu nombre" required />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-zinc-100 mb-1">Edad</label>
                <input type="number" id="age" value={age} onChange={(e) => setAge(e.target.value)}
                  className="w-full p-3 border border-zinc-700 rounded-md focus:ring-[#e79c00] focus:border-[#e79c00] bg-zinc-900 text-zinc-100" placeholder="Ej: 30" min="15" max="100" required />
              </div>
              <div>
                <label htmlFor="sex" className="block text-sm font-medium text-zinc-100 mb-1">Sexo</label>
                <select id="sex" value={sex} onChange={(e) => setSex(e.target.value)}
                  className="w-full p-3 border border-zinc-700 rounded-md focus:ring-[#e79c00] focus:border-[#e79c00] bg-zinc-900 text-zinc-100" required>
                  <option value="">Selecciona</option>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </select>
              </div>
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-zinc-100 mb-1">Peso (kg)</label>
                <input type="number" id="weight" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)}
                  className="w-full p-3 border border-zinc-700 rounded-md focus:ring-[#e79c00] focus:border-[#e79c00] bg-zinc-900 text-zinc-100" placeholder="Ej: 70.5" min="30" max="200" required />
              </div>
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-zinc-100 mb-1">Altura (cm)</label>
                <input type="number" id="height" value={height} onChange={(e) => setHeight(e.target.value)}
                  className="w-full p-3 border border-zinc-700 rounded-md focus:ring-[#e79c00] focus:border-[#e79c00] bg-zinc-900 text-zinc-100" placeholder="Ej: 175" min="100" max="250" required />
              </div>
              <div>
                <label htmlFor="goal" className="block text-sm font-medium text-zinc-100 mb-1">Objetivo</label>
                <select id="goal" value={goal} onChange={(e) => setGoal(e.target.value)}
                  className="w-full p-3 border border-zinc-700 rounded-md focus:ring-[#e79c00] focus:border-[#e79c00] bg-zinc-900 text-zinc-100" required>
                  <option value="">Selecciona tu objetivo</option>
                  <option value="fat_loss">Pérdida de Grasa</option>
                  <option value="muscle_gain">Ganancia Muscular</option>
                  <option value="health">Mejor Salud / Mantenimiento</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sección de Nivel de Actividad */}
          <div className="md:col-span-2 bg-zinc-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-[#e79c00] mb-4">2. Nivel de Actividad</h2>
            <div>
              <label htmlFor="activityLevel" className="block text-sm font-medium text-zinc-100 mb-1">Actividad Física Diaria</label>
              <select id="activityLevel" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full p-3 border border-zinc-700 rounded-md focus:ring-[#e79c00] focus:border-[#e79c00] bg-zinc-900 text-zinc-100" required>
                <option value="">Selecciona tu nivel</option>
                <option value="sedentary">Sedentario (poco o ningún ejercicio)</option>
                <option value="light">Actividad ligera (ejercicio ligero 1-3 días/semana)</option>
                <option value="moderate">Actividad moderada (ejercicio moderado 3-5 días/semana)</option>
                <option value="active">Activo (ejercicio intenso 6-7 días/semana)</option>
                <option value="very_active">Muy activo (ejercicio muy intenso diario, o trabajos físicos)</option>
              </select>
            </div>
            <div className="mt-4">
              <label htmlFor="mealsPerDay" className="block text-sm font-medium text-zinc-100 mb-1">Número de Comidas al Día</label>
              <input type="number" id="mealsPerDay" value={mealsPerDay} onChange={(e) => setMealsPerDay(e.target.value)}
                className="w-full p-3 border border-zinc-700 rounded-md focus:ring-[#e79c00] focus:border-[#e79c00] bg-zinc-900 text-zinc-100" placeholder="Ej: 3" min="2" max="6" required />
            </div>
            {/* Nuevo campo de preferencia de macronutrientes */}
            <div className="mt-4">
              <label htmlFor="macroPreference" className="block text-sm font-medium text-zinc-100 mb-1">Preferencia de Macronutrientes</label>
              <select id="macroPreference" value={macroPreference} onChange={(e) => setMacroPreference(e.target.value)}
                className="w-full p-3 border border-zinc-700 rounded-md focus:ring-[#e79c00] focus:border-[#e79c00] bg-zinc-900 text-zinc-100" required>
                <option value="">Selecciona tu preferencia</option>
                <option value="balanced">Balanceado</option>
                <option value="higher_carb">Más Carbohidratos</option>
                <option value="higher_fat">Más Grasas</option>
              </select>
            </div>
          </div>

          <button type="submit" className="md:col-span-2 bg-[#e79c00] text-white p-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all duration-300 shadow-md">
            Calcular Porciones y Generar Plantilla
          </button>
        </form>

        {/* Mensaje de Error/Información */}
        {message.type !== 'hidden' && (
          <div className={`mt-6 p-4 rounded-lg text-sm ${
            message.type === 'error' ? 'bg-red-900/20 text-red-300 border border-red-700' :
            message.type === 'success' ? 'bg-green-900/20 text-green-300 border border-green-700' :
            'bg-blue-900/20 text-blue-300 border border-blue-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Sección de Resultados */}
        {portionResults && (
          <div className="mt-10 bg-zinc-900 p-6 sm:p-8 rounded-xl border border-zinc-700 shadow-lg">
            <h2 className="text-2xl font-bold text-center text-[#e79c00] mb-6">Tus Porciones Diarias Recomendadas</h2>
            <div className="text-center text-zinc-100 text-lg mb-8">
              <p className="text-xl font-medium mb-4">¡Hola, <span className="text-[#e79c00] font-bold">{name}</span>! Aquí están tus porciones diarias recomendadas:</p>
              <ul className="list-disc list-inside space-y-2 max-w-sm mx-auto text-left">
                <li><span className="font-semibold">Proteína (palmas):</span> {portionResults.protein}</li>
                <li><span className="font-semibold">Carbohidratos (puñados):</span> {portionResults.carbs}</li>
                <li><span className="font-semibold">Vegetales (puños):</span> {portionResults.veggies}</li>
                <li><span className="font-semibold">Grasas (pulgares):</span> {portionResults.fats}</li>
              </ul>
              <p className="mt-4 text-sm text-zinc-400">Recuerda que estas son guías; ajusta según tu progreso y cómo te sientes.</p>
            </div>

            <h3 className="text-xl font-semibold text-zinc-100 mb-4">Plantilla de Seguimiento Personalizada</h3>
            {/* Usar dangerouslySetInnerHTML para renderizar el HTML de la plantilla */}
            <div id="trackingTemplate" className="border border-zinc-700 rounded-lg p-4 bg-zinc-800 overflow-x-auto" dangerouslySetInnerHTML={{ __html: trackingTemplateHtml }}>
            </div>

            <div className="flex flex-col sm:flex-row justify-center mt-6 gap-4">
              <button onClick={copyTemplate} className="bg-zinc-700 text-zinc-100 p-3 rounded-lg font-semibold hover:bg-zinc-600 transition-colors duration-200 shadow-sm">
                Copiar Plantilla
              </button>
              <button onClick={downloadTemplate} className="bg-[#e79c00] text-white p-3 rounded-lg font-semibold hover:opacity-90 transition-colors duration-200 shadow-sm">
                Descargar Plantilla (TXT)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
