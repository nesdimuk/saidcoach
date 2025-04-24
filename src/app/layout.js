import "./globals.css";

export const metadata = {
  title: "SaidCoach",
  description: "Coaching para personas, entrenadores y empresas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="font-sans antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}

