"use client";

import { FormEvent, useMemo, useState } from "react";

type AlumnoFormState = {
  nombre: string;
  edad: string;
  sexo: string;
  peso: string;
  estatura: string;
  actividad: string;
  objetivo: string;
  comidas: string;
  alimentos: string;
};

type MacroBreakdown = {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
};

type MealItem = {
  food?: string;
  quantity?: string;
  calories?: number;
  macros?: MacroBreakdown;
};

type MealPlan = {
  name?: string;
  items?: MealItem[];
  totals?: MacroBreakdown;
};

type PlanData = {
  meals?: MealPlan[];
  dailyTotals?: MacroBreakdown;
  [key: string]: unknown;
};

type GeneratedPlan = {
  planId: string;
  result: PlanData;
  pdfUrl?: string;
};

const actividades = ["sedentario", "ligero", "moderado", "intenso"];
const objetivos = ["perder peso", "mantener peso", "ganar masa muscular"];

const initialAlumno: AlumnoFormState = {
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

function formatNumber(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return value % 1 === 0 ? value.toString() : value.toFixed(1);
}

function renderMeals(meals?: MealPlan[]) {
  if (!meals?.length) return null;

  return (
    <div className="space-y-6">
      {meals.map((meal, index) => (
        <div key={meal.name ?? index} className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900">{meal.name ?? `Comida ${index + 1}`}</h3>
          {meal.items?.length ? (
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              {meal.items.map((item, itemIndex) => (
                <li key={`${meal.name}-${itemIndex}`} className="rounded-md bg-gray-50 p-2">
                  <p className="font-medium text-gray-900">{item.food ?? "Alimento"}</p>
                  <p className="text-gray-600">Cantidad: {item.quantity ?? "-"}</p>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                    <span>Calorías: {formatNumber(item.calories)}</span>
                    {item.macros?.protein !== undefined && (
                      <span>Proteína: {formatNumber(item.macros.protein)} g</span>
                    )}
                    {item.macros?.carbs !== undefined && (
                      <span>Carbohidratos: {formatNumber(item.macros.carbs)} g</span>
                    )}
                    {item.macros?.fat !== undefined && (
                      <span>Grasas: {formatNumber(item.macros.fat)} g</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-gray-600">Sin detalles para esta comida.</p>
          )}

          {meal.totals && (
            <div className="mt-4 rounded-md bg-white p-3 text-sm text-gray-700 shadow-inner">
              <h4 className="font-medium text-gray-900">Totales de la comida</h4>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-600">
                <span>Calorías: {formatNumber(meal.totals.calories)}</span>
                <span>Proteína: {formatNumber(meal.totals.protein)} g</span>
                <span>Carbohidratos: {formatNumber(meal.totals.carbs)} g</span>
                <span>Grasas: {formatNumber(meal.totals.fat)} g</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function PlanPreview({ data }: { data: PlanData }) {
  const mealsContent = renderMeals(data.meals);
  const fallback = useMemo(() => JSON.stringify(data, null, 2), [data]);

  return (
    <div className="space-y-4">
      {mealsContent ?? (
        <pre className="whitespace-pre-wrap rounded-md bg-gray-900 p-4 text-sm text-gray-100">{fallback}</pre>
      )}

      {data.dailyTotals && (
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900">
          <h3 className="text-base font-semibold">Totales diarios</h3>
          <div className="mt-2 flex flex-wrap gap-4">
            <span>Calorías: {formatNumber(data.dailyTotals.calories)}</span>
            <span>Proteína: {formatNumber(data.dailyTotals.protein)} g</span>
            <span>Carbohidratos: {formatNumber(data.dailyTotals.carbs)} g</span>
            <span>Grasas: {formatNumber(data.dailyTotals.fat)} g</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NuevoPlanPage() {
  const [trainerId, setTrainerId] = useState("");
  const [alumno, setAlumno] = useState<AlumnoFormState>(initialAlumno);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof AlumnoFormState, value: string) => {
    setAlumno((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const input = event.currentTarget.querySelector<HTMLInputElement>("input[type='file']");
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
        const payload = await response.json().catch(() => ({ error: "No se pudo subir el logo" }));
        throw new Error(payload.error ?? "No se pudo subir el logo");
      }

      const payload = (await response.json()) as { logoUrl: string };
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

  const handlePlanSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trainerId) {
      setError("Ingresa el ID del entrenador para generar el plan");
      return;
    }

    if (!alumno.nombre) {
      setError("Ingresa el nombre del alumno");
      return;
    }

    const alimentosList = alumno.alimentos
      .split(/,|\n/)
      .map((item) => item.trim())
      .filter(Boolean);

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
        alimentos: alimentosList,
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
        const payloadError = await response.json().catch(() => ({ error: "No se pudo generar el plan" }));
        throw new Error(payloadError.error ?? "No se pudo generar el plan");
      }

      const result = (await response.json()) as GeneratedPlan;
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
        <form className="space-y-6" onSubmit={handlePlanSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="trainerId">
                ID del entrenador
              </label>
              <input
                id="trainerId"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={trainerId}
                onChange={(event) => setTrainerId(event.target.value)}
                placeholder="Ej. tr_123"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">
                Nombre del alumno
              </label>
              <input
                id="nombre"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={alumno.nombre}
                onChange={(event) => handleInputChange("nombre", event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="edad">
                Edad
              </label>
              <input
                id="edad"
                type="number"
                min={0}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={alumno.edad}
                onChange={(event) => handleInputChange("edad", event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="sexo">
                Sexo
              </label>
              <input
                id="sexo"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={alumno.sexo}
                onChange={(event) => handleInputChange("sexo", event.target.value)}
                placeholder="hombre, mujer, etc."
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="peso">
                Peso (kg)
              </label>
              <input
                id="peso"
                type="number"
                min={0}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={alumno.peso}
                onChange={(event) => handleInputChange("peso", event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="estatura">
                Estatura (cm)
              </label>
              <input
                id="estatura"
                type="number"
                min={0}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={alumno.estatura}
                onChange={(event) => handleInputChange("estatura", event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="actividad">
                Nivel de actividad
              </label>
              <select
                id="actividad"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={alumno.actividad}
                onChange={(event) => handleInputChange("actividad", event.target.value)}
              >
                {actividades.map((actividad) => (
                  <option key={actividad} value={actividad}>
                    {actividad}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="objetivo">
                Objetivo
              </label>
              <select
                id="objetivo"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={alumno.objetivo}
                onChange={(event) => handleInputChange("objetivo", event.target.value)}
              >
                {objetivos.map((objetivo) => (
                  <option key={objetivo} value={objetivo}>
                    {objetivo}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="comidas">
                Número de comidas
              </label>
              <input
                id="comidas"
                type="number"
                min={1}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={alumno.comidas}
                onChange={(event) => handleInputChange("comidas", event.target.value)}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="alimentos">
                Alimentos disponibles (separados por comas o líneas)
              </label>
              <textarea
                id="alimentos"
                rows={3}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={alumno.alimentos}
                onChange={(event) => handleInputChange("alimentos", event.target.value)}
                placeholder="arroz, pollo, huevos, manzana"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loadingPlan}
            >
              {loadingPlan ? "Generando..." : "Generar plan"}
            </button>
          </div>
        </form>

        <form className="mt-6 flex flex-col gap-3 md:flex-row md:items-center" onSubmit={handleLogoUpload}>
          <input type="file" accept="image/*" className="text-sm text-gray-600" />
          <button
            type="submit"
            className="w-full rounded-md bg-white px-4 py-2 text-sm font-medium text-indigo-600 ring-1 ring-inset ring-indigo-200 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
            disabled={loadingLogo}
          >
            {loadingLogo ? "Subiendo..." : "Subir logo"}
          </button>
        </form>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {plan && (
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900">Resultado del plan</h2>
            <p className="mt-1 text-sm text-gray-600">
              Comparte este plan con tu alumno o descárgalo como PDF.
            </p>

            <div className="mt-6">
              <PlanPreview data={plan.result} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {plan.pdfUrl && (
                <a
                  href={`/api/plan/${plan.planId}/pdf`}
                  className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-500"
                >
                  Descargar PDF
                </a>
              )}
              {logoUrl && (
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                  Logo actualizado
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
