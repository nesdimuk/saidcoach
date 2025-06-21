export default function Leccion1() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">Desafío OCCIM – Lección 1</h1>

      <p className="text-lg text-center">
        🎯 Hoy comienza tu misión. Mira este video corto y responde una sola pregunta.
        Si aciertas, ¡sumas puntos y mantienes la racha viva!
      </p>

      <div className="aspect-video">
        <iframe
          className="w-full h-full rounded-xl shadow-lg"
          src="https://www.youtube.com/embed/GY81ONeT2xY"
          title="Lección 1 – Desafío OCCIM"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-2">📝 Responde la pregunta y suma puntos</h2>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSfKlIvWaS8zUwi4TQYHfeiQwc8cdrJoaeNTknkAo6mNa5ZF8w/viewform?embedded=true"
          width="100%"
          height="750"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          className="rounded-xl shadow"
          title="Formulario Lección 1"
        >
          Cargando…
        </iframe>
      </div>

      <div className="text-center pt-4 text-sm text-gray-500">
        © {new Date().getFullYear()} SaidCoach · Todos los derechos reservados
      </div>
    </div>
  );
}