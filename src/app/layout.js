import "./globals.css";

export const metadata = {
  title: "SaidCoach",
  description: "Coaching para personas, entrenadores y empresas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-[#000000] text-[#f4f1ec] font-sans">
        {children}

        <footer className="mt-16 pt-8 border-t border-[#f4f1ec]/20 text-sm text-[#f4deb7] text-center">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center px-4">
            <p className="mb-4 md:mb-0">© {new Date().getFullYear()} SaidCoach. Todos los derechos reservados.</p>
            <div className="flex space-x-4">
              <a href="https://wa.me/569XXXXXXXX" target="_blank" rel="noopener noreferrer" className="hover:text-[#e79c00]">WhatsApp</a>
              <a href="mailto:contacto@saidcoach.com" className="hover:text-[#e79c00]">Email</a>
              <a href="https://www.instagram.com/saidcoach" target="_blank" rel="noopener noreferrer" className="hover:text-[#e79c00]">Instagram</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

