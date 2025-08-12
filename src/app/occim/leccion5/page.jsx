export default function Leccion5() {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-[#e79e00]">Lección 5</h1>

        <div className="aspect-video">
          <iframe
            className="w-full h-[500px] rounded-xl shadow-lg"
            src="https://www.youtube.com/embed/fxXgSJ3rhJI"
            title="Lección 5 – Comer sin hambre es emocional, no racional"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-2 text-[#e79e00]">📝 Responde y suma puntos</h2>
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSf1rNO2IuOeOXGKzGXtWfWDAgEwiCzJlkpHAlxOXq7X3wjILg/viewform?embedded=true"
            width="100%"
            height="750"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            className="rounded-xl shadow"
            title="Formulario Lección 5"
          >
            Cargando…
          </iframe>
        </div>

        <div className="text-center pt-4 text-sm text-gray-500">
          © {new Date().getFullYear()} SaidCoach · Todos los derechos reservados
        </div>
      </div>
    </div>
  );
}

