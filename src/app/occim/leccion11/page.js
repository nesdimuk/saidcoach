export default function Leccion11() {
  return (
    // Contenedor principal con fondo gris y padding responsivo.
    // 'px-4 py-6' para menor padding lateral en móviles (16px), y 'sm:p-6' para más padding en pantallas grandes.
    <div className="bg-gray-100 min-h-screen px-4 py-6 sm:p-6">
      {/* Contenedor central de contenido con más espaciado vertical. */}
      <div className="w-full mx-auto space-y-8">
        {/* Título de la lección. */}
        <h1 className="text-3xl font-bold text-center text-[#e79e00]">🎧 Lección 11 – La mejor inversión es en ti mismo</h1>

        {/* Contenedor del video. */}
        <div className="w-full">
          <div
            // Clases de Tailwind para alturas responsivas del contenedor del video.
            // Estas alturas están ajustadas para que el video vertical (Short) se vea más grande.
            className="w-full h-[400px] sm:h-[500px] md:h-[600px] rounded-xl shadow-lg overflow-hidden bg-black"
          >
            {/* Iframe del video de YouTube para la Lección 11. */}
            <iframe
              className="w-full h-full" // El iframe llenará el 100% del ancho y alto de su contenedor padre.
              src="https://www.youtube.com/embed/29zz3niaZo8" // URL del YouTube Short de la Lección 11
              title="Lección 11 – La mejor inversión es en ti mismo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Sección del formulario. */}
        <div className="border-t pt-8 mt-8">
          <h2 className="text-xl font-semibold mb-6 text-[#e79e00]">📝 Responde y suma puntos</h2>

          {/* Contenedor del formulario con alturas fijas responsivas. */}
          <div className="w-full h-[450px] sm:h-[550px] md:h-[650px] rounded-xl overflow-hidden shadow border">
            {/* Iframe del formulario de Google Forms para la Lección 11. */}
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSdqEt9Zajq55YrVctMVHtfEIZfciHzpaTuYUOjdohGIoweYRw/viewform?usp=dialog&embedded=true" // URL de tu formulario de Lección 11
              width="100%"
              height="100%" // Asegura que el iframe ocupe todo el espacio de su div padre con altura controlada.
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
              title="Formulario Lección 11"
              className="w-full h-full"
            >
              Cargando…
            </iframe>
          </div>
        </div>

        {/* Pie de página. */}
        <div className="text-center pt-4 text-sm text-gray-500">
          © {new Date().getFullYear()} SaidCoach · Todos los derechos reservados
        </div>
      </div>
    </div>
  );
}

