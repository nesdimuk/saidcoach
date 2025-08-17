export default function Leccion6() {
  return (
    // Contenedor principal con fondo gris.
    // MODIFICADO: 'px-4 py-6' para menor padding en móviles, y 'sm:p-6' para más padding en pantallas más grandes.
    <div className="bg-gray-100 min-h-screen px-4 py-6 sm:p-6">
      {/* Contenedor central de contenido. */}
      {/* MODIFICADO: 'w-full' para ocupar todo el ancho en móviles, 'md:max-w-5xl' para limitar en pantallas medianas y grandes. */}
      <div className="w-full md:max-w-5xl mx-auto space-y-6">
        {/* Título de la lección. */}
        <h1 className="text-3xl font-bold text-center text-[#e79900]">Lección 6</h1>

        {/* Contenedor del video: mantiene la relación de aspecto 16:9 y ocupa todo el ancho disponible. */}
        <div className="aspect-video">
          {/* Iframe del video de YouTube. */}
          <iframe
            className="w-full h-full rounded-xl shadow-lg"
            src="https://www.youtube.com/embed/WOszzxK8MIA"
            title="Lección 6 – El estrés pide movimiento, no solo descanso"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Sección del formulario. */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-2 text-[#e79900]">📝 Responde y suma puntos</h2>
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLScUawe_DbPq10NBMMvzbKN0pU1C8lh1K-lMqzp4m0rpNG1Flg/viewform?embedded=true"
            width="100%"
            height="750" // Altura del formulario, se mantiene igual ya que es razonable.
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            className="rounded-xl shadow"
            title="Formulario Lección 6"
          >
            Cargando…
          </iframe>
        </div>

        {/* Pie de página. */}
        <div className="text-center pt-4 text-sm text-gray-500">
          © {new Date().getFullYear()} SaidCoach · Todos los derechos reservados
        </div>
      </div>
    </div>
  );
}


