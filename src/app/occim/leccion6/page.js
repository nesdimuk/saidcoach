export default function Leccion6() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Título compacto */}
      <div className="px-4 py-3 bg-white shadow-sm">
        <h1 className="text-xl sm:text-3xl font-bold text-center text-[#e79e00]">Lección 6</h1>
      </div>
      
      {/* Video a casi pantalla completa en móvil */}
      <div className="px-1 sm:px-4 py-2">
        <div 
          className="w-full rounded-lg sm:rounded-xl shadow-lg overflow-hidden bg-black"
          style={{ 
            height: 'min(85vh, 700px)', // 85% del viewport en móvil
            minHeight: '320px'
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
      
      {/* Formulario en sección sticky/expandible */}
      <div className="bg-white mx-2 sm:mx-4 rounded-t-xl shadow-lg sticky bottom-0">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-3 text-[#e79e00] text-center">📝 Completa el formulario</h2>
          
          {/* Formulario compacto por defecto */}
          <div className="h-[300px] sm:h-[500px] md:h-[600px] rounded-lg overflow-hidden border shadow-sm">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLScUawe_DbPq10NBMMvzbKN0pU1C8lh1K-lMqzp4m0rpNG1Flg/viewform?embedded=true"
              width="100%"
              height="100%"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
              title="Formulario Lección 6"
            >
              Cargando…
            </iframe>
          </div>
          
          {/* Mensaje para scroll */}
          <div className="text-xs text-gray-500 text-center mt-2">
            📱 Desplázate dentro del formulario para navegar
          </div>
        </div>
      </div>
    </div>
  );
}


