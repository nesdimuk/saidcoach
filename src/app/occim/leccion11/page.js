export default function Leccion11() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold mb-6">🎧 Lección 11 – Tu cuerpo recuerda lo que repites</h1>
        {/* Video */}
        <div className="mb-6">
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/29zz3niaZo8"
            title="Lección 11 – Tu cuerpo recuerda lo que repites"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg shadow-md"
          ></iframe>
        </div>
        {/* Formulario */}
        <div className="mt-6">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdqEt9Zajq55YrVctMVHtfEIZfciHzpaTuYUOjdohGIoweYRw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            📋 Responde el formulario de la Lección 11
          </a>
          <p className="mt-3 text-gray-600 text-sm">
            Puedes ganar hasta <strong>20 puntos</strong>:  
            10 por responder la pregunta y 10 por registrar un hábito saludable.
          </p>
        </div>
      </div>
    </main>
  );
}