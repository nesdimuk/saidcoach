'use client';
import { useEffect } from "react";

export default function PortalAlumnos() {
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.type = "text/javascript";
    script1.innerHTML = `
      var ptd_param = {};
      ptd_param.apk = "faxisP2zww171433";
      ptd_param.domain = "https://v3portal.ptdistinction.com";
    `;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = "https://v3portal.ptdistinction.com/v3/inside/integration/v1/portal.js?id=51a6e61dc5d5040dc259d17cbdc7c4cd";
    script2.async = true;
    document.body.appendChild(script2);
  }, []);

  return (
    <main style={{ padding: "40px 20px", minHeight: "100vh", backgroundColor: "#f4f4f4" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Portal de Alumnos</h1>
      <p style={{ textAlign: "center", marginBottom: "30px", color: "#666" }}>
        Inicia sesión para acceder a tus entrenamientos
      </p>
      <div id="ptd_portal" style={{ maxWidth: "800px", margin: "0 auto" }}></div>
    </main>
  );
}

