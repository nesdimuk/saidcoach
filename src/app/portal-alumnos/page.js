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

      {/* Estilo general para fondo negro */}
      <style>{`
        body {
          background-color: #000 !important;
        }
      `}</style>

      {/* Contenido principal */}
      <main
        style={{
          minHeight: '100vh',
          backgroundColor: '#000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          fontFamily: "'Segoe UI', sans-serif",
          color: '#fff'
        }}
      >
        {/* Logo centrado */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img
            src="/saidcoach-logo.svg"
            alt="SaidCoach"
            style={{ width: '200px', margin: '0 auto', display: 'block', filter: 'brightness(1.3)' }}
          />
          <h1 style={{ fontSize: '2.2rem', marginTop: '20px' }}>Portal de Alumnos</h1>
          <p style={{ fontSize: '1rem', color: '#ccc' }}>
            Inicia sesión para acceder a tus entrenamientos y progreso
          </p>
        </div>

        {/* Portal de PT Distinction */}
        <div id="ptd_portal" style={{ width: '100%', maxWidth: '500px' }}></div>

        {/* Footer */}
        <footer style={{ marginTop: '60px', textAlign: 'center', color: '#888' }}>
          <p style={{ fontSize: '0.9rem' }}>
            ¿Problemas para ingresar? Escríbenos a <strong>marcelosaid.ep@gmail.com</strong>
          </p>
        </footer>
      </main>
    </>
  );
}






