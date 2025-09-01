import Image from "next/image";

export default function OccimLayout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen px-4 py-6 sm:p-6">
      <div className="w-full mx-auto space-y-8">
        
        {/* Logo OCCIM en la cabecera */}
        <div className="flex justify-center mb-4">
          <Image
            src="/logo-occim.png"   // asegúrate que el archivo esté en /public/logo-occim.png
            alt="Logo OCCIM"
            width={160}
            height={160}
            priority
          />
        </div>

        {/* Aquí se renderiza el contenido específico de cada lección */}
        {children}

        {/* Footer */}
        <div className="text-center pt-4 text-sm text-gray-500">
          © {new Date().getFullYear()} OCCIM · Todos los derechos reservados
        </div>
      </div>
    </div>
  );
}
