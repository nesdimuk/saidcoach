export default function Leccion2() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">Desafío OCCIM – Lección 2</h1>

      <div className="aspect-video">
        <iframe
          className="w-full h-[500px] rounded-xl shadow-lg"
          src="https://www.youtube.com/embed/31kl5y0oKkw"
          title="Lección 2 – No es lo que comes, es cómo lo repites"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-2">📝 Responde la pregunta y suma puntos</h2>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLScA6mRO5t7r1o7EeF4WQVBP9jDoOEw69TTHEC8dH8zRcRKOEA/viewform?embedded=true"
          width="100%"
          height="750"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          className="rounded-xl shadow"
          title="Formulario Lección 2"
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

