'use client';
import { useState, useEffect } from 'react';

function calcularProgreso(fechaCreacion, completados) {
  const inicio = new Date(fechaCreacion);
  const hoy = new Date();
  const diffTime = hoy - inicio;
  const diasTotales = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  if (diasTotales <= 0) return 0;
  return Math.round((completados.length / diasTotales) * 100);
}

export default function Habitos() {
  const [habitos, setHabitos] = useState([]);
  const [nuevoHabit, setNuevoHabit] = useState('');

  useEffect(() => {
    const almacenados = localStorage.getItem('habitos');
    if (almacenados) {
      setHabitos(JSON.parse(almacenados));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('habitos', JSON.stringify(habitos));
  }, [habitos]);

  const agregarHabito = () => {
    if (!nuevoHabit.trim()) return;
    const nuevo = {
      id: Date.now(),
      nombre: nuevoHabit.trim(),
      creado: new Date().toISOString(),
      completados: [],
    };
    setHabitos([...habitos, nuevo]);
    setNuevoHabit('');
  };

  const marcarHoy = (id) => {
    const hoy = new Date().toISOString().slice(0, 10);
    setHabitos(
      habitos.map((h) => {
        if (h.id === id) {
          const ya = h.completados.includes(hoy);
          const completados = ya
            ? h.completados.filter((d) => d !== hoy)
            : [...h.completados, hoy];
          return { ...h, completados };
        }
        return h;
      })
    );
  };

  return (
    <main className="max-w-xl mx-auto p-4 text-[#f4f1ec] bg-[#000000] min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">Seguimiento de Hábitos</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={nuevoHabit}
          onChange={(e) => setNuevoHabit(e.target.value)}
          placeholder="Nuevo hábito"
          className="flex-1 p-2 rounded text-black"
        />
        <button
          onClick={agregarHabito}
          className="bg-[#e79c00] hover:bg-[#d88f00] text-black font-bold py-2 px-4 rounded"
        >
          Agregar
        </button>
      </div>

      {habitos.length === 0 && (
        <p className="text-center text-[#f4deb7]">Aún no tienes hábitos registrados.</p>
      )}

      {habitos.map((h) => (
        <div key={h.id} className="mb-4 p-4 border border-[#f4deb7] rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">{h.nombre}</span>
            <button
              onClick={() => marcarHoy(h.id)}
              className="bg-[#e79c00] hover:bg-[#d88f00] text-black font-bold py-1 px-3 rounded"
            >
              {h.completados.includes(new Date().toISOString().slice(0,10)) ? 'Desmarcar' : 'Hecho hoy'}
            </button>
          </div>
          <p className="text-sm text-[#f4deb7]">
            Progreso total: {calcularProgreso(h.creado, h.completados)}%
          </p>
        </div>
      ))}
    </main>
  );
}
