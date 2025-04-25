export default function Gracias() {
    return (
      <main className="min-h-screen px-4 py-16 bg-[#000000] text-[#f4f1ec] text-center flex flex-col justify-between">
        <section className="max-w-2xl mx-auto animate-fade-up">
          <img src="/saidcoach-logo.svg" alt="Logo SaidCoach" className="mx-auto h-20 md:h-24 mb-8" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">¡Gracias por tu mensaje!</h1>
          <p className="text-lg text-[#f4deb7] mb-8">
            Tu información fue enviada con éxito. En breve me pondré en contacto contigo por WhatsApp o correo.
          </p>
          <a
            href="/"
            className="inline-block bg-[#e79c00] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#f4deb7] transition"
          >
            Volver al inicio
          </a>
        </section>
  
        <footer className="mt-16 pt-8 border-t border-[#f4f1ec]/20 text-sm text-[#f4deb7]">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center px-4">
            <p className="mb-4 md:mb-0">
              © {typeof window !== "undefined" ? new Date().getFullYear() : "2025"} SaidCoach. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4">
              <a href="https://wa.me/56995995678" target="_blank" rel="noopener noreferrer" className="hover:text-[#e79c00]">WhatsApp</a>
              <a href="mailto:contacto@saidtrainer.com" className="hover:text-[#e79c00]">Email</a>
              <a href="https://www.instagram.com/saidtrainer" target="_blank" rel="noopener noreferrer" className="hover:text-[#e79c00]">Instagram</a>
            </div>
          </div>
        </footer>
      </main>
    );
  }
  
  
