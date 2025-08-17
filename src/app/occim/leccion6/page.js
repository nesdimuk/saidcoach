export default function Leccion6() {
  return (
    <div className="bg-gray-100 min-h-screen px-4 py-6 sm:p-6">
      <div className="w-full mx-auto space-y-6">
        {/* Título de la lección */}
        <h1 className="text-3xl font-bold text-center text-[#e79e00]">Lección 6</h1>
        
        {/* Contenedor del video con altura fija más grande en móviles */}
        <div className="w-full">
          <div 
            className="w-full rounded-xl shadow-lg overflow-hidden bg-black"
            style={{ 
              height: '300px', // Altura fija más grande en móviles
              '@media (min-width: 640px)': { height: '400px' },
              '@media (min-width: 768px)': { height: '500px' }
            }}
          >
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/WOszzxK8MIA"
              title="Lección 6 – El estrés pide movimiento, no solo descanso"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
        
        {/* Sección del formulario */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4 text-[#e79e00]">📝 Responde y suma puntos</h2>
          
          {/* Contenedor del formulario */}
          <div className="w-full h-[450px] sm:h-[550px] md:h-[650px] rounded-xl overflow-hidden shadow border">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLScUawe_DbPq10NBMMvzbKN0pU1C8lh1K-lMqzp4m0rpNG1Flg/viewform?embedded=true"
              width="100%"
              height="100%"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
              title="Formulario Lección 6"
              className="w-full h-full"
            >
              Cargando…
            </iframe>
          </div>
        </div>
        
        {/* Pie de página */}
        <div className="text-center pt-4 text-sm text-gray-500">
          © {new Date().getFullYear()} SaidCoach · Todos los derechos reservados
        </div>
      </div>
    </div>
  );
}


