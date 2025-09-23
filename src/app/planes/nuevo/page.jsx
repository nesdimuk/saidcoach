"use client";

import { useMemo, useState } from "react";

const actividades = ["sedentario", "ligero", "moderado", "intenso"];
const objetivos = ["perder peso", "mantener peso", "ganar masa muscular"];

const initialAlumno = {
  nombre: "",
  edad: "",
  sexo: "",
  peso: "",
  estatura: "",
  actividad: actividades[0],
  objetivo: objetivos[0],
  comidas: "3",
  alimentos: "",
};

export default function NuevoPlanPage() {
  const [trainerId, setTrainerId] = useState("");
  const [alumno, setAlumno] = useState(initialAlumno);
  const [logoUrl, setLogoUrl] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [error, setError] = useState(null);

  const planTexto = useMemo(() => {
    if (!plan) return "";
    if (typeof plan.result === "string") return plan.result;
    try {
      return JSON.stringify(plan.result, null, 2);
    } catch (err) {
      console.error("No se pudo serializar el resultado del plan", err);
      return "";
    }
  }, [plan]);

  const handleInputChange = (field, value) => {
    setAlumno((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = async (event) => {
    event.preventDefault();

    const input = event.currentTarget.querySelector("input[type='file']");
    if (!input?.files?.length) {
      setError("Selecciona un archivo para subir");
      return;
    }

    if (!trainerId) {
      setError("Ingresa el ID del entrenador antes de subir un logo");
      return;
    }

    const file = input.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("trainerId", trainerId);

    try {
      setLoadingLogo(true);
      setError(null);
      const response = await fetch("/api/logo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let payload = { error: "No se pudo subir el logo" };
        try {
          payload = await response.json();
        } catch (err) {
          payload = { error: "No se pudo subir el logo" };
        }
        throw new Error(payload.error || "No se pudo subir el logo");
      }

      const payload = await response.json();
      setLogoUrl(payload.logoUrl);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "No se pudo subir el logo");
    } finally {
      setLoadingLogo(false);
      if (input) {
        input.value = "";
      }
    }
  };

  const handlePlanSubmit = async (event) => {
    event.preventDefault();

    if (!trainerId) {
      setError("Ingresa el ID del entrenador para generar el plan");
      return;
    }

    if (!alumno.nombre) {
      setError("Ingresa el nombre del alumno");
      return;
    }

    const payload = {
      trainerId,
      alumno: {
        nombre: alumno.nombre,
        edad: Number(alumno.edad) || 0,
        sexo: alumno.sexo,
        peso: Number(alumno.peso) || 0,
        estatura: Number(alumno.estatura) || 0,
        actividad: alumno.actividad,
        objetivo: alumno.objetivo,
        comidas: Number(alumno.comidas) || 0,
        alimentos: alumno.alimentos,
      },
    };

    try {
      setLoadingPlan(true);
      setError(null);
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let payloadError = { error: "No se pudo generar el plan" };
        try {
          payloadError = await response.json();
        } catch (err) {
          payloadError = { error: "No se pudo generar el plan" };
        }
        throw new Error(payloadError.error || "No se pudo generar el plan");
      }

      const result = await response.json();
      setPlan(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "No se pudo generar el plan");
    } finally {
      setLoadingPlan(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Generar nuevo plan alimenticio</h1>
        <p className="mt-2 text-gray-600">
          Completa los datos del alumno, sube el logo del entrenador y genera un menú personalizado.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <form className="space-y-4" onSubmit={handlePlanSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="trainerId">
              ID del entrenador
            </label>
            <input
              id="trainerId"
              value={trainerId}
              onChange={(event) => setTrainerId(event.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Ej. clksj9f0d0000x123abc"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">
                Nombre del alumno
              </label>
              <input
                id="nombre"
                value={alumno.nombre}
                onChange={(event) => handleInputChange("nombre", event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="edad">
                Edad
              </label>
              <input
                id="edad"
                type="number"
                min={0}
                value={alumno.edad}
                onChange={(event) => handleInputChange("edad", event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="sexo">
                Sexo
              </label>
              <select
                id="sexo"
                value={alumno.sexo}
                onChange={(event) => handleInputChange("sexo", event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              >
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="peso">
                Peso (kg)
              </label>
              <input
                id="peso"
                type="number"
                step="0.1"
                value={alumno.peso}
                onChange={(event) => handleInputChange("peso", event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="estatura">
                Estatura (cm)
              </label>
              <input
                id="estatura"
                type="number"
                value={alumno.estatura}
                onChange={(event) => handleInputChange("estatura", event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="actividad">
                Nivel de actividad
              </label>
              <select
                id="actividad"
                value={alumno.actividad}
                onChange={(event) => handleInputChange("actividad", event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              >
                {actividades.map((actividad) => (
                  <option key={actividad} value={actividad}>
                    {actividad}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="objetivo">
                Objetivo
              </label>
              <select
                id="objetivo"
                value={alumno.objetivo}
                onChange={(event) => handleInputChange("objetivo", event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              >
                {objetivos.map((objetivo) => (
                  <option key={objetivo} value={objetivo}>
                    {objetivo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="comidas">
                Número de comidas al día
              </label>
              <input
                id="comidas"
                type="number"
                min={1}
                max={10}
                value={alumno.comidas}
                onChange={(event) => handleInputChange("comidas", event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="alimentos">
                Alimentos disponibles
              </label>
              <textarea
                id="alimentos"
                value={alumno.alimentos}
                onChange={(event) => handleInputChange("alimentos", event.target.value)}
                rows={4}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Ej. pollo, arroz integral, verduras, yogur griego"
                required
              />
            </div>
          </div>

          {error && <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={loadingPlan}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
            >
              {loadingPlan ? "Generando..." : "Generar plan"}
            </button>

            {plan?.pdfUrl && (
              <a
                href={plan.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-indigo-600 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
              >
                Descargar PDF
              </a>
            )}
          </div>
        </form>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <form className="space-y-4" onSubmit={handleLogoUpload}>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="logo">
              Subir logo del entrenador
            </label>
            <input id="logo" type="file" accept="image/*" className="mt-1 block w-full text-sm text-gray-700" />
          </div>

          <button
            type="submit"
            disabled={loadingLogo}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            {loadingLogo ? "Subiendo..." : "Subir logo"}
          </button>

          {logoUrl && (
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="Logo del entrenador" className="h-16 w-16 rounded object-contain" />
              <span className="text-sm text-gray-600">Logo actualizado correctamente</span>
            </div>
          )}
        </form>
      </div>

      {plan && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Resultado del plan</h2>
          <pre className="mt-4 max-h-96 overflow-y-auto whitespace-pre-wrap rounded-md bg-gray-50 p-4 text-sm text-gray-800">
            {planTexto || "Sin datos"}
          </pre>
        </div>
      )}
    </div>
  );
}
