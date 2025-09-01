// /components/OccimLayout.js
export default function OccimLayout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen px-4 py-6 sm:p-6">
      {/* Logo OCCIM centrado */}
      <div className="w-full flex justify-center mb-8">
        <img
          src="/logo-occim.png" // asegúrate de que el archivo esté en /public
          alt="OCCIM logo"
          className="h-16 sm:h-20 object-contain"
        />
      </div>

      {/* Contenido de la página */}
      <div className="w-full mx-auto space-y-8">{children}</div>

      {/* Footer */}
      <div className="text-center pt-8 text-sm text-gray-500">
        © {new Date().getFullYear()} SaidCoach · Todos los derechos reservados
      </div>
    </div>
  );
}

