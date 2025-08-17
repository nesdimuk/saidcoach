// src/app/pn/tablero/page.js
'use client';

import { useEffect, useMemo, useState } from 'react';
import { quickAdds } from '../../../lib/pn/mappings';
import { scoreDay } from '../../../lib/pn/score';
import { lookupAnyFood as lookupFood } from '../../../lib/pn/foodFinder';


export default function Tablero() {
  // --- claves de hoy (YYYY-MM-DD) ---
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const targetsKey = `pn:targets:${today}`;
  const entriesKey = `pn:entries:${today}`;
  const soundKey   = `pn:settings:sound`;
  const unknownKey = `pn:unknown_inputs`;

  // --- estado ---
  const [targets, setTargets] = useState(null);            // {P,C,G,V} desde /pn/start
  const [sum, setSum] = useState({ P: 0, C: 0, G: 0, V: 0 });
  const [pieces, setPieces] = useState([]);                // [{p,c,g,v,calidad}]
  const [soundOn, setSoundOn] = useState(true);            // toggle sonido

  // buscador de alimentos
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // --- helpers ---
  const aggregate = (arr) =>
    arr.reduce(
      (acc, x) => ({
        P: +(acc.P + (x.p || 0)).toFixed(1),
        C: +(acc.C + (x.c || 0)).toFixed(1),
        G: +(acc.G + (x.g || 0)).toFixed(1),
        V: +(acc.V + (x.v || 0)).toFixed(1),
      }),
      { P: 0, C: 0, G: 0, V: 0 }
    );

  const pct = (k) => {
    if (!targets || !targets[k]) return 0;
    const v = Math.min(1, (sum[k] || 0) / targets[k]);
    return Math.round(v * 100);
  };

  const beep = (hz = 440, ms = 180) => {
    if (!soundOn) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = hz; osc.type = 'sine';
    osc.start();
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + ms/1000);
    osc.stop(ctx.currentTime + ms/1000 + 0.02);
  };

  // --- montar: cargar targets, entradas y sonido ---
  useEffect(() => {
    const t = localStorage.getItem(targetsKey);
    if (t) setTargets(JSON.parse(t));

    const e = localStorage.getItem(entriesKey);
    if (e) {
      const arr = JSON.parse(e);
      setPieces(arr);
      setSum(aggregate(arr));
    }

    const savedSound = localStorage.getItem(soundKey);
    if (savedSound !== null) setSoundOn(savedSound === 'on');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persistir cambio de sonido
  useEffect(() => {
    localStorage.setItem(soundKey, soundOn ? 'on' : 'off');
  }, [soundOn]);

  // --- acciones base ---
  const add = (key) => {
    const a = quickAdds[key];
    if (!a) return;

    // Redondeo a porción completa por política "sin medias"
    const roundUp = (x) => (x > 0 && x < 1 ? 1 : x);
    const norm = {
      p: roundUp(a.p || 0),
      c: roundUp(a.c || 0),
      g: roundUp(a.g || 0),
      v: roundUp(a.v || 0),
      calidad: a.calidad,
    };

    const next = [...pieces, norm];
    setPieces(next);
    setSum(aggregate(next));
    localStorage.setItem(entriesKey, JSON.stringify(next));
    beep(norm.calidad==='verde'?520:norm.calidad==='amarillo'?420:320, 180);
  };

  const undo = () => {
    if (!pieces.length) return;
    const next = pieces.slice(0, -1);
    setPieces(next);
    setSum(aggregate(next));
    localStorage.setItem(entriesKey, JSON.stringify(next));
  };

  const resetDay = () => {
    localStorage.removeItem(entriesKey);
    setPieces([]); setSum({ P:0, C:0, G:0, V:0 });
  };

  // --- buscador de alimentos ---
  const openSearch = () => { setShowSearch(true); setQuery(''); setResults([]); };
  const onQuery = (q) => { setQuery(q); setResults(lookupFood(q)); };

  const rememberUnknown = (text) => {
    const arr = JSON.parse(localStorage.getItem(unknownKey) || '[]');
    arr.push({ text, date: today });
    localStorage.setItem(unknownKey, JSON.stringify(arr));
  };

  const addFoodItem = (item) => {
    // Expande sus piezas en entradas reales (qty siempre entero)
    const expanded = [];
    item.pieces.forEach(p => {
      for (let i = 0; i < (p.qty || 0); i++) {
        expanded.push({
          p: p.macro==='P'?1:0,
          c: p.macro==='C'?1:0,
          g: p.macro==='G'?1:0,
          v: p.macro==='V'?1:0,
          calidad: p.calidad
        });
      }
    });
    if (!expanded.length) return;

    const next = [...pieces, ...expanded];
    setPieces(next);
    setSum(aggregate(next));
    localStorage.setItem(entriesKey, JSON.stringify(next));
    const last = expanded[expanded.length-1];
    beep(last.calidad==='verde'?520:last.calidad==='amarillo'?420:320, 180);
    setShowSearch(false); setQuery(''); setResults([]);
  };

  // --- si no hay metas: CTA a /pn/start ---
  if (!targets) {
    return (
      <main className="mx-auto max-w-xl p-6 min-h-dvh bg-gray-50 text-gray-900">
        <h1 className="text-xl font-semibold mb-2">Tu rompecabezas de hoy</h1>
        <p className="mb-4">Primero define tus metas del día.</p>
        <a href="/pn/start" className="inline-block px-4 py-2 rounded-xl bg-black text-white">
          Ir a /pn/start
        </a>
      </main>
    );
  }

  // --- cálculos de UI ---
  const remaining = {
    P: Math.max(0, +(targets.P - sum.P).toFixed(1)),
    C: Math.max(0, +(targets.C - sum.C).toFixed(1)),
    G: Math.max(0, +(targets.G - sum.G).toFixed(1)),
    V: Math.max(0, +(targets.V - sum.V).toFixed(1)),
  };

  const qualityList = pieces.map((x) => x.calidad);
  const { score, color } = scoreDay(sum, targets, qualityList);

  const ColorPill = ({ color }) => {
    const cls =
      color === 'gold'
        ? 'bg-yellow-300 text-gray-900'
        : color === 'verde'
        ? 'bg-green-300 text-gray-900'
        : color === 'amarillo'
        ? 'bg-yellow-200 text-gray-900'
        : 'bg-red-600 text-white';
    return (
      <span className={`inline-block rounded-full px-2 py-1 text-xs ${cls}`}>
        {color.toUpperCase()}
      </span>
    );
  };

  const Card = ({ k, label }) => (
    <div className="rounded-2xl p-3 shadow bg-white border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-700">{label}</div>
        <div className="text-lg font-semibold text-gray-900">
          {sum[k]} / {targets[k]}
        </div>
      </div>
      <div className="w-full h-2 rounded bg-gray-100 overflow-hidden" aria-label={`Progreso ${label}`}>
        <div className="h-2 bg-emerald-600" style={{ width: `${pct(k)}%` }} />
      </div>
      <div className="text-xs text-gray-700 mt-1">Te faltan {remaining[k]}</div>
    </div>
  );

  return (
    <main className="mx-auto max-w-xl p-4 space-y-4 min-h-dvh bg-gray-50 text-gray-900">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Tu rompecabezas de hoy</h1>
          <div className="text-sm flex items-center gap-2">
            <ColorPill color={color} />
            <span>Score: {score}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm flex items-center gap-2">
            <input
              type="checkbox"
              checked={soundOn}
              onChange={(e) => setSoundOn(e.target.checked)}
              aria-label="Activar o desactivar sonido"
            />
            Sonido
          </label>

          <button
            onClick={undo}
            className="text-sm underline text-gray-800 hover:text-gray-900"
            aria-label="Deshacer último"
          >
            Deshacer
          </button>

          <button
            onClick={resetDay}
            className="text-sm underline text-gray-800 hover:text-gray-900"
            aria-label="Resetear día"
          >
            Resetear día
          </button>
        </div>
      </div>

      {/* resumen por frasco */}
      <div className="grid grid-cols-4 gap-3">
        <Card k="P" label="P" />
        <Card k="C" label="C" />
        <Card k="G" label="G" />
        <Card k="V" label="V" />
      </div>

      {/* acciones principales */}
      <div className="flex items-center justify-between">
        <button
          onClick={openSearch}
          className="rounded-xl px-3 py-2 bg-gray-900 text-white font-semibold"
        >
          Buscar alimento
        </button>
      </div>

      {/* botones por macro y calidad (todas +1) */}
      <div className="grid grid-cols-3 gap-3">
        {/* Proteína */}
        <button onClick={()=>add('P verde')}    className="rounded-xl p-3 shadow bg-green-700  hover:bg-green-800  text-white font-semibold">P Verde</button>
        <button onClick={()=>add('P amarilla')} className="rounded-xl p-3 shadow bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold">P Amarilla</button>
        <button onClick={()=>add('P roja')}     className="rounded-xl p-3 shadow bg-red-600    hover:bg-red-700    text-white font-semibold">P Roja</button>

        {/* Carbohidratos */}
        <button onClick={()=>add('C verde')}    className="rounded-xl p-3 shadow bg-green-700  hover:bg-green-800  text-white font-semibold">C Verde</button>
        <button onClick={()=>add('C amarilla')} className="rounded-xl p-3 shadow bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold">C Amarilla</button>
        <button onClick={()=>add('C roja')}     className="rounded-xl p-3 shadow bg-red-600    hover:bg-red-700    text-white font-semibold">C Roja</button>

        {/* Grasas */}
        <button onClick={()=>add('G verde')}    className="rounded-xl p-3 shadow bg-green-700  hover:bg-green-800  text-white font-semibold">G Verde</button>
        <button onClick={()=>add('G amarilla')} className="rounded-xl p-3 shadow bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold">G Amarilla</button>
        <button onClick={()=>add('G roja')}     className="rounded-xl p-3 shadow bg-red-600    hover:bg-red-700    text-white font-semibold">G Roja</button>

        {/* Verduras */}
        <button onClick={()=>add('+1V')}        className="rounded-xl p-3 shadow bg-emerald-700 hover:bg-emerald-800 text-white font-semibold col-span-3">+1 Verduras</button>
      </div>

      {/* historial */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-900">Piezas de hoy</h2>
        <ul className="text-sm space-y-1">
          {pieces.map((x, i) => (
            <li
              key={`${i}-${x.calidad}`}
              className={`px-2 py-1 rounded border ${
                x.calidad === 'verde'
                  ? 'bg-green-50 text-green-900 border-green-200'
                  : x.calidad === 'amarillo'
                  ? 'bg-yellow-50 text-yellow-900 border-yellow-200'
                  : 'bg-red-50 text-red-900 border-red-200'
              }`}
            >
              +P{x.p} +C{x.c} +G{x.g} +V{x.v} · {x.calidad}
            </li>
          ))}
          {!pieces.length && (
            <li className="text-gray-700">Aún no registras nada. Prueba con P Verde.</li>
          )}
        </ul>
      </div>

      {/* modal buscar alimento */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-full max-w-md rounded-2xl bg-white text-gray-900 p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Buscar alimento</h3>
              <button onClick={()=>setShowSearch(false)} className="text-sm underline">Cerrar</button>
            </div>

            <input
              autoFocus
              value={query}
              onChange={(e)=> onQuery(e.target.value)}
              onKeyDown={(e)=>{ if(e.key==='Enter' && !results.length && query){ rememberUnknown(query); setShowSearch(false); setQuery(''); } }}
              placeholder="ej: pollo, pan, lentejas…"
              className="w-full border rounded-lg p-2 mb-3"
            />

            <ul className="max-h-64 overflow-auto space-y-2">
              {results.map((it, idx)=>(
                <li key={idx} className="border rounded-lg p-2">
                  <div className="text-sm font-medium">{it.name}</div>
                  <div className="text-xs text-gray-600 mb-2">
                    {it.pieces.map((p,i)=>`${p.macro} ${p.calidad} x${p.qty}`).join(' · ')}
                  </div>
                  <button
                    onClick={()=>addFoodItem(it)}
                    className="text-sm px-3 py-1 rounded-md bg-emerald-600 text-white"
                  >
                    Agregar
                  </button>
                </li>
              ))}
              {!results.length && query && (
                <li className="text-sm text-gray-600">Sin resultados. Lo guardaremos para revisar.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}



