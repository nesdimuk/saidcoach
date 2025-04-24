"use client";

import { useState } from "react";

export default function ContactoPage() {
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviando(true);

    const form = e.target;
    const nombre = form.nombre.value.trim() || "Alguien";
    const correo = form.email.value.trim();
    const mensaje = form.mensaje.value.trim();

    const texto = encodeURIComponent(
      `Hola Marcelo! 👋 Soy ${nombre} (${correo}) y te escribo desde tu página web.\n\n${mensaje}`
    );

    const numeroWhatsApp = "569XXXXXXXX"; // reemplaza por tu número real

    window.open(`https://wa.me/${numeroWhatsApp}?text=${texto}`, "_blank");
    setTimeout(() => setEnviando(false), 1000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 p-6">
      <section className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">Contáctame por WhatsApp</h1>
        <p className="text-center text-gray-600 mb-6">
          Completa este formulario y te abriré un chat con la info lista.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              required
              placeholder="Tu nombre"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Correo</label>
            <input
              type="email"
              name="email"
              required
              placeholder="tucorreo@ejemplo.com"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Mensaje</label>
            <textarea
              name="mensaje"
              required
              placeholder="Cuéntame en qué puedo ayudarte..."
              rows="5"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow transition"
          >
            {enviando ? "Enviando..." : "Escribir por WhatsApp"}
          </button>
        </form>
      </section>
    </main>
  );
}
