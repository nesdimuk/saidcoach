export default function Home() {
  return (
    <>
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold leading-snug">
          ¿Necesitas un coach que te ayude a lograr tus objetivos?<br />
          ¿Eres entrenador?<br />
          ¿Quieres mejorar la salud de tu equipo?
        </h1>
        <p className="text-lg mt-2 text-gray-500">
          En SaidCoach acompañamos personas, entrenadores y empresas con herramientas modernas, planes personalizados y seguimiento real.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div className="bg-blue-100 p-6 rounded-2xl shadow text-gray-900">
          <img src="/personas.png" alt="Para Personas" className="w-full h-40 object-top object-cover rounded-lg mb-4" />
          <h2 className="text-xl font-semibold mb-2">👤 Para Personas</h2>
          <ul className="list-disc list-inside">
            <li>Entrenamiento online 100% personalizado</li>
            <li>Programa Despega (para activar hábitos)</li>
            <li>Asesorías individuales</li>
            <li>Área privada de alumnos</li>
            <li>Testimonios de cambios reales</li>
          </ul>
          <a href="/personas" className="inline-block mt-4 text-blue-800 underline">Ver más</a>
        </div>

        <div className="bg-green-100 p-6 rounded-2xl shadow text-gray-900">
          <img src="/entrenadores.png" alt="Para Entrenadores" className="w-full h-40 object-top object-cover rounded-lg mb-4" />
          <h2 className="text-xl font-semibold mb-2">💪 Para Entrenadores</h2>
          <ul className="list-disc list-inside">
            <li>Automatiza tu coaching y gana tiempo</li>
            <li>Talleres y cursos de formación</li>
            <li>Softwares y herramientas probadas</li>
            <li>Artículos y recursos para entrenadores</li>
          </ul>
          <a href="/entrenadores" className="inline-block mt-4 text-green-800 underline">Ver más</a>
        </div>

        <div className="bg-yellow-100 p-6 rounded-2xl shadow text-gray-900">
    <img src="/empresas.png" alt="Para Empresas" className="w-full h-40 object-cover rounded-lg mb-4" />
    <h2 className="text-xl font-semibold mb-2">🏢 Para Empresas</h2>
<ul className="list-disc list-inside">
  <li>Mejora la salud, energía y productividad de tus equipos</li>
  <li>Programas de bienestar con desafíos gamificados</li>
  <li>Capacitación y acompañamiento estratégico</li>
  <li>Seguimiento de hábitos para mejores resultados</li>
</ul>
    <a href="/empresas" className="inline-block mt-4 text-yellow-800 underline">Ver más</a>
  </div>
</section>
    </>
  );
}
