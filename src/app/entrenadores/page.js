export default function EntrenadoresPage() {
    return (
      <main className="min-h-screen p-6 bg-white text-gray-900">
        <section className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">¿Eres entrenador? Escala tu impacto.</h1>
          <p className="text-lg text-gray-600 mb-6">
            Te ayudamos a automatizar tu trabajo, entregar un mejor servicio y liberar tiempo para que puedas vivir de esto con libertad y propósito.
          </p>
          <img
            src="/entrenadores.png"
            alt="Automatización para entrenadores"
            className="w-full max-w-md mx-auto rounded-xl shadow mb-8 object-top object-cover"
          />
        </section>
  
        <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-2">⚙️ Automatiza tu coaching</h2>
            <p>
              Aprende a usar herramientas como PT Distinction, Google Sheets y otras apps para ahorrar tiempo y elevar tu servicio sin perder el toque personal.
            </p>
          </div>
  
          <div className="bg-green-50 p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-2">🎓 Formación continua</h2>
            <p>
              Accede a talleres, cursos y sesiones en vivo donde compartimos estrategias prácticas para coaches modernos.
            </p>
          </div>
  
          <div className="bg-green-50 p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-2">📦 Plantillas y recursos</h2>
            <p>
              Descarga formularios, documentos, scripts y recursos listos para usar con tus clientes y ahorrar horas de trabajo.
            </p>
          </div>
  
          <div className="bg-green-50 p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-2">🤝 Comunidad de entrenadores</h2>
            <p>
              Únete a un espacio donde compartimos avances, frustraciones y soluciones reales entre colegas que están en la misma sintonía.
            </p>
          </div>
        </section>
  
        <div className="text-center mt-10">
          <a
            href="/contacto"
            className="bg-green-600 text-white px-6 py-3 rounded-full shadow hover:bg-green-700 transition"
          >
            Quiero profesionalizar mi servicio
          </a>
        </div>
      </main>
    );
  }
  