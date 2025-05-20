'use client';
import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import Confetti from 'react-confetti';

export default function SuenoApetito() {
  const nombreLeccion = 'sueno-apetito';
  const nombreVideo = 'sueno_apetito.mp4';

  const preguntaCerrada = '¿Qué ocurre cuando duermes poco?';
  const opciones = [
    'Amaneces tranquilo',
    'Tienes poco apetito',
    'No ocurre nada',
    'Aumenta tu apetito'
  ];
  const respuestaCorrecta = 'Aumenta tu apetito';

  const preguntaBienestar = '¿Cómo crees que estás manejando tu descanso actualmente?';
  const opcionesBienestar = [
    'Duermo bien y despierto con energía',
    'Duermo poco pero no me afecta mucho',
    'Siento que necesito mejorar mis hábitos de sueño',
    'Mi descanso está muy deteriorado, debo hacer cambios ya'
  ];

  const [videoTerminado, setVideoTerminado] = useState(false);
  const [mostrarPregunta1, setMostrarPregunta1] = useState(false);
  const [mostrarPregunta2, setMostrarPregunta2] = useState(false);

  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState('');
  const [respuestaCorrectaOK, setRespuestaCorrectaOK] = useState(false);
  const [respuestaBienestar, setRespuestaBienestar] = useState('');
  const [bienestarEnviado, setBienestarEnviado] = useState(false);

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [puntos, setPuntos] = useState(0);
  const [guardado, setGuardado] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const savedNombre = localStorage.getItem('nombre');
    const savedCorreo = localStorage.getItem('correo');
    if (savedNombre) setNombre(savedNombre);
    if (savedCorreo) setCorreo(savedCorreo);
  }, []);

  const manejarFinVideo = () => {
    setPuntos((prev) => prev + 5);
    setVideoTerminado(true);
  };

  const manejarRespuesta = (opcion) => {
    setRespuestaSeleccionada(opcion);
    if (opcion === respuestaCorrecta && !respuestaCorrectaOK) {
      setRespuestaCorrectaOK(true);
      setPuntos((prev) => prev + 2);
      setFeedback('✅ ¡Correcto! Ya llevas 7 puntos.');
      setMostrarPregunta2(true);
    } else if (!respuestaCorrectaOK) {
      setFeedback('❌ Incorrecto. Intenta nuevamente.');
    }
  };

  const manejarBienestar = () => {
    if (respuestaBienestar && !bienestarEnviado) {
      setBienestarEnviado(true);
      setPuntos((prev) => prev + 3);
    }
  };

  const manejarEnvioFinal = async () => {
    localStorage.setItem('nombre', nombre);
    localStorage.setItem('correo', correo);
    console.log({ nombre, correo, leccion: nombreLeccion, respuesta: respuestaSeleccionada, bienestar: respuestaBienestar, puntos });
    setGuardado(true);
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-left">
      <h1 className="text-2xl font-bold mb-4" style={{ color: '#e79c00' }}>
        Lección: Sueño y Apetito
      </h1>

      <ReactPlayer
        url={`/videos/${nombreVideo}`}
        controls
        width="100%"
        onEnded={manejarFinVideo}
      />

      {videoTerminado && !mostrarPregunta1 && (
        <div className="mt-8 space-y-6 text-black bg-[#f4deb7] p-4 rounded">
          <p className="font-semibold">🎉 ¡Has ganado 5 puntos solo por ver este video! ¡Buen comienzo! 🚀</p>
          <p className="mt-1">Presiona continuar para intentar ganar 2 puntos más. 💡</p>
          <button
            onClick={() => setMostrarPregunta1(true)}
            className="px-4 py-2 mt-2 rounded text-white"
            style={{ backgroundColor: '#e79c00' }}
          >
            Continuar
          </button>
        </div>
      )}

      {mostrarPregunta1 && (
        <div className="mt-8 space-y-6 text-black">
          <div>
            <h2 className="font-semibold mb-2" style={{ color: '#e79c00' }}>1. {preguntaCerrada}</h2>
            <div className="grid gap-2">
              {opciones.map((op) => (
                <button
                  key={op}
                  onClick={() => manejarRespuesta(op)}
                  className="bg-[#f4deb7] hover:bg-[#e79c00] px-4 py-2 rounded text-left text-black"
                >
                  {op}
                </button>
              ))}
            </div>
            <p className="mt-2 text-md font-medium">{feedback}</p>
          </div>
        </div>
      )}

      {mostrarPregunta2 && (
        <div className="mt-8 space-y-6 text-black">
          <div className="bg-[#f4f1ec] p-4 rounded">
            <p className="font-semibold">🌟 ¡Estás a punto de lograr el puntaje perfecto! 🏆</p>
            <p className="mt-1">Solo una última pregunta y habrás completado el desafío. 🔥</p>
          </div>

          <h2 className="font-semibold mt-4 mb-2" style={{ color: '#e79c00' }}>2. {preguntaBienestar}</h2>
          <div className="grid gap-2">
            {opcionesBienestar.map((op) => (
              <button
                key={op}
                onClick={() => setRespuestaBienestar(op)}
                className={`px-4 py-2 rounded text-left text-black ${respuestaBienestar === op ? 'bg-[#e79c00] text-white' : 'bg-[#f4f1ec] hover:bg-[#f4deb7]'}`}
              >
                {op}
              </button>
            ))}
          </div>
          {!bienestarEnviado && respuestaBienestar && (
            <button
              className="px-4 py-2 mt-3 rounded text-white"
              style={{ backgroundColor: '#e79c00' }}
              onClick={manejarBienestar}
            >
              Enviar respuesta
            </button>
          )}
        </div>
      )}

      {bienestarEnviado && (
        <div className="mt-8 p-4 rounded text-black" style={{ backgroundColor: '#f4deb7' }}>
          <p className="font-semibold">🎯 ¡Perfecto! Has alcanzado los 10 puntos y completado el desafío. 🥇</p>
          <p className="mt-1">Puedes dejar tu nombre y correo si deseas guardar tu avance.</p>

          <input
            type="text"
            className="border p-2 mb-2 w-full rounded"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre completo"
          />
          <input
            type="email"
            className="border p-2 mb-2 w-full rounded"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="Correo electrónico"
          />

          {!guardado ? (
            <button
              className="text-white px-4 py-2 rounded"
              style={{ backgroundColor: '#e79c00' }}
              onClick={manejarEnvioFinal}
            >
              Guardar mi resultado
            </button>
          ) : (
            <p className="mt-2 font-semibold text-green-700">
              ✅ Tus respuestas fueron guardadas. ¡Gracias!
            </p>
          )}
        </div>
      )}

      {(videoTerminado || mostrarPregunta2) && (
        <div className="mt-6 p-4 rounded text-center" style={{ backgroundColor: '#f4f1ec' }}>
          <h3 className="text-xl font-bold" style={{ color: '#e79c00' }}>
            🎯 Puntaje total acumulado: {puntos} puntos
          </h3>
        </div>
      )}

      {guardado && <Confetti />}
    </div>
  );
}






