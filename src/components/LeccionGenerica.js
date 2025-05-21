'use client';
import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import Confetti from 'react-confetti';

export default function LeccionGenerica({
  nombreLeccion,
  nombreVideo,
  preguntaCerrada,
  opcionesCerradas,
  respuestaCorrecta,
  preguntaBienestar,
  opcionesBienestar
}) {
  const [pantalla, setPantalla] = useState(1);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState('');
  const [respuestaCorrectaOK, setRespuestaCorrectaOK] = useState(false);
  const [respuestaBienestar, setRespuestaBienestar] = useState('');
  const [puntos, setPuntos] = useState(0);

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    if (guardado) {
      const celebracionAudio = new Audio('/sonidos/celebracion.mp3');
      celebracionAudio.play();
    }

    const savedNombre = localStorage.getItem('nombre');
    const savedCorreo = localStorage.getItem('correo');
    if (savedNombre) setNombre(savedNombre);
    if (savedCorreo) setCorreo(savedCorreo);
  }, [guardado]);

  const manejarFinVideo = () => {
    setPuntos((prev) => prev + 5);
    setPantalla(2);
  };

  const manejarRespuesta = (opcion) => {
    setRespuestaSeleccionada(opcion);
    if (opcion === respuestaCorrecta && !respuestaCorrectaOK) {
      setRespuestaCorrectaOK(true);
      setPuntos((prev) => prev + 2);
      setPantalla(5);
    }
  };

  const manejarBienestar = (opcion) => {
    setRespuestaBienestar(opcion);
    setPuntos((prev) => prev + 3);
    setPantalla(4);
  };

  const manejarEnvioFinal = () => {
    localStorage.setItem('nombre', nombre);
    localStorage.setItem('correo', correo);
    console.log({ nombre, correo, leccion: nombreLeccion, respuesta: respuestaSeleccionada, bienestar: respuestaBienestar, puntos });
    setGuardado(true);
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-left">
      <h1 className="text-2xl font-bold mb-4" style={{ color: '#e79c00' }}>
        Lección: {nombreLeccion.replace(/-/g, ' ').toUpperCase()}
      </h1>

      {pantalla === 1 && (
        <ReactPlayer
          url={`/videos/${nombreVideo}`}
          controls
          width="100%"
          onEnded={manejarFinVideo}
        />
      )}

      {pantalla === 2 && (
        <div className="mt-8 space-y-4">
          <p className="font-semibold text-lg" style={{ color: '#4b5563' }}>
            🎉 ¡Has ganado 5 puntos! ¿Vamos por más?
          </p>
          <button
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: '#e79c00' }}
            onClick={() => setPantalla(3)}
          >
            Sigue sumando 🔓
          </button>
        </div>
      )}

      {pantalla === 3 && (
        <div className="mt-8 space-y-4 text-black">
          <h2 className="text-lg font-semibold" style={{ color: '#e79c00' }}>{preguntaCerrada}</h2>
          <div className="grid gap-2">
            {opcionesCerradas.map((op) => (
              <button
                key={op}
                onClick={() => manejarRespuesta(op)}
                className="bg-[#f4deb7] hover:bg-[#e79c00] px-4 py-2 rounded text-left"
              >
                {op}
              </button>
            ))}
          </div>
        </div>
      )}

      {pantalla === 5 && (
        <div className="mt-8 space-y-4 text-black">
          <h2 className="text-lg font-semibold" style={{ color: '#e79c00' }}>{preguntaBienestar}</h2>
          <div className="grid gap-2">
            {opcionesBienestar.map((op) => (
              <button
                key={op}
                onClick={() => manejarBienestar(op)}
                className="bg-[#f4f1ec] hover:bg-[#f4deb7] px-4 py-2 rounded text-left"
              >
                {op}
              </button>
            ))}
          </div>
        </div>
      )}

      {pantalla === 4 && (
        <div className="mt-8 p-4 rounded text-black bg-[#f4deb7]">
          <p className="text-xl font-bold animate-bounce mb-3" style={{ color: '#e79c00' }}>
            🏅 ¡Desafío completado!
          </p>
          <p className="text-md mb-4" style={{ color: '#374151' }}>
            Guarda tus puntos para el ranking y futuras misiones. 👇
          </p>

          {guardado && <Confetti />}

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
              Guardar mis puntos en mi bolsa 🧺
            </button>
          ) : (
            <p className="mt-2 font-semibold text-green-700">
              ✅ Tus respuestas fueron guardadas. ¡Gracias!
            </p>
          )}
        </div>
      )}

      <div className="mt-6 p-4 rounded text-center" style={{ backgroundColor: '#f4f1ec' }}>
        <h3 className="text-xl font-bold" style={{ color: '#e79c00' }}>
          🎯 Puntaje total acumulado: {puntos} puntos
        </h3>
      </div>
    </div>
  );
}
