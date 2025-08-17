'use client';
import { useState } from 'react';
import { computeTargetsMujer } from '../../../lib/pn/targets';
import { useRouter } from 'next/navigation';

export default function Start() {
  const router = useRouter();
  const [obj, setObj]   = useState('perdida');      // perdida | mantenimiento | musculo
  const [pref, setPref] = useState('balanceado');   // balanceado | alto_carbo | alto_grasa
  const [entreno, setEntreno] = useState(false);

  const saveAndGo = () => {
    const t = computeTargetsMujer(obj, pref, entreno);
    const key = `pn:targets:${new Date().toISOString().slice(0,10)}`;
    localStorage.setItem(key, JSON.stringify({ ...t, obj, pref, entreno }));
    router.push('/pn/tablero');
  };

  const Chip = ({active,onClick,children}) => (
    <button onClick={onClick}
      className={`p-2 rounded-xl border text-sm ${active?'bg-black text-white':'bg-white hover:bg-gray-50'}`}>
      {children}
    </button>
  );

  return (
    <main className="mx-auto max-w-md p-5 space-y-6">
      <h1 className="text-2xl font-semibold">Configura tu día</h1>

      <section className="space-y-2">
        <p className="text-sm font-medium">Objetivo</p>
        <div className="grid grid-cols-3 gap-2">
          {['perdida','mantenimiento','musculo'].map((o)=>(
            <Chip key={o} active={obj===o} onClick={()=>setObj(o)}>{o}</Chip>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-sm font-medium">Preferencia</p>
        <div className="grid grid-cols-3 gap-2">
          {['balanceado','alto_carbo','alto_grasa'].map((p)=>(
            <Chip key={p} active={pref===p} onClick={()=>setPref(p)}>{p.replace('_',' ')}</Chip>
          ))}
        </div>
      </section>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={entreno} onChange={e=>setEntreno(e.target.checked)} />
        ¿Entrenas fuerte hoy?
      </label>

      <button onClick={saveAndGo}
        className="w-full p-3 rounded-xl bg-emerald-600 text-white font-semibold">
        Crear mis objetivos de hoy
      </button>

      <p className="text-xs text-gray-500">
        Mujer v1: P/C/G 4–6; Verduras 3–5. Ajuste semanal si hace falta.
      </p>
    </main>
  );
}
