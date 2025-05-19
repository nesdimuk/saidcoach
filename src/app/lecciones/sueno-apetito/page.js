'use client';
import { useState } from 'react';
import ReactPlayer from 'react-player';
import Confetti from 'react-confetti';

export default function SuenioApetito() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [formularioListo, setFormularioListo] = useState(false);

  const [videoTerminado, setVideoTerminado] = useState(false);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState(false);
  const [comentario, setComentario] = useState('');
  const [comentarioEnviado, setComentarioEnviado] = useState(false);
  const [puntos, setPuntos] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [guardado, setGuardado] = useState(false);

  const opciones = [
    'Amaneces tranquilo',
    'Tienes poco apetito',
    'No ocurre nada',
    'Aumenta tu apetito'
  ];
  const respuestaCorrectaTexto = 'Aumenta tu apetito';

  const iniciarLeccion = () => {
    if (nombre.trim() !== '' && correo.includes('@')) {
      setFormularioListo(true);
    } else {
      alert("Por favor ingresa un nombre válido y un correo válido.");
    }
  };

  const sumarPuntos = (cantidad) => setPuntos((prev) => prev + cantidad);

  const manejarFinVideo = () => {
    if (!videoTerminado) {
      sumarPuntos(5);
      setVideoTerminado(true);
    }
  };

  const manejarRespuesta = (opcion) => {
    if (opcion === respuestaCorrectaTexto && !respuestaCorrecta) {
      setFeedback('✅ ¡Correcto!');
      setRespuestaCorrecta(true);
      sumarPuntos(2);
    } else if (!respuestaCorrecta) {
      setFeedback('❌ Incorrecto. Intenta nuevamente.');
    }
  };

  const manejarComentario = () => {
    if (comentario.trim().length > 3 && !comentarioEnviado) {
      setComentarioEnviado(true);
      sumarPuntos(3);
    }
  };

  const manejarEnvioFinal = async () => {
    // Aquí conectaremos Supabase luego
    setGuardado(true);
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Lección: Sueño y Apetito</h1>

      {!formularioListo && (
        <div className="mb-6">
          <p className="mb-2">Ingresa tus datos para comenzar:</p>
          <input
            type="text"
            className="border p-2 w-full mb-2 rounded"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre completo"
          />
          <input
            type="email"
            className="border p-2 w-full mb-2 rounded"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="Correo electrónico"
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={iniciarLeccion}
          >
            Comenzar lección
          </button>
        </div>
      )}

      {formularioListo && (
        <>
          <ReactPlayer
            url="/videos/sueno_apetito.mp4"
            controls
            width="100%"
            onEnded={manejarFinVideo}
          />

          {videoTerminado && (
            <div className="mt-8 text-left">
              <h2 className="font-semibold mb-2">1. ¿Qué ocurre cuando no duermes?</h2>
              <div className="grid gap-2">
                {opciones.map((op) => (
                  <button
                    key={op}
                    onClick={() => manejarRespuesta(op)}
                    className="bg-gray-100 hover:bg-blue-200 px-4 py-2 rounded text-left"
                  >
                    {op}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-lg">{feedback}</p>

              {respuestaCorrecta && (
                <>
                  <div className="mt-6">
                    <h2 className="font-semibold mb-2">
                      2. ¿Hay algo que esta lección te hizo pensar sobre tu bienestar en el trabajo o fuera de él?
                    </h2>
                    <textarea
                      rows={4}
                      className="w-full border p-2 rounded"
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

                  {comentarioEnviado && (
                    <div className="mt-6 p-4 bg-green-100 rounded">
                      <h3 className="text-xl font-bold">¡Gracias por compartir!</h3>
                      <p>
                        🎯 Puntaje total: <strong>{puntos}</strong> puntos.
                      </p>

                      {!guardado && (
                        <button
                          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
                          onClick={manejarEnvioFinal}
                        >
                          Finalizar y guardar
                        </button>
                      )}

                      {guardado && (
                        <p className="mt-4 text-green-700 font-semibold">
                          ✅ Tus respuestas fueron guardadas. ¡Gracias por participar!
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}

      {guardado && <Confetti />}
    </div>
  );
}

