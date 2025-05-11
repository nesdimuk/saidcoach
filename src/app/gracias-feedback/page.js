"use client";

import Link from "next/link";

export default function GraciasFeedback() {
  return (
    <main className="min-h-screen bg-[#000000] text-[#f4f1ec] px-6 py-16 text-center">
      <section className="max-w-3xl mx-auto animate-fade-up">
        <img
          src="/bienestar-integral.jpg"
          alt="Bienestar integral"
          className="mx-auto mb-8 rounded-xl shadow-lg max-h-80 object-cover"
        />
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Gracias por responder 🙌</h1>
        <p className="text-lg text-[#f4deb7] mb-6 leading-relaxed">
          Cada respuesta que entregas me ayuda a conocerte mejor. El camino hacia tus objetivos no depende solo del entrenamiento.
        </p>
        <p className="text-lg text-[#f4deb7] mb-8 leading-relaxed">
          Tu descanso, tu alimentación, tus hábitos diarios, tu entorno y hasta tu nivel de estrés influyen en los resultados. Mi rol es acompañarte en todo eso, si tú lo deseas.
        </p>
        <p className="text-md text-gray-300 italic mb-10">
          Estoy aquí para ayudarte, no solo a entrenar... sino a lograr resultados sostenibles.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#e79c00] text-black font-semibold px-6 py-3 rounded hover:bg-[#f4deb7] transition"
        >
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}



