// src/app/guia-nutricional/page.jsx
"use client";
import { useEffect, useMemo, useState } from "react";

const BASE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSf1fzZ8ePfwFBwpKmiJnnaBIlANUSDc53zNfvsUJs1PH5VFtQ/viewform?embedded=true";

function buildFormUrl(base, extra) {
  let url = base;
  Object.entries(extra || {}).forEach(([k, v]) => {
    if (v) {
      const hasQ = url.includes("?");
      url += `${hasQ ? "&" : "?"}${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
    }
  });
  return url;
}

export default function GuiaNutricionalPage() {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const queryParams = useMemo(() => {
    if (typeof window === "undefined") return {};
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get("utm_source") || (typeof document !== "undefined" ? document.referrer : "") || "direct",
      utm_medium: params.get("utm_medium") || "web",
      utm_campaign: params.get("utm_campaign") || "guia_nutricional",
    };
  }, []);

  const formUrl = useMemo(() => buildFormUrl(BASE_FORM_URL, queryParams), [queryParams]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#111] text-[#f4f1ec]">
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-8">
        <div className="text-center">
          <img src="/logo-saidcoach.svg" alt="Said Coach" className="mx-auto mb-4 h-12" />
          <h1 className="mt-2 text-3xl md:text-5xl font-extrabold tracking-tight text-[#e79c00]">Guía Nutricional Personalizada</h1>
          <p className="mt-4 text-base md:text-lg text-[#f4deb7] max-w-2xl mx-auto">
            Completa el siguiente formulario (60 segundos) y recibe tu guía práctica con porciones en medidas caseras,
            menú sugerido y recomendaciones personalizadas según tus objetivos y preferencias.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "100% personalizada", desc: "Adaptada a tu edad, nivel de actividad y objetivos." },
            { title: "Método simple", desc: "Porciones con la palma, puño, pulgar y puñado." },
            { title: "Sin restricciones extremas", desc: "Incluye lo que amas de forma equilibrada." },
          ].map((f, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg text-[#e79c00]">{f.title}</h3>
              <p className="mt-2 text-sm text-[#f4deb7]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="mb-4 rounded-2xl border border-[#e79c00]/30 bg-[#e79c00]/10 p-4 text-sm text-[#f4f1ec]">
          <strong className="text-[#e79c00]">⏳ Importante:</strong> Al enviar el formulario, en unos minutos recibirás tu guía en el correo indicado.
          Si no la ves, revisa las carpetas <em>Spam</em>/Promociones o escríbenos a <a className="underline" href="mailto:marcelosaid.ep@gmail.com">marcelosaid.ep@gmail.com</a>.
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl">
          <div className="relative w-full" style={{ minHeight: 1200 }}>
            <iframe
              title="Formulario Guía Nutricional"
              src={formUrl}
              className="absolute inset-0 h-full w-full rounded-2xl border border-white/10 bg-white"
              onLoad={() => setIframeLoaded(true)}
              loading="lazy"
              allow="camera; microphone; clipboard-write; web-share"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-[#f4deb7]">{iframeLoaded ? "Formulario cargado." : "Cargando formulario…"}</div>
            <a
              href={BASE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold border border-[#e79c00] text-[#e79c00] hover:bg-[#fff4da]/10"
            >
              Abrir en nueva pestaña
            </a>
          </div>
        </div>
        <p className="mt-6 text-xs text-[#f4deb7] text-center">
          Al enviar este formulario aceptas nuestra <a href="/privacidad" className="underline">Política de Privacidad</a>. Usamos tus datos solo para crear tu guía nutricional y seguimiento opcional.
        </p>
      </section>
    </main>
  );
}




