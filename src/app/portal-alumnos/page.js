'use client';
import Script from 'next/script';

export default function PortalAlumnos() {
  return (
    <>
      {/* Configuración de PT Distinction */}
      <Script id="ptd-config" strategy="afterInteractive">
        {`
          var ptd_param = {};
          ptd_param.apk = "faxisP2zww171433";
          ptd_param.domain = "https://v3portal.ptdistinction.com";
        `}
      </Script>

      {/* Script de integración */}
      <Script
        src="https://v3portal.ptdistinction.com/v3/inside/integration/v1/portal.js?id=51a6e61dc5d5040dc259d17cbdc7c4cd"
        strategy="afterInteractive"
      />

      {/* Contenido */}
      <main
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(145deg, #fdfbfb, #ebedee)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '60px 20px',
          fontFamily: "'Segoe UI', sans-serif"
        }}
      >
        {/* Logo y encabezado */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img
            src="/saidcoach-logo.svg"
            alt="SaidCoach"
            style={{ width: '180px', marginBottom: '20px' }}
          />
          <h1 style={{ color: '#222', fontSize: '2.2rem' }}>Portal de Alumnos</h1>
          <p style={{ color: '#666', fontSize: '1rem' }}>
            Inicia sesión para acceder a tus entrenamientos y progreso
          </p>
        </div>

        {/* Área del portal de PT Distinction */}
        <div id="ptd_portal" style={{ width: '100%', maxWidth: '500px' }}></div>

        {/* Pie de página */}
        <footer style={{ marginTop: '60px', textAlign: 'center', color: '#aaa' }}>
          <p style={{ fontSize: '0.9rem' }}>
            ¿Problemas para ingresar? Escríbenos a <strong>marcelosaid.ep@gmail.com</strong>
          </p>
        </footer>
      </main>
    </>
  );
}




