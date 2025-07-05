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
          backgroundColor: '#f9f9f9',
          color: '#333',
          fontFamily: "'Segoe UI', sans-serif",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '40px 20px'
        }}
      >
        {/* Logo centrado */}
        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img
            src="/saidcoach-logo.svg"
            alt="SaidCoach"
            style={{
              width: '180px',
              display: 'block',
              margin: '0 auto'
            }}
          />
        </header>

        {/* Título */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2.2rem' }}>Portal de Alumnos</h1>
          <p style={{ color: '#666' }}>
            Inicia sesión para acceder a tus entrenamientos y progreso
          </p>
        </div>

        {/* Portal embed de PT Distinction */}
        <div id="ptd_portal" style={{ width: '100%', maxWidth: '500px' }}></div>

        {/* Footer */}
        <footer style={{ marginTop: '60px', textAlign: 'center', color: '#999' }}>
          <p style={{ fontSize: '0.9rem' }}>
            ¿Problemas para ingresar? Escríbenos a <strong>marcelosaid.ep@gmail.com</strong>
          </p>
        </footer>
      </main>
    </>
  );
}








