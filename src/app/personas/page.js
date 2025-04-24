export default function PersonasPage() {
  return (
    <main className="min-h-screen p-6 bg-white text-gray-900">
      <section className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Activa tu mejor versión</h1>
        <p className="text-lg text-gray-600 mb-6">
          Para quienes quieren mejorar su salud, entrenar con propósito o retomar el control de sus hábitos. Este espacio es para ti.
        </p>
        <img
          src="/personas.png"
          alt="Entrenamiento personalizado"
          className="w-full max-w-md mx-auto rounded-xl shadow mb-8 object-top object-cover"
        />
      </section>

      <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">🧍 Entrenamiento Online Personalizado</h2>
          <p>
            Clases en vivo adaptadas a tu nivel, tus horarios y tus objetivos. No necesitas gimnasio, solo compromiso y ganas de moverte.
          </p>
        </div>

        <div className="bg-blue-50 p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">🚀 Programa Despega</h2>
          <p>
            Un plan de 21 días para personas que sienten que les cuesta partir. Aprende a organizarte, alimentarte mejor y tomar acción.
          </p>
        </div>

        <div className="bg-blue-50 p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">📱 App SaidTrainer</h2>
          <p>
            Recibe tus entrenamientos, registra tus hábitos y obtén feedback directamente desde nuestra plataforma personalizada.
          </p>
        </div>

        <div className="bg-blue-50 p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">💬 Asesorías y seguimiento</h2>
          <p>
            Sesiones uno a uno para resolver tus dudas, acompañarte en el proceso y ayudarte a sostener lo que comienzas.
          </p>
        </div>
      </section>

      <div className="text-center mt-10">
        <a
          href="/contacto"
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 transition"
        >
          Quiero empezar
        </a>
      </div>
    </main>
  );
}
