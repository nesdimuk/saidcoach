export default function Leccion6() {
  return (
    // Contenedor principal con fondo gris y padding.
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Contenedor central de contenido. Cambiado de max-w-4xl a max-w-5xl para más espacio. */}
      <div className="max-w-5xl mx-auto space-y-6"> {/* MODIFICADO: Aumentado el ancho máximo */}
        {/* Título de la lección. */}
        <h1 className="text-3xl font-bold text-center text-[#e79e00]">Lección 6</h1>

        {/* Contenedor del video: mantiene la relación de aspecto 16:9. */}
        <div className="aspect-video">
          {/* Iframe del video de YouTube. */}
          <iframe
            // MODIFICADO: Eliminado 'h-[500px]' y asegurado 'h-full'
            // Esto permite que el video se adapte completamente a la altura del contenedor 'aspect-video'
            // que a su vez escala con el ancho disponible.
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
          <h2 className="text-xl font-semibold mb-2 text-[#e79e00]">📝 Responde y suma puntos</h2>
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

