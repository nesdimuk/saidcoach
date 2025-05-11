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
            <label className="block mb-1 font-semibold">Nombre</label>
            <input type="text" name="nombre" required className="w-full p-3 rounded-lg bg-white" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input type="email" name="email" required className="w-full p-3 rounded-lg bg-white" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Fecha</label>
            <input type="date" name="fecha" required className="w-full p-3 rounded-lg bg-white" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Objetivo principal</label>
            <input type="text" name="objetivo" className="w-full p-3 rounded-lg bg-white" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Motivación</label>
            <input type="text" name="motivacion" className="w-full p-3 rounded-lg bg-white" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Desmotivación</label>
            <textarea name="desmotivacion" className="w-full p-3 rounded-lg bg-white" rows="2" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">¿Qué ejercicio y/o grupos musculares te agrada trabajar?</label>
            <input type="text" name="favoritos" className="w-full p-3 rounded-lg bg-white" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">¿Qué ejercicios consideras lateros o preferirías cambiar o sacar de tu entrenamiento?</label>
            <input type="text" name="no_gustan" className="w-full p-3 rounded-lg bg-white" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">¿Qué sientes que le falta a tu entrenamiento? ¿Qué podríamos mejorar?</label>
            <textarea name="mejoras" className="w-full p-3 rounded-lg bg-white" rows="2" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">¿Sientes que el servicio justifica el valor que estás pagando?</label>
            <select name="valor" className="w-full p-3 rounded-lg bg-white">
              <option value="Totalmente">Totalmente</option>
              <option value="En parte">En parte</option>
              <option value="No mucho">No mucho</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Seguimiento deseado</label>
            <input type="text" name="seguimiento" className="w-full p-3 rounded-lg bg-white" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">¿Estás dispuesto(a) a comprometerte con algún hábito para trabajar estas semanas?</label>
            <select name="compromiso" className="w-full p-3 rounded-lg bg-white">
              <option value="Sí">Sí</option>
              <option value="No estoy seguro">No estoy seguro</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Hábito a trabajar</label>
            <input type="text" name="habito" className="w-full p-3 rounded-lg bg-white" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Mensaje final</label>
            <textarea name="libre" className="w-full p-3 rounded-lg bg-white" rows="3" />
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





  
  