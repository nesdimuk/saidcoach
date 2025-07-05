'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function PortalAlumnos() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://v3portal.ptdistinction.com/v3/inside/integration/v1/portal.js?id=51a6e61dc5d5040dc259d17cbdc7c4cd';
    script.async = true;
    document.body.appendChild(script);

    window.ptd_param = {
      apk: 'faxisP2zww171433',
      domain: 'https://v3portal.ptdistinction.com',
    };
  }, []);

  return (
    <>
      <style>{`
        html, body {
          background-color: #ffffff !important;
          margin: 0;
          padding: 0;
          font-family: 'Arial', sans-serif;
        }

        .fade-in {
          opacity: 0;
          transform: translateY(30px);
          animation: fadeInUp 1s ease-out forwards;
        }

        .logo-anim {
          opacity: 0;
          transform: scale(0.95);
          animation: logoFade 1s ease-out forwards;
          animation-delay: 0.3s;
        }

        .texto-anim {
          opacity: 0;
          transform: translateY(10px);
          animation: textFade 1s ease-out forwards;
          animation-delay: 0.6s;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes logoFade {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes textFade {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        padding: '2rem'
      }}>
        <img
          src="/saidcoach-logo.svg"
          alt="SAID Coach Logo"
          className="logo-anim"
          style={{
            width: '160px',
            marginBottom: '20px'
          }}
        />

        <h1 className="texto-anim" style={{ fontSize: '2rem', margin: '0', textAlign: 'center' }}>
          Portal de Alumnos
        </h1>
        <p className="texto-anim" style={{ marginTop: '0.5rem', color: '#555', textAlign: 'center', maxWidth: '300px' }}>
          Inicia sesión para acceder a tus entrenamientos y progreso
        </p>

        <div
          id="ptd_portal"
          className="fade-in"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            padding: '32px',
            marginTop: '32px',
            width: '100%',
            maxWidth: '400px'
          }}
        ></div>
      </div>
    </>
  );
}










