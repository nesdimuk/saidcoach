import { useEffect } from "react";

export default function PortalAlumnos() {
  useEffect(() => {
    // Script de configuración
    const script1 = document.createElement("script");
    script1.type = "text/javascript";
    script1.innerHTML = `
      var ptd_param = {};
      ptd_param.apk = "faxisP2zww171433";
      ptd_param.domain = "https://v3portal.ptdistinction.com";
    `;
    document.body.appendChild(script1);

    // Script del portal
    const script2 = document.createElement("script");
    script2.src = "https://v3portal.ptdistinction.com/v3/inside/integration/v1/portal.js?id=51a6e61dc5d5040dc259d17cbdc7c4cd";
    script2.async = true;
    document.body.appendChild(script2);
  }, []);

  return (
    <main style={{ padding: "40px 20px", background: "#f9f9f9", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Acceso al Portal de Alumnos</h1>
      <p style={{ textAlign: "center", color: "#666", marginBottom: "30px" }}>
        Inicia sesión en tu cuenta para ver tus entrenamientos, progreso y más.
      </p>
      <div id="ptd_portal" style={{ maxWidth: "800px", margin: "0 auto" }}></div>
    </main>
  );
}
