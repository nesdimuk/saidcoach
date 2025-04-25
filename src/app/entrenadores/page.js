export default function Entrenadores() {
    return (
      <>
        <header className="text-center mb-10 animate-fade-up bg-[#000000] text-[#f4f1ec] py-8">
          <img src="/saidcoach-logo.svg" alt="Logo SaidCoach" className="mx-auto h-20 md:h-24 mb-4" />
          <h1 className="text-3xl md:text-5xl font-bold px-4 leading-tight">
            Para Entrenadores
          </h1>
          <p className="text-md md:text-lg mt-2 text-[#f4deb7] px-4 text-center leading-relaxed">
            Te ayudamos a automatizar tu trabajo, mejorar tu servicio y liberar tiempo para que puedas vivir de esto con libertad y propósito.
          </p>
        </header>
  
        <main className="px-4 pb-16 bg-[#000000] text-[#f4f1ec]">
          <section className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl font-bold mb-4">¿Eres entrenador? Escala tu impacto.</h2>
            <p className="text-lg text-[#f4deb7] mb-6">
              Te damos las herramientas y el soporte para profesionalizar tu coaching y llegar más lejos sin sacrificar tu tiempo.
            </p>
            <img
              src="/entrenadores.png"
              alt="Automatización para entrenadores"
              className="w-full max-w-md mx-auto rounded-xl shadow mb-8 object-top object-cover"
            />
          </section>
  
          <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#f4deb7] p-6 rounded-2xl shadow text-gray-900">
              <h2 className="text-xl font-semibold mb-2">⚙️ Automatiza tu coaching</h2>
              <p>
                Aprende a usar herramientas como PT Distinction, Google Sheets y otras apps para ahorrar tiempo y elevar tu servicio sin perder el toque personal.
              </p>
            </div>
  
            <div className="bg-[#f4deb7] p-6 rounded-2xl shadow text-gray-900">
              <h2 className="text-xl font-semibold mb-2">🎓 Formación continua</h2>
              <p>
                Accede a talleres, cursos y sesiones en vivo donde compartimos estrategias prácticas para coaches modernos.
              </p>
            </div>
  
            <div className="bg-[#f4deb7] p-6 rounded-2xl shadow text-gray-900">
              <h2 className="text-xl font-semibold mb-2">📦 Plantillas y recursos</h2>
              <p>
                Descarga formularios, documentos, scripts y recursos listos para usar con tus clientes y ahorrar horas de trabajo.
              </p>
            </div>
  
            <div className="bg-[#f4deb7] p-6 rounded-2xl shadow text-gray-900">
              <h2 className="text-xl font-semibold mb-2">🤝 Comunidad de entrenadores</h2>
              <p>
                Únete a un espacio donde compartimos avances, frustraciones y soluciones reales entre colegas que están en la misma sintonía.
              </p>
            </div>
          </section>
  
          <div className="text-center mt-10">
            <a
              href="/contacto"
              className="bg-[#e79c00] text-black px-6 py-3 rounded-full shadow hover:bg-[#f4deb7] transition font-semibold"
            >
              Quiero profesionalizar mi servicio
            </a>
          </div>
        </main>
      </>
    );
  }
  
  