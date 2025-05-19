'use client';
import { useState } from 'react';
import ReactPlayer from 'react-player';
import Confetti from 'react-confetti';

export default function SuenoApetito() {
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
    console.log({ nombre, correo, leccion: nombreLeccion, respuesta: respuestaSeleccionada, comentario, puntos });
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

      {videoTerminado && (
        <div className="mt-8 space-y-6 text-black">
          <div className="bg-[#f4deb7] p-4 rounded">
            <p className="font-semibold">🎉 ¡Has ganado 5 puntos solo por ver este video!</p>
            <p className="mt-1">¿Quieres ganar 2 puntos más? Responde esta pregunta:</p>
          </div>

          <div>
            <h2 className="font-semibold mb-2">1. {preguntaCerrada}</h2>
            <div className="grid gap-2">
              {opciones.map((op) => (
                <button
                  key={op}
                  onClick={() => manejarRespuesta(op)}
                  className="bg-[#f4deb7] hover:bg-[#e79c00] px-4 py-2 rounded text-left"
                >
                  {op}
                </button>
              ))}
            </div>
            <p className="mt-2 text-md font-medium">{feedback}</p>
          </div>

          {respuestaCorrectaOK && (
            <div>
              <div className="bg-[#f4f1ec] p-4 rounded">
                <p className="font-semibold">🌟 ¡Bien hecho! ¿Te animas a llegar al puntaje perfecto (10 puntos)?</p>
                <p className="mt-1">Solo falta una reflexión corta:</p>
              </div>

              <h2 className="font-semibold mt-4 mb-2">2. {preguntaAbierta}</h2>
              <textarea
                rows={4}
                className="w-full border p-2 rounded"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Tu reflexión..."
                style={{ backgroundColor: '#f4f1ec', color: '#000' }}
              />
              {!comentarioEnviado && (
                <button
                  className="px-4 py-2 mt-2 rounded text-white"
                  style={{ backgroundColor: '#e79c00' }}
                  onClick={manejarComentario}
                >
                  Enviar comentario
                </button>
              )}
            </div>
          )}

          {comentarioEnviado && (
            <div className="p-4 rounded" style={{ backgroundColor: '#f4deb7' }}>
              <p className="font-semibold">🎯 ¡Perfecto! Has alcanzado los 10 puntos.</p>
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

          <div className="mt-6 p-4 rounded text-center" style={{ backgroundColor: '#f4f1ec' }}>
            <h3 className="text-xl font-bold text-black">
              🎯 Puntaje total acumulado: {puntos} puntos
            </h3>
          </div>
        </div>
      )}

      {guardado && <Confetti />}
    </div>
  );
}


