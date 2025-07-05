'use client';
import Script from 'next/script';

export default function PortalAlumnos() {
  return (
    <>
      {/* Configuración del portal PTD */}
      <Script id="ptd-config" strategy="afterInteractive">
        {`
          var ptd_param = {};
          ptd_param.apk = "faxisP2zww171433";
          ptd_param.domain = "https://v3portal.ptdistinction.com";
        `}
      </Script>

      {/* Script oficial de integración */}
      <Script
        src="https://v3portal.ptdistinction.com/v3/inside/integration/v1/portal.js?id=51a6e61dc5d5040dc259d17cbdc7c4cd"
        strategy="afterInteractive"
      />

      <main style={{ padding: "40px 20px", minHeight: "100vh" }}>
        <h1 style={{ textAlign: "center" }}>Portal de Alumnos</h1>
        <div id="ptd_portal" style={{ marginTop: "30px" }}></div>
      </main>
    </>
  );
}


