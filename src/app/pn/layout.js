// layout exclusivo para /pn → fondo claro + texto oscuro (no afecta el resto del sitio)
export default function PNLayout({ children }) {
  return (
    <div className="min-h-dvh bg-gray-50 text-gray-900">
      {children}
    </div>
  );
}
