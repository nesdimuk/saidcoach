"use client";

import { useState } from "react";

export default function Contacto() {
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

    const numeroWhatsApp = "56995995678"; // reemplaza por tu número real
    window.open(`https://wa.me/${numeroWhatsApp}?text=${texto}`, "_blank");
    setTimeout(() => setEnviando(false), 1000);
  };

  return (
    <main className="min-h-screen px-4 py-12 bg-[#000000] text-[#f4f1ec]">
      <section className="max-w-2xl mx-auto text-center">
        <img src="/saidcoach-logo.svg" alt="Logo SaidCoach" className="mx-auto h-20 md:h-24 mb-6" />
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Contáctanos</h1>
        <p className="text-md md:text-lg text-[#f4deb7] mb-8">
          Cuéntanos en qué podemos ayudarte. Completa este formulario y abriremos un chat con la información lista.
        </p>
      </section>

      <section className="max-w-xl mx-auto bg-[#f4deb7] text-gray-900 rounded-2xl shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block font-semibold mb-1">Nombre</label>
            <input type="text" id="nombre" name="nombre" required className="w-full rounded px-4 py-2 bg-white" />
          </div>

          <div>
            <label htmlFor="email" className="block font-semibold mb-1">Correo electrónico</label>
            <input type="email" id="email" name="email" required className="w-full rounded px-4 py-2 bg-white" />
          </div>

          <div>
            <label htmlFor="mensaje" className="block font-semibold mb-1">Mensaje</label>
            <textarea id="mensaje" name="mensaje" rows="4" required className="w-full rounded px-4 py-2 bg-white"></textarea>
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-[#e79c00] text-black font-semibold py-2 rounded hover:bg-[#f4deb7] transition"
          >
            {enviando ? "Enviando..." : "Escribir por WhatsApp"}
          </button>
        </form>
      </section>
    </main>
  );
}
