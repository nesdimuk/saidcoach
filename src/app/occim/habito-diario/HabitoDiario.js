export default function HabitoDiario() {
  return (
    // Contenedor principal con fondo gris y padding responsivo.
    // 'px-4 py-6' para menor padding lateral en móviles (16px), y 'sm:p-6' para más padding en pantallas grandes.
    <div className="bg-gray-100 min-h-screen px-4 py-6 sm:p-6">
      {/* Contenedor central de contenido con más espaciado vertical. */}
      <div className="w-full mx-auto space-y-8">
        {/* Título de la página del formulario diario. */}
        <h1 className="text-3xl font-bold text-center text-[#e79e00]">💪 Registro Diario de Hábito Saludable</h1>

        {/* Descripción corta para la página del hábito. */}
        <p className="text-lg text-gray-700 text-center max-w-2xl mx-auto">
          ¡No olvides registrar si realizaste tu hábito saludable hoy para seguir sumando puntos y avanzando en tu bienestar!
        </p>

        {/* Sección del formulario. No hay video para esta página. */}
        <div className="border-t pt-8 mt-8">
          <h2 className="text-xl font-semibold mb-6 text-[#e79e00]">📝 Registra tu hábito y suma puntos</h2>

          {/* Contenedor del formulario con alturas fijas responsivas. */}
          <div className="w-full h-[450px] sm:h-[550px] md:h-[650px] rounded-xl overflow-hidden shadow border">
            {/* Iframe del formulario de Google Forms para el Hábito Diario. */}
            <iframe
              // URL pública de tu formulario de Hábito Diario.
              src="https://docs.google.com/forms/d/e/1FAIpQLSe2ymTGEUHAiE9NCw9f4mdHg7GzJbgDrpoJREVZ3sM2EogyCw/viewform?usp=dialog&embedded=true"
              width="100%"
              height="100%" // Asegura que el iframe ocupe todo el espacio de su div padre con altura controlada.
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
              title="Formulario Hábito Diario"
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
