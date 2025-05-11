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
        <h1 className="text-4xl md:text-5xl font-bold mb-6">¡Gracias por tu feedback! 🙌</h1>
        <p className="text-lg text-[#f4deb7] mb-6 leading-relaxed">
          Tus respuestas ya fueron enviadas correctamente. Cada palabra tuya me ayuda a entender mejor cómo apoyarte.
        </p>
        <p className="text-lg text-[#f4deb7] mb-4 leading-relaxed">
          Recuerda que tu progreso no depende solo del entrenamiento: también influye cómo duermes, qué comes, cómo manejas el estrés y cómo organizas tu vida.
        </p>
        <p className="text-lg text-[#f4deb7] mb-6 leading-relaxed">
          Revisaré personalmente tu feedback para proponerte los mejores próximos pasos. ¡Gracias por confiar en este proceso!
        </p>
        <p className="text-md text-gray-300 italic mb-10">
          Estoy aquí para ayudarte, no solo a entrenar... sino a lograr resultados reales y sostenibles.
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



