import React, { useState } from 'react';
import { CheckCircle, Brain, MessageCircle, Camera, TrendingUp, Award, ArrowRight, RefreshCw } from 'lucide-react';

const TrainerIATest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);

  const questions = [
    {
      id: 1,
      category: "perfil",
      question: "¿Cuál describe mejor tu perfil como entrenador?",
      options: [
        { text: "Emprendedor digital (redes sociales, contenido)", value: "emprendedor", points: { claude: 3, chatgpt: 2, gemini: 1 } },
        { text: "Técnico especializado (programación, ciencia)", value: "tecnico", points: { chatgpt: 3, claude: 2, gemini: 1 } },
        { text: "Coach personal (seguimiento, motivación)", value: "coach", points: { chatgpt: 3, claude: 1, gemini: 2 } },
        { text: "Versátil (un poco de todo)", value: "versatil", points: { chatgpt: 2, claude: 2, gemini: 2 } }
      ]
    },
    {
      id: 2,
      category: "contenido",
      question: "¿Qué tipo de contenido creas más frecuentemente?",
      options: [
        { text: "Posts para redes sociales e Instagram", value: "social", points: { claude: 3, chatgpt: 2, gemini: 1 } },
        { text: "Artículos técnicos y blogs", value: "blog", points: { chatgpt: 3, claude: 2, gemini: 1 } },
        { text: "Videos y contenido audiovisual", value: "video", points: { chatgpt: 2, gemini: 2, claude: 1 } },
        { text: "Poco contenido, me enfoco en entrenar", value: "poco", points: { gemini: 2, chatgpt: 2, claude: 1 } }
      ]
    },
    {
      id: 3,
      category: "rutinas",
      question: "¿Cómo prefieres crear las rutinas de entrenamiento?",
      options: [
        { text: "Detalladas con progresiones específicas", value: "detallada", points: { claude: 3, chatgpt: 2, gemini: 1 } },
        { text: "Basadas en ciencia y estudios recientes", value: "cientifica", points: { chatgpt: 3, claude: 2, gemini: 1 } },
        { text: "Simples y fáciles de seguir", value: "simple", points: { gemini: 3, claude: 2, chatgpt: 1 } },
        { text: "Personalizadas según conversaciones previas", value: "personalizada", points: { chatgpt: 3, claude: 1, gemini: 2 } }
      ]
    },
    {
      id: 4,
      category: "comunicacion",
      question: "¿Qué valoras más en la comunicación con tus clientes?",
      options: [
        { text: "Recordar conversaciones y progresos anteriores", value: "memoria", points: { chatgpt: 3, claude: 1, gemini: 2 } },
        { text: "Respuestas bien estructuradas y claras", value: "estructura", points: { claude: 3, chatgpt: 2, gemini: 1 } },
        { text: "Información actualizada y precisa", value: "actualizada", points: { chatgpt: 3, gemini: 2, claude: 1 } },
        { text: "Comunicación directa y sencilla", value: "directa", points: { gemini: 3, claude: 2, chatgpt: 1 } }
      ]
    },
    {
      id: 5,
      category: "herramientas",
      question: "¿Qué funcionalidades adicionales usarías más?",
      options: [
        { text: "Generación de imágenes para contenido", value: "imagenes", points: { chatgpt: 3, gemini: 2, claude: 0 } },
        { text: "Chat de voz para consultas rápidas", value: "voz", points: { chatgpt: 3, gemini: 2, claude: 0 } },
        { text: "Análisis de documentos y archivos", value: "archivos", points: { claude: 3, chatgpt: 2, gemini: 2 } },
        { text: "Solo necesito texto, nada más", value: "texto", points: { claude: 2, chatgpt: 2, gemini: 2 } }
      ]
    },
    {
      id: 6,
      category: "investigacion",
      question: "¿Con qué frecuencia necesitas investigar información actualizada?",
      options: [
        { text: "Diariamente (tendencias, estudios nuevos)", value: "diario", points: { chatgpt: 3, gemini: 2, claude: 1 } },
        { text: "Semanalmente para contenido", value: "semanal", points: { chatgpt: 2, gemini: 2, claude: 2 } },
        { text: "Ocasionalmente para casos específicos", value: "ocasional", points: { claude: 2, chatgpt: 2, gemini: 2 } },
        { text: "Raramente, uso mi conocimiento", value: "raro", points: { claude: 3, chatgpt: 1, gemini: 2 } }
      ]
    },
    {
      id: 7,
      category: "presupuesto",
      question: "¿Cuál es tu presupuesto mensual para herramientas de IA?",
      options: [
        { text: "Prefiero opciones gratuitas", value: "gratis", points: { gemini: 3, chatgpt: 2, claude: 2 } },
        { text: "$10-20 USD por mes", value: "bajo", points: { chatgpt: 2, claude: 2, gemini: 3 } },
        { text: "$20-50 USD por mes", value: "medio", points: { chatgpt: 3, claude: 3, gemini: 2 } },
        { text: "Más de $50 USD si vale la pena", value: "alto", points: { chatgpt: 3, claude: 3, gemini: 1 } }
      ]
    }
  ];

  const handleAnswer = (option) => {
    const newAnswers = { ...answers, [currentQuestion]: option };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers) => {
    const scores = { chatgpt: 0, claude: 0, gemini: 0 };
    
    Object.values(finalAnswers).forEach(answer => {
      scores.chatgpt += answer.points.chatgpt;
      scores.claude += answer.points.claude;
      scores.gemini += answer.points.gemini;
    });

    const maxScore = Math.max(scores.chatgpt, scores.claude, scores.gemini);
    let winner = '';
    
    if (scores.chatgpt === maxScore) winner = 'chatgpt';
    else if (scores.claude === maxScore) winner = 'claude';
    else winner = 'gemini';

    const resultData = {
      winner,
      scores,
      totalQuestions: questions.length
    };

    setResult(resultData);
    setShowResult(true);
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setResult(null);
  };

  const getResultContent = () => {
    if (!result) return null;

    const { winner, scores } = result;

    const results = {
      chatgpt: {
        name: "ChatGPT",
        icon: "🤖",
        color: "bg-green-500",
        description: "La opción más versátil y actualizada",
        strengths: [
          "Excelente memoria conversacional",
          "Investigación profunda y actualizada",
          "Generación de imágenes incluida",
          "Chat de voz disponible",
          "Ideal para seguimiento de clientes"
        ],
        bestFor: "Entrenadores que necesitan versatilidad, investigación constante y seguimiento personalizado de clientes.",
        pricing: "Desde $20/mes (ChatGPT Plus)"
      },
      claude: {
        name: "Claude",
        icon: "🧠",
        color: "bg-blue-500",
        description: "El especialista en contenido y programación",
        strengths: [
          "Rutinas detalladas con progresiones",
          "Excelente para contenido de redes",
          "Respuestas muy bien estructuradas",
          "Análisis profundo de documentos",
          "Ideal para creación de contenido"
        ],
        bestFor: "Entrenadores emprendedores que crean mucho contenido y necesitan programas detallados.",
        pricing: "Desde $20/mes (Claude Pro)"
      },
      gemini: {
        name: "Gemini",
        icon: "⭐",
        color: "bg-purple-500",
        description: "La opción equilibrada y económica",
        strengths: [
          "Buena relación calidad-precio",
          "Integración con Google Workspace",
          "Interfaz simple y directa",
          "Ideal para uso básico-intermedio",
          "Actualizaciones constantes"
        ],
        bestFor: "Entrenadores que buscan una solución equilibrada sin muchas complicaciones.",
        pricing: "Gratis con límites / $20/mes (Gemini Advanced)"
      }
    };

    return results[winner];
  };

  if (showResult) {
    const resultContent = getResultContent();
    const { scores } = result;

    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{resultContent.icon}</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            ¡Tu IA recomendada es {resultContent.name}!
          </h2>
          <p className="text-lg text-gray-600">{resultContent.description}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{scores.chatgpt}</div>
            <div className="text-sm text-gray-600">ChatGPT</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{scores.claude}</div>
            <div className="text-sm text-gray-600">Claude</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{scores.gemini}</div>
            <div className="text-sm text-gray-600">Gemini</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Award className="mr-2 text-yellow-500" />
              Principales Fortalezas
            </h3>
            <ul className="space-y-2">
              {resultContent.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <TrendingUp className="mr-2 text-blue-500" />
              Ideal Para Ti Porque
            </h3>
            <p className="text-gray-700 mb-6">{resultContent.bestFor}</p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">💰 Precio</h4>
              <p className="text-blue-700">{resultContent.pricing}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
          <h3 className="font-bold text-yellow-800 mb-2">💡 Recomendación Extra</h3>
          <p className="text-yellow-700">
            Considera probar la versión gratuita de tu IA recomendada por unos días. 
            Muchos entrenadores exitosos también combinan 2 IAs: una principal para el trabajo diario 
            y otra secundaria para tareas específicas.
          </p>
        </div>

        <div className="text-center space-x-4">
          <button
            onClick={resetTest}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Volver a hacer el test
          </button>
          <button
            onClick={() => window.open(`https://${resultContent.name.toLowerCase()}.com`, '_blank')}
            className={`${resultContent.color} hover:opacity-90 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center`}
          >
            Probar {resultContent.name}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Test: ¿Qué IA es Mejor Para Ti?
          </h1>
          <span className="text-sm text-gray-500">
            {currentQuestion + 1} de {questions.length}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {questions[currentQuestion].question}
        </h2>

        <div className="space-y-3">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:border-blue-500"
            >
              <div className="flex items-center">
                <div className="w-6 h-6 border-2 border-gray-300 rounded-full mr-3 flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100"></div>
                </div>
                <span className="text-gray-700 font-medium">{option.text}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Completando tu perfil de entrenador...</span>
        <div className="flex space-x-1">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index <= currentQuestion ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainerIATest;