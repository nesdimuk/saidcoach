export default function Empresas() {
    return (
      <>
        <header className="text-center mb-10 animate-fade-up bg-[#000000] text-[#f4f1ec] py-8">
          <img src="/saidcoach-logo.svg" alt="Logo SaidCoach" className="mx-auto h-20 md:h-24 mb-4" />
          <h1 className="text-3xl md:text-5xl font-bold px-4 leading-tight">
            Para Empresas
          </h1>
          <p className="text-md md:text-lg mt-2 text-[#f4deb7] px-4 text-center leading-relaxed">
            Acompañamos a empresas y equipos a mejorar su salud, energía y cultura con programas diseñados para generar cambio real y sostenible.
          </p>
        </header>
  
        <main className="px-4 pb-16 bg-[#000000] text-[#f4f1ec]">
          <section className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl font-bold mb-4">Bienestar que se nota en los resultados</h2>
            <p className="text-lg text-[#f4deb7] mb-6">
              Trabajamos con organizaciones que quieren impactar positivamente la vida de sus equipos sin soluciones genéricas.
            </p>
            <img
              src="/empresas.png"
              alt="Programa para empresas"
              className="w-full max-w-md mx-auto rounded-xl shadow mb-8 object-top object-cover"
            />
          </section>
  
          <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#f4deb7] p-6 rounded-2xl shadow text-gray-900">
              <h2 className="text-xl font-semibold mb-2">📊 Programas de bienestar integrales</h2>
              <p>
                Diagnóstico, planificación y ejecución de intervenciones en salud física y mental adaptadas al contexto de tu equipo.
              </p>
            </div>
  
            <div className="bg-[#f4deb7] p-6 rounded-2xl shadow text-gray-900">
              <h2 className="text-xl font-semibold mb-2">🎯 Desafíos gamificados</h2>
              <p>
                Activamos la motivación mediante retos saludables que fortalecen hábitos, cohesión de grupo y sentido de logro compartido.
              </p>
            </div>
  
            <div className="bg-[#f4deb7] p-6 rounded-2xl shadow text-gray-900">
              <h2 className="text-xl font-semibold mb-2">📈 Seguimiento con IA y reportes</h2>
              <p>
                Automatizamos el monitoreo de participación y hábitos saludables, entregando reportes útiles y accionables a RRHH o gerencia.
              </p>
            </div>
  
            <div className="bg-[#f4deb7] p-6 rounded-2xl shadow text-gray-900">
              <h2 className="text-xl font-semibold mb-2">👥 Sesiones para líderes y equipos</h2>
              <p>
                Entrenamiento mental, físico y emocional enfocado en la realidad actual de quienes toman decisiones y sostienen la cultura.
              </p>
            </div>
          </section>
  
          <div className="text-center mt-10">
            <a
              href="/contacto"
              className="bg-[#e79c00] text-black px-6 py-3 rounded-full shadow hover:bg-[#f4deb7] transition font-semibold"
            >
              Quiero llevar esto a mi equipo
            </a>
          </div>
        </main>
      </>
    );
  }
  