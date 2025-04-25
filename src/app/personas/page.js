export default function Personas() {
    return (
      <>
        <header className="text-center mb-10 animate-fade-up bg-[#000000] text-[#f4f1ec] py-8">
          <img src="/saidcoach-logo.svg" alt="Logo SaidCoach" className="mx-auto h-20 md:h-24 mb-4" />
          <h1 className="text-3xl md:text-5xl font-bold px-4 leading-tight">
            Para Personas
          </h1>
          <p className="text-md md:text-lg mt-2 text-[#f4deb7] px-4 text-center leading-relaxed">
            Te acompaño con un programa 100% personalizado que se adapta a tu contexto, tus tiempos y tus prioridades reales. Sin presiones. Sin excusas. Resultados reales y sostenibles.
          </p>
        </header>
  
        <main className="px-4 pb-16 bg-[#000000] text-[#f4f1ec]">
          <section className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl font-bold mb-4">Activa tu mejor versión</h2>
            <p className="text-lg text-[#f4deb7] mb-6">
              Para quienes quieren mejorar su salud, entrenar con propósito o retomar el control de sus hábitos. Este espacio es para ti.
            </p>
            <img
              src="/personas.png"
              alt="Entrenamiento personalizado"
              className="w-full max-w-md mx-auto rounded-xl shadow mb-8 object-top object-cover"
            />
          </section>
  
          <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#f4deb7] p-6 rounded-2xl shadow text-gray-900">
              <h2 className="text-xl font-semibold mb-2">🧍 Entrenamiento Online Personalizado</h2>
              <p>
                Clases en vivo adaptadas a tu nivel, tus horarios y tus objetivos. No necesitas gimnasio, solo compromiso y ganas de moverte.
              </p>
            </div>
  
            <div className="bg-[#f4deb7] p-6 rounded-2xl shadow text-gray-900">
              <h2 className="text-xl font-semibold mb-2">🚀 Programa Despega</h2>
              <p>
                Un plan de 21 días para personas que sienten que les cuesta partir. Aprende a organizarte, alimentarte mejor y tomar acción.
              </p>
            </div>
  
            <div className="bg-[#f4deb7] p-6 rounded-2xl shadow text-gray-900">
              <h2 className="text-xl font-semibold mb-2">📱 App SaidTrainer</h2>
              <p>
                Recibe tus entrenamientos, registra tus hábitos y obtén feedback directamente desde nuestra plataforma personalizada.
              </p>
            </div>
  
            <div className="bg-[#f4deb7] p-6 rounded-2xl shadow text-gray-900">
              <h2 className="text-xl font-semibold mb-2">💬 Asesorías y seguimiento</h2>
              <p>
                Sesiones uno a uno para resolver tus dudas, acompañarte en el proceso y ayudarte a sostener lo que comienzas.
              </p>
            </div>
          </section>
  
          <div className="text-center mt-10">
            <a
              href="/contacto"
              className="bg-[#e79c00] text-black px-6 py-3 rounded-full shadow hover:bg-[#f4deb7] transition font-semibold"
            >
              Quiero empezar
            </a>
          </div>
        </main>
      </>
    );
  }
  