export default function EmpresasPage() {
  return (
    <main className="min-h-screen p-6 bg-white text-gray-900">
      <section className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Bienestar que se nota en los resultados</h1>
        <p className="text-lg text-gray-600 mb-6">
          Acompañamos a empresas y equipos a mejorar su salud, energía y cultura con programas diseñados para generar cambio real y sostenible.
        </p>
        <img
          src="/empresas.png"
          alt="Programa para empresas"
          className="w-full max-w-md mx-auto rounded-xl shadow mb-8 object-top object-cover"
        />
      </section>

      <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-yellow-50 p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">📊 Programas de bienestar integrales</h2>
          <p>
            Diagnóstico, planificación y ejecución de intervenciones en salud física y mental adaptadas al contexto de tu equipo.
          </p>
        </div>

        <div className="bg-yellow-50 p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">🎯 Desafíos gamificados</h2>
          <p>
            Activamos la motivación mediante retos saludables que fortalecen hábitos, cohesión de grupo y sentido de logro compartido.
          </p>
        </div>

        <div className="bg-yellow-50 p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">📈 Seguimiento con IA y reportes</h2>
          <p>
            Automatizamos el monitoreo de participación y hábitos saludables, entregando reportes útiles y accionables a RRHH o gerencia.
          </p>
        </div>

        <div className="bg-yellow-50 p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">👥 Sesiones para líderes y equipos</h2>
          <p>
            Entrenamiento mental, físico y emocional enfocado en la realidad actual de quienes toman decisiones y sostienen la cultura.
          </p>
        </div>
      </section>

      <div className="text-center mt-10">
        <a
          href="/contacto"
          className="bg-yellow-500 text-white px-6 py-3 rounded-full shadow hover:bg-yellow-600 transition"
        >
          Quiero llevar esto a mi equipo
        </a>
      </div>
    </main>
  );
}
