export default function Home() {
  return (
    <>
      <header className="text-center mb-10 animate-fade-up bg-[#000000] text-[#f4f1ec] py-8">
        <img src="/saidcoach-logo.svg" alt="Logo SaidCoach" className="mx-auto h-20 md:h-24 mb-4" />
        <h1 className="text-2xl md:text-4xl font-bold leading-snug text-center px-4">
          ¿Necesitas un coach que te ayude a lograr tus objetivos?<br />
          ¿Eres entrenador?<br />
          ¿Quieres mejorar la salud de tu equipo?
        </h1>
        <p className="text-sm md:text-lg mt-2 text-[#f4deb7] px-4 text-center leading-relaxed">
          En SaidCoach acompañamos personas, entrenadores y empresas con herramientas modernas, planes personalizados y seguimiento real.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 bg-[#000000]">
        <div className="bg-[#f4deb7] p-3 md:p-6 rounded-2xl shadow text-gray-900 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <img
            src="/personas.png"
            alt="Para Personas"
            className="w-full h-32 md:h-40 object-top object-cover rounded-lg mb-4"
          />
          <h2 className="text-base md:text-xl font-semibold mb-2">👤 Para Personas</h2>
          <ul className="list-disc list-outside pl-5 space-y-1 text-justify text-sm md:text-base">
            <li>Entrenamiento online 100% personalizado</li>
            <li>Programa Despega (para activar hábitos)</li>
            <li>Asesorías individuales</li>
            <li>Área privada de alumnos</li>
            <li>Testimonios de cambios reales</li>
          </ul>
          <a href="/personas" className="inline-block mt-4 text-[#e79c00] underline">
            Ver más
          </a>
        </div>

        <div className="bg-[#f4deb7] p-3 md:p-6 rounded-2xl shadow text-gray-900 animate-fade-up mt-6 md:mt-0" style={{ animationDelay: '0.3s' }}>
          <img src="/entrenadores.png" alt="Para Entrenadores" className="w-full h-32 md:h-40 object-top object-cover rounded-lg mb-4" />
          <h2 className="text-base md:text-xl font-semibold mb-2">💪 Para Entrenadores</h2>
          <ul className="list-disc list-outside pl-5 space-y-1 text-justify text-sm md:text-base">
            <li>Automatiza tu coaching y gana tiempo</li>
            <li>Talleres y cursos de formación</li>
            <li>Softwares y herramientas probadas</li>
            <li>Artículos y recursos para entrenadores</li>
          </ul>
          <a href="/entrenadores" className="inline-block mt-4 text-[#e79c00] underline">
            Ver más
          </a>
        </div>

        <div className="bg-[#f4deb7] p-3 md:p-6 rounded-2xl shadow text-gray-900 animate-fade-up mt-6 md:mt-0" style={{ animationDelay: '0.5s' }}>
          <img src="/empresas.png" alt="Para Empresas" className="w-full h-32 md:h-40 object-top object-cover rounded-lg mb-4" />
          <h2 className="text-base md:text-xl font-semibold mb-2">🏢 Para Empresas</h2>
          <ul className="list-disc list-outside pl-5 space-y-1 text-justify text-sm md:text-base">
            <li>Mejora la salud, energía y productividad de tus equipos</li>
            <li>Programas de bienestar con desafíos gamificados</li>
            <li>Capacitación y acompañamiento estratégico</li>
            <li>Seguimiento de hábitos para mejores resultados</li>
          </ul>
          <a href="/empresas" className="inline-block mt-4 text-[#e79c00] underline">
            Ver más
          </a>
        </div>
      </section>
    </>
  );
}
