"use client";

import { useRouter } from "next/navigation";
import emailjs from "emailjs-com";
import { useRef } from "react";

export default function Feedback() {
  const router = useRouter();
  const formRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_saidcoach",
        "template_feedbackcoach",
        formRef.current,
        "8wJMwQoMn6zElgxvD"
      )
      .then(
        () => router.push("/gracias-feedback"),
        (error) => console.error("Error al enviar:", error.text)
      );
  };

  return (
    <main className="min-h-screen bg-[#000000] text-[#f4f1ec] px-4 py-12">
      <section className="max-w-3xl mx-auto animate-fade-up">
        <img src="/saidcoach-logo.svg" alt="Logo SaidCoach" className="mx-auto h-28 md:h-32 mb-6" />
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-4">📝 Formulario de Feedback y Objetivos</h1>
        <p className="text-center text-[#f4deb7] mb-8">
          Los resultados no dependen solo del entrenamiento. Tu descanso, tus hábitos y tu entorno también importan. <br />
          Mi misión es ayudarte a lograr tus objetivos, y si quieres, puedo acompañarte en esos otros aspectos también.
        </p>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-8 bg-[#f4deb7] text-gray-900 p-6 rounded-2xl shadow border-2 border-[#e79c00]"
        >
          <div>
            <label className="block mb-1 font-semibold">🧍 Tu nombre completo</label>
            <input type="text" name="nombre" required className="w-full p-3 rounded-lg bg-white" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">📧 Tu correo electrónico</label>
            <input type="email" name="email" required className="w-full p-3 rounded-lg bg-white" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">📅 Fecha de hoy</label>
            <input type="date" name="fecha" required className="w-full p-3 rounded-lg bg-white" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">🎯 ¿Cuál es tu objetivo principal hoy?</label>
            <select name="objetivo" className="w-full p-3 rounded-lg bg-white">
              <option>Perder grasa corporal</option>
              <option>Ganar masa muscular</option>
              <option>Mejorar rendimiento físico/deportivo</option>
              <option>Retomar el entrenamiento tras pausa o lesión</option>
              <option>Bienestar general y hábito</option>
              <option>Otro</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">🔥 ¿Qué te está motivando a seguir entrenando?</label>
            <input type="text" name="motivacion" placeholder="Ej: Quiero sentirme mejor conmigo mismo..." className="w-full p-3 rounded-lg bg-white" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">🪫 ¿Qué cosas te desmotivan o dificultan tu constancia?</label>
            <textarea name="desmotivacion" placeholder="Ej: Falta de tiempo, me siento cansado, no veo resultados..." className="w-full p-3 rounded-lg bg-white" rows={2} />
          </div>

          <div>
            <label className="block mb-1 font-semibold">💪 ¿Qué ejercicios o grupos musculares disfrutas trabajar?</label>
            <input type="text" name="favoritos" className="w-full p-3 rounded-lg bg-white" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">🙄 ¿Qué ejercicios te cargan o preferirías cambiar?</label>
            <input type="text" name="no_gustan" className="w-full p-3 rounded-lg bg-white" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">⚙️ ¿Qué sientes que le falta o podría mejorar tu entrenamiento?</label>
            <textarea name="mejoras" className="w-full p-3 rounded-lg bg-white" rows={2} />
          </div>

          <div>
            <label className="block mb-1 font-semibold">💸 ¿Crees que el servicio justifica lo que estás pagando?</label>
            <select name="valor" className="w-full p-3 rounded-lg bg-white">
              <option>Sí, totalmente</option>
              <option>En parte</option>
              <option>No mucho</option>
              <option>No</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">📈 ¿Te gustaría recibir apoyo en otros aspectos?</label>
            <select name="seguimiento" className="w-full p-3 rounded-lg bg-white">
              <option>Ninguno</option>
              <option>Nutrición o porciones</option>
              <option>Organización de hábitos</option>
              <option>Higiene del sueño</option>
              <option>Otro</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">🔁 ¿Te animas a comprometerte con algún hábito estas semanas?</label>
            <select name="compromiso" className="w-full p-3 rounded-lg bg-white">
              <option>Sí</option>
              <option>No estoy seguro</option>
              <option>No</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">🧩 Si dijiste que sí, ¿qué hábito quieres trabajar?</label>
            <input type="text" name="habito" className="w-full p-3 rounded-lg bg-white" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">🗣️ ¿Algo más que quieras contarme o sugerirme?</label>
            <textarea name="libre" className="w-full p-3 rounded-lg bg-white" rows={3} />
          </div>

          <button
            type="submit"
            className="bg-[#e79c00] hover:bg-[#d88f00] text-black font-bold py-3 px-6 rounded-lg shadow"
          >
            Enviar feedback
          </button>
        </form>
      </section>
    </main>
  );
}






  
  