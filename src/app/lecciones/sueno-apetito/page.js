'use client';
import { useState } from 'react';
import ReactPlayer from 'react-player';
import Confetti from 'react-confetti';

export default function SuenoApetito() {
  // Configuración
  const nombreLeccion = 'sueno-apetito';
  const nombreVideo = 'sueno_apetito.mp4';
  const preguntaCerrada = '¿Qué ocurre cuando no duermes?';
  const opciones = [
    'Amaneces tranquilo',
    'Tienes poco apetito',
    'No ocurre nada',
    'Aumenta tu apetito'
  ];
  const respuestaCorrecta = 'Aumenta tu apetito';
  const preguntaAbierta = '¿Qué te hizo pensar esta lección sobre tu bienestar en el trabajo o fuera de él?';

  // Estados
  const [videoTerminado, setVideoTerminado] = useState(false);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState('');
  const [respuestaCorrectaOK, setRespuestaCorrectaOK] = useState(false);
  const [comentario, setComentario] = useState('');
  const [comentarioEnviado, setComentarioEnviado] = useState(false);

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [puntos, setPuntos] = useState(0);
  const [guardado, setGuardado] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Lógica
  const manejarFinVideo = () => {
    setPuntos((prev) => prev + 5);
    setVideoTerminado(true);
  };

  const manejarRespuesta = (opcion) => {
    setRespuestaSeleccionada(opcion);
    if (opcion === respuestaCorrecta && !respuestaCorrectaOK) {
      setRespuestaCorrectaOK(true);
      setPuntos((prev) => prev + 2);
      setFeedback('✅ ¡Correcto!');
    } else if (!respuestaCorrectaOK) {
      setFeedback('❌ Incorrecto. Intenta nuevamente.');
    }
  };

  const manejarComentario = () => {
    if (comentario.trim().length > 3 && !comentarioEnviado) {
      setComentarioEnviado(true);
      setPuntos((prev) => prev + 3);
    }
  };

  const manejarEnvioFinal = async () => {
    // Supabase se conecta aquí después
    console.log({
      nombre,
      correo,
      leccion: nombreLeccion,
      respuesta: respuestaSeleccionada,
      comentario,
      puntos
    });
    setGuardado(true);
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-left">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Lección: Sueño y Apetito</h1>

      <ReactPlayer
        url={`/videos/${nombreVideo}`}
        controls
        width="100%"
        onEnded={manejarFinVideo}
      />

      {videoTerminado && (
        <div className="mt-8 space-y-6">
          <div>
            <h2 className="font-semibold text-gray-800 mb-2">{`1. ${preguntaCerrada}`}</h2>
            <div className="grid gap-2">
              {opciones.map((op) => (
                <button
                  key={op}
                  onClick={() => manejarRespuesta(op)}
                  className="bg-gray-100 hover:bg-blue-200 px-4 py-2 rounded text-left text-gray-900"
                >
                  {op}
                </button>
              ))}
            </div>
            <p className="mt-2 text-md font-medium text-gray-700">{feedback}</p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-800 mb-2">2. {preguntaAbierta}</h2>
            <textarea
              rows={4}
              className="w-full border p-2 rounded text-gray-800"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Tu reflexión..."
            />
            {!comentarioEnviado && (
              <button
                className="bg-green-500 text-white px-4 py-2 mt-2 rounded"
                onClick={manejarComentario}
              >
                Enviar comentario
              </button>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-semibold mb-2 text-gray-800">¿Quieres sumar tus puntos y guardar tu avance?</h3>
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
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={manejarEnvioFinal}
              >
                Guardar y sumar puntos
              </button>
            ) : (
              <p className="mt-2 text-green-700 font-semibold">
                ✅ Tus respuestas fueron guardadas. ¡Gracias!
              </p>
            )}
          </div>

          <div className="mt-6 p-4 bg-green-100 rounded text-center">
            <h3 className="text-xl font-bold text-green-900">🎯 Puntaje total acumulado: {puntos} puntos</h3>
          </div>
        </div>
      )}

      {guardado && <Confetti />}
    </div>
  );
}

