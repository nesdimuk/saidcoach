export default function Leccion12() {
  return (
    <div className="bg-gray-100 min-h-screen px-4 py-6 sm:p-6">
      <div className="w-full mx-auto space-y-8">
        {/* Header con logo */}
        <div className="flex flex-col items-center space-y-4 mb-8">
          <img 
            src="/logo-occim.png"
            alt="OCCIM Logo"
            className="h-16 w-auto object-contain"
          />
          <h1 className="text-3xl font-bold text-center text-[#e79e00]">
            🎧 Lección 12 – Comer mejor no es comer menos
          </h1>
        </div>
        
        {/* Contenedor del video */}
        <div className="w-full">
          <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] rounded-xl shadow-lg overflow-hidden bg-black">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/hDFFAnf4LBI"
              title="Lección 12 – Comer mejor no es comer menos"
              style={{ border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
        
        {/* Resto del contenido igual... */}
        <div className="border-t pt-8 mt-8">
          <h2 className="text-xl font-semibold mb-6 text-[#e79e00]">
            📝 Responde y suma puntos
          </h2>
          <div className="w-full h-[450px] sm:h-[550px] md:h-[650px] rounded-xl overflow-hidden shadow border">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLScMFrAr3HIy0mHWqYcyIJ8tn-n2k-gJsX1dO9hVCTYlShJJSA/viewform?usp=dialog&embedded=true"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              title="Formulario Lección 12"
              className="w-full h-full"
              loading="lazy"
            >
              Cargando…
            </iframe>
          </div>
        </div>
        
        <div className="text-center pt-4 text-sm text-gray-500">
          © {new Date().getFullYear()} SaidCoach · Todos los derechos reservados
        </div>
      </div>
    </div>
  );
}
