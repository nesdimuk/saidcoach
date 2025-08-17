export default function Leccion6() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        🎧 Lección 6 – El estrés pide movimiento, no solo descanso
      </h1>

      <div className="w-full max-w-2xl aspect-video mb-6">
        <iframe
          className="w-full h-full rounded-2xl shadow-lg"
          src="https://www.youtube.com/embed/WOszzxK8MIA"
          title="Lección 6"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <p className="text-lg text-gray-700 mb-6 text-center max-w-2xl">
        ¿Te sientes abrumado y solo quieres acostarte?  
        A veces lo que más te ayuda no es parar, sino moverte.  
        Caminar, estirar, respirar hondo libera tensión acumulada.  
        Hoy, haz una pausa activa de 2 minutos. Tu mente también necesita moverse.
      </p>

      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSeJEV7qv8_mtkJrbQmfSECNyNprBPBCuUzrWs0CaUQQsnnong/viewform"
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition"
      >
        Responder Formulario
      </a>
    </div>
  );
}
