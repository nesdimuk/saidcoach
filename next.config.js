/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Desactiva la regla que convierte las advertencias de `<img>` en errores de compilación
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
