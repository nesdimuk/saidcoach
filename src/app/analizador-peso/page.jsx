"use client";

import { useMemo, useState, useRef } from "react";
import jsPDF from "jspdf";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

// Configuración: % de peso corporal por semana considerado saludable
const HEALTHY_RATE_MIN_PCT = 0.5; // Actualizado a 0.5%
const HEALTHY_RATE_MAX_PCT = 1.0;

function toISODate(d) {
  const off = d.getTimezoneOffset();
  const d2 = new Date(d.getTime() - off * 60 * 1000);
  return d2.toISOString().slice(0, 10);
}
function addDays(base, days) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}
function parseNumber(n) {
  if (n === undefined || n === null || n === "") return null;
  const v = Number(String(n).replace(",", "."));
  return Number.isFinite(v) ? v : null;
}
function promedio(nums) {
  const fil = nums.filter((x) => x !== null);
  if (!fil.length) return null;
  const sum = fil.reduce((a, b) => a + b, 0);
  return sum / fil.length;
}
function format(n, digits = 2) {
  if (n === null || Number.isNaN(n)) return "—";
  return Number(n).toFixed(digits).replace(".", ",");
}

// Datos de demostración para pérdida de peso RAZONABLE (0.5% - 1.0%)
const reasonableLossDemoData = () => {
  const base = addDays(new Date(), -13);
  const startWeight = 90;
  const dailyDecrease = 0.08; // Genera aprox. 0.62% semanal
  return Array.from({ length: 14 }).map((_, i) => ({
    fecha: toISODate(addDays(base, i)),
    peso: String((startWeight - i * dailyDecrease).toFixed(2)),
  }));
};

// Datos de demostración para pérdida de peso MUY LENTA (< 0.5%)
const slowLossDemoData = () => {
  const base = addDays(new Date(), -13);
  const startWeight = 90;
  const dailyDecrease = 0.03; // Genera aprox. 0.23% semanal
  return Array.from({ length: 14 }).map((_, i) => ({
    fecha: toISODate(addDays(base, i)),
    peso: String((startWeight - i * dailyDecrease).toFixed(2)),
  }));
};

// Datos de demostración para pérdida de peso MUY RÁPIDA (> 1.0%)
const fastLossDemoData = () => {
  const base = addDays(new Date(), -13);
  const startWeight = 90;
  const dailyDecrease = 0.15; // Genera aprox. 1.17% semanal
  return Array.from({ length: 14 }).map((_, i) => ({
    fecha: toISODate(addDays(base, i)),
    peso: String((startWeight - i * dailyDecrease).toFixed(2)),
  }));
};


// Datos vacíos
const emptyRows = () => {
  const base = addDays(new Date(), -13);
  return Array.from({ length: 14 }).map((_, i) => ({
    fecha: toISODate(addDays(base, i)),
    peso: "",
  }));
};

export default function Analizador14DiasPeso() {
  const [rows, setRows] = useState(reasonableLossDemoData()); // Cambiado para iniciar con demo razonable
  const [pesoReferencia, setPesoReferencia] = useState("");
  const containerRef = useRef(null);

  const pesos = useMemo(() => rows.map((r) => parseNumber(r.peso)), [rows]);
  const week1 = useMemo(() => pesos.slice(0, 7), [pesos]);
  const week2 = useMemo(() => pesos.slice(7, 14), [pesos]);
  const prom1 = useMemo(() => promedio(week1), [week1]);
  const prom2 = useMemo(() => promedio(week2), [week2]);

  const chartData = useMemo(
    () =>
      rows.map((r, i) => ({
        idx: i + 1,
        fecha: r.fecha ? r.fecha.slice(5) : String(i + 1),
        peso: parseNumber(r.peso),
      })),
    [rows]
  );

  const delta = useMemo(
    () => (prom1 !== null && prom2 !== null ? prom2 - prom1 : null),
    [prom1, prom2]
  );
  const perdida = useMemo(() => (delta !== null ? -delta : null), [delta]);

  const pesoBase = useMemo(() => {
    const pref = parseNumber(pesoReferencia);
    if (pref) return pref;
    const first = pesos.find((p) => p !== null) ?? null;
    return first;
  }, [pesoReferencia, pesos]);

  const pctSemana = useMemo(() => {
    if (perdida === null || !pesoBase) return null;
    return (perdida / pesoBase) * 100;
  }, [perdida, pesoBase]);

  const veredicto = useMemo(() => {
    if (pctSemana === null) return "Insuficiente información";
    // MENSAJE ACTUALIZADO: Añadida recomendación de alimentos menos procesados
    if (pctSemana < HEALTHY_RATE_MIN_PCT) return "Pérdida de peso muy lenta (quitar 1-2 porciones de carbohidratos y/o grasas, y escoger alimentos menos procesados)";
    // MENSAJE ACTUALIZADO: Añadida recomendación sobre porciones de proteína
    if (pctSemana > HEALTHY_RATE_MAX_PCT) return "Pérdida de peso muy rápida (agregar 1-2 porciones de carbohidratos y/o grasas para evitar pérdida de masa muscular. Chequear que las palmas de proteína que consume no estén debajo de su requerimiento.)";
    return "Pérdida de peso razonable (¡excelente progreso! Mantén tus porciones y tu plan actual.)";
  }, [pctSemana]);

  function setCell(i, field, value) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  }

  function resetFechas(desde) {
    if (!desde) return;
    const d0 = new Date(desde);
    setRows((prev) =>
      prev.map((row, i) => ({
        ...row,
        fecha: toISODate(addDays(d0, i)),
      }))
    );
  }

  // Funciones para manejar los datos
  function clearData() {
    setRows(emptyRows());
    setPesoReferencia("");
  }

  function loadReasonableDemoData() {
    setRows(reasonableLossDemoData());
    setPesoReferencia("");
  }

  function loadSlowLossDemoData() {
    setRows(slowLossDemoData());
    setPesoReferencia("");
  }

  function loadFastLossDemoData() {
    setRows(fastLossDemoData());
    setPesoReferencia("");
  }

  // Función para descargar el informe como PDF utilizando jsPDF directamente
  function descargarPDF() {
    const doc = new jsPDF();
    let y = 20; // Posición vertical inicial
    const margin = 14; // Margen izquierdo/derecho

    // Título del informe
    doc.setFontSize(20);
    doc.setTextColor(231, 156, 0); // Color del título (similar a #e79c00)
    doc.text("Informe de Progreso de Peso (14 días)", margin, y);
    y += 10;
    doc.setTextColor(0, 0, 0); // Restaurar color de texto a negro

    // Línea separadora
    doc.setDrawColor(200, 200, 200); // Gris claro
    doc.line(margin, y, 210 - margin, y); // x1, y1, x2, y2 (A4 width 210mm)
    y += 10;

    // Resumen de promedios y veredicto
    doc.setFontSize(12);
    doc.text(`Promedio Semana 1: ${format(prom1)} kg`, margin, y);
    y += 7;
    doc.text(`Promedio Semana 2: ${format(prom2)} kg`, margin, y);
    y += 7;
    doc.text(`Diferencia (S2 - S1): ${format(delta)} kg`, margin, y);
    y += 7;
    doc.text(`"Pérdida" semanal: ${format(perdida)} kg`, margin, y);
    y += 7;
    doc.text(`% semanal (sobre peso ref.): ${pctSemana !== null ? pctSemana.toFixed(2).replace(".", ",") + "%" : "—"}`, margin, y);
    y += 10;

    // Veredicto con color
    let veredictoColor;
    if (veredicto.includes("razonable")) {
        veredictoColor = [34, 139, 34]; // Verde
    } else if (veredicto.includes("rápida")) {
        veredictoColor = [255, 0, 0]; // Rojo
    } else if (veredicto.includes("lenta")) {
        veredictoColor = [255, 165, 0]; // Naranja
    } else {
        veredictoColor = [100, 100, 100]; // Gris
    }
    doc.setTextColor(veredictoColor[0], veredictoColor[1], veredictoColor[2]);
    doc.setFontSize(11); // Reducido el tamaño de fuente del veredicto
    // Ajuste para que el texto del veredicto no se salga de la página
    doc.text(`Veredicto: ${veredicto}`, margin, y, { maxWidth: doc.internal.pageSize.getWidth() - (2 * margin) });
    y += 15; // Ajuste para el espacio después del veredicto, considerando el posible salto de línea
    doc.setTextColor(0, 0, 0); // Restaurar color de texto a negro
    doc.setFontSize(12);

    // --- Tablas de datos diarios (implementación manual, lado a lado) ---
    doc.text("Registro de Pesos Diarios:", margin, y);
    y += 8;

    const cellPadding = 1.5; // Reducido el padding de las celdas
    const lineHeight = 6; // Reducida la altura de línea
    const colWidths = [15, 40, 35]; // Ancho para Día, Fecha, Peso (total 90mm por tabla)
    const table1X = margin;
    const table2X = margin + colWidths[0] + colWidths[1] + colWidths[2] + 5; // 5mm de espacio entre tablas
    let currentTableY = y;

    // Dibujar cabeceras de ambas tablas
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');

    // Cabecera Semana 1
    doc.setFillColor(243, 244, 246);
    doc.rect(table1X, currentTableY, colWidths[0] + colWidths[1] + colWidths[2], lineHeight + cellPadding * 2, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(table1X, currentTableY, colWidths[0] + colWidths[1] + colWidths[2], lineHeight + cellPadding * 2, 'S');
    doc.text("Semana 1", table1X + cellPadding, currentTableY + lineHeight + cellPadding - 3); // Título de semana
    let headerYOffset = 3; // Pequeño ajuste para el título de semana
    doc.text("Día", table1X + cellPadding, currentTableY + lineHeight + cellPadding + headerYOffset);
    doc.text("Fecha", table1X + colWidths[0] + cellPadding, currentTableY + lineHeight + cellPadding + headerYOffset);
    doc.text("Peso (kg)", table1X + colWidths[0] + colWidths[1] + cellPadding, currentTableY + lineHeight + cellPadding + headerYOffset);

    // Cabecera Semana 2
    doc.setFillColor(243, 244, 246);
    doc.rect(table2X, currentTableY, colWidths[0] + colWidths[1] + colWidths[2], lineHeight + cellPadding * 2, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(table2X, currentTableY, colWidths[0] + colWidths[1] + colWidths[2], lineHeight + cellPadding * 2, 'S');
    doc.text("Semana 2", table2X + cellPadding, currentTableY + lineHeight + cellPadding - 3); // Título de semana
    doc.text("Día", table2X + cellPadding, currentTableY + lineHeight + cellPadding + headerYOffset);
    doc.text("Fecha", table2X + colWidths[0] + cellPadding, currentTableY + lineHeight + cellPadding + headerYOffset);
    doc.text("Peso (kg)", table2X + colWidths[0] + colWidths[1] + cellPadding, currentTableY + lineHeight + cellPadding + headerYOffset);

    currentTableY += lineHeight + cellPadding * 2; // Mover Y después de las cabeceras
    doc.setFont(undefined, 'normal'); // Restaurar a normal
    doc.setFontSize(9);

    // Dibujar filas de datos para ambas tablas
    for (let i = 0; i < 7; i++) { // Hay 7 días por semana
      const row1 = rows[i];
      const row2 = rows[i + 7]; // Datos de la segunda semana

      // Alternar color de fondo de fila
      if (i % 2 === 1) {
        doc.setFillColor(249, 250, 251); // Color de filas alternas (bg-gray-50)
        doc.rect(table1X, currentTableY, colWidths[0] + colWidths[1] + colWidths[2], lineHeight + cellPadding * 2, 'F');
        doc.rect(table2X, currentTableY, colWidths[0] + colWidths[1] + colWidths[2], lineHeight + cellPadding * 2, 'F');
      }

      doc.setDrawColor(200, 200, 200); // Color del borde
      doc.rect(table1X, currentTableY, colWidths[0] + colWidths[1] + colWidths[2], lineHeight + cellPadding * 2, 'S');
      doc.rect(table2X, currentTableY, colWidths[0] + colWidths[1] + colWidths[2], lineHeight + cellPadding * 2, 'S');

      // Datos Semana 1
      let cellX1 = table1X + cellPadding;
      doc.text(String(i + 1), cellX1, currentTableY + lineHeight + cellPadding);
      cellX1 += colWidths[0];
      doc.text(row1.fecha, cellX1, currentTableY + lineHeight + cellPadding);
      cellX1 += colWidths[1];
      doc.text(format(parseNumber(row1.peso)), cellX1, currentTableY + lineHeight + cellPadding);

      // Datos Semana 2
      let cellX2 = table2X + cellPadding;
      doc.text(String(i + 8), cellX2, currentTableY + lineHeight + cellPadding);
      cellX2 += colWidths[0];
      doc.text(row2.fecha, cellX2, currentTableY + lineHeight + cellPadding);
      cellX2 += colWidths[1];
      doc.text(format(parseNumber(row2.peso)), cellX2, currentTableY + lineHeight + cellPadding);

      currentTableY += lineHeight + cellPadding * 2;
    }

    y = currentTableY + 10; // Actualizar 'y' para el siguiente elemento después de las tablas

    // --- GRÁFICO DE PESO ---
    // No se añade una nueva página aquí para intentar que quepa todo
    doc.setFontSize(16);
    doc.setTextColor(231, 156, 0);
    doc.text("Gráfico de Progreso de Peso", margin, y);
    y += 10;
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, 210 - margin, y);
    y += 10;

    const chartAreaX = margin + 10; // Inicio del área del gráfico
    const chartAreaY = y + 10; // Inicio del área del gráfico
    const chartWidth = 160; // Ancho del gráfico en mm
    const chartHeight = 60; // Alto del gráfico en mm (REDUCIDO para que quepa)

    // Dibujar el recuadro del gráfico
    doc.rect(chartAreaX, chartAreaY, chartWidth, chartHeight);

    // Calcular escala para el peso (eje Y)
    const validPesos = pesos.filter(p => p !== null);
    const minPeso = validPesos.length > 0 ? Math.floor(Math.min(...validPesos) - 1) : 0; // Redondear hacia abajo y dar un margen
    const maxPeso = validPesos.length > 0 ? Math.ceil(Math.max(...validPesos) + 1) : 100; // Redondear hacia arriba y dar un margen
    const rangePeso = maxPeso - minPeso;
    const scaleY = chartHeight / (rangePeso > 0 ? rangePeso : 1); // Evitar división por cero

    // Dibujar eje Y y etiquetas de peso
    doc.setFontSize(8);
    for (let i = 0; i <= rangePeso; i += (rangePeso > 5 ? 2 : 1)) { // Etiquetas cada 1 o 2 kg
      const pesoLabel = minPeso + i;
      const yPos = chartAreaY + chartHeight - (pesoLabel - minPeso) * scaleY;
      doc.text(String(pesoLabel), chartAreaX - 8, yPos + 2); // Etiqueta de peso
      doc.line(chartAreaX, yPos, chartAreaX + chartWidth, yPos); // Línea de la grilla horizontal
    }
    doc.text("Peso (kg)", chartAreaX - 15, chartAreaY + chartHeight / 2, { angle: 90 }); // Etiqueta del eje Y

    // Dibujar eje X y etiquetas de día
    const scaleX = rows.length > 1 ? chartWidth / (rows.length - 1) : chartWidth;
    doc.setFontSize(8);
    rows.forEach((row, i) => {
      const xPos = chartAreaX + i * scaleX;
      doc.text(String(i + 1), xPos, chartAreaY + chartHeight + 5); // Etiqueta del día
      if (i > 0 && i < rows.length -1) { // Líneas de grilla verticales
        doc.line(xPos, chartAreaY, xPos, chartAreaY + chartHeight);
      }
    });
    doc.text("Día", chartAreaX + chartWidth / 2, chartAreaY + chartHeight + 10); // Etiqueta del eje X


    // Dibujar la línea de peso
    doc.setDrawColor(231, 156, 0); // Color de la línea del gráfico (similar a #e79c00)
    doc.setLineWidth(0.5); // Grosor de la línea
    let prevX = null;
    let prevY = null;

    chartData.forEach((point, i) => {
      if (point.peso !== null) {
        const xPos = chartAreaX + i * scaleX;
        const yPos = chartAreaY + chartHeight - (point.peso - minPeso) * scaleY;

        // Dibujar punto
        doc.circle(xPos, yPos, 1, 'F'); // Punto pequeño relleno

        if (prevX !== null && prevY !== null) {
          doc.line(prevX, prevY, xPos, yPos); // Dibujar segmento de línea
        }
        prevX = xPos;
        prevY = yPos;
      } else {
        // Si hay un valor nulo, resetear la línea para que no se conecte a través de datos faltantes
        prevX = null;
        prevY = null;
      }
    });

    doc.save("informe_peso_14dias_resumen_con_grafico.pdf");
  }

  return (
    <div
      ref={containerRef}
      className="max-w-3xl mx-auto p-4 sm:p-6 text-gray-900 bg-white rounded-xl"
    >
      <div className="mb-6 flex items-center gap-3">
        {/* El logo ha sido eliminado completamente */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#e79c00]">
            Analizador de peso (14 días)
          </h1>
          <p className="text-sm text-gray-700 mt-1">
            Ingresa tus pesos diarios por 14 días. El sistema compara el promedio de la semana 1 vs.
            semana 2 y estima el ritmo semanal de cambio (% del peso corporal).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Fecha inicio (Día 1)</span>
          <input
            className="border rounded-xl p-2"
            type="date"
            value={rows[0]?.fecha || ""}
            onChange={(e) => resetFechas(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Peso de referencia (opcional)</span>
          <input
            className="border rounded-xl p-2"
            placeholder="Usado para calcular % semanal"
            value={pesoReferencia}
            onChange={(e) => setPesoReferencia(e.target.value)}
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-2xl border">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-800">
              <th className="text-left p-3">#</th>
              <th className="text-left p-3">Fecha</th>
              <th className="text-left p-3">Peso (kg)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="odd:bg-white even:bg-gray-50">
                <td className="p-3">{i + 1}</td>
                <td className="p-3">
                  <input
                    type="date"
                    className="border rounded-lg p-2"
                    value={r.fecha}
                    onChange={(e) => setCell(i, "fecha", e.target.value)}
                  />
                </td>
                <td className="p-3">
                  <input
                    inputMode="decimal"
                    placeholder="Ej: 72.4"
                    className="border rounded-lg p-2 w-32"
                    value={r.peso}
                    onChange={(e) => setCell(i, "peso", e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Gráfico */}
      <div className="mt-6 p-4 rounded-2xl border bg-white">
        <h2 className="font-semibold mb-2 text-[#e79c00]">Gráfico (14 días)</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
              <Tooltip
                formatter={(value) => (value == null ? "—" : `${Number(value).toFixed(2)} kg`)}
                labelFormatter={(l) => `Fecha: ${l}`}
              />
              {rows[6]?.fecha && (
                <ReferenceLine x={rows[6].fecha.slice(5)} stroke="#999" strokeDasharray="4 4" />
              )}
              <Line type="monotone" dataKey="peso" stroke="#e79c00" strokeWidth={2} dot={{ r: 3 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          La línea punteada marca el corte entre Semana 1 y Semana 2.
        </p>
      </div>

      {/* Resumen + Evaluación */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div className="p-4 rounded-2xl border bg-white">
          <h2 className="font-semibold mb-2 text-[#e79c00]">Resumen</h2>
          <ul className="space-y-1 text-sm">
            <li>Promedio Semana 1: <strong>{format(prom1)} kg</strong></li>
            <li>Promedio Semana 2: <strong>{format(prom2)} kg</strong></li>
            <li>Diferencia (S2 - S1): <strong>{format(delta)} kg</strong></li>
            <li>"Pérdida" semanal: <strong>{format(perdida)} kg</strong></li>
            <li>% semanal (sobre peso ref.): <strong>{pctSemana !== null ? pctSemana.toFixed(2).replace(".", ",") + "%" : "—"}</strong></li>
          </ul>
        </div>
        <div className="p-4 rounded-2xl border bg-white">
          <h2 className="font-semibold mb-2 text-[#e79c00]">Evaluación</h2>
          <p className="text-sm">
            Rango recomendado: {HEALTHY_RATE_MIN_PCT}% a {HEALTHY_RATE_MAX_PCT}% del peso corporal por semana.
          </p>
          <p
            className={`mt-2 text-base font-bold ${
              veredicto.includes("razonable")
                ? "text-green-600"
                : veredicto.includes("rápida")
                ? "text-red-600"
                : veredicto.includes("lenta")
                ? "text-amber-600"
                : "text-gray-600"
            }`}
          >
            {veredicto}
          </p>
        </div>
      </div>

      {/* Botones de datos y descarga */}
      <div className="mt-6 p-4 border rounded-2xl bg-gray-50">
        <h2 className="font-semibold mb-2 text-[#e79c00]">Opciones</h2>
        <div className="flex flex-wrap gap-3">
          <button onClick={descargarPDF} className="btn-brand px-4 py-2 rounded-xl text-white text-sm font-medium hover:opacity-90">
            Descargar informe (.pdf)
          </button>
          <button onClick={clearData} className="btn-dark px-4 py-2 rounded-xl text-white text-sm font-medium hover:opacity-90">
            Borrar todos los datos
          </button>
          <button onClick={loadSlowLossDemoData} className="btn-dark px-4 py-2 rounded-xl text-white text-sm font-medium hover:opacity-90">
            Generar demo (lenta)
          </button>
          <button onClick={loadReasonableDemoData} className="btn-dark px-4 py-2 rounded-xl text-white text-sm font-medium hover:opacity-90">
            Generar demo (razonable)
          </button>
          <button onClick={loadFastLossDemoData} className="btn-dark px-4 py-2 rounded-xl text-white text-sm font-medium hover:opacity-90">
            Generar demo (rápida)
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-600 mt-6">
        Nota: este cálculo usa promedios semanales para reducir el ruido diario. Ajusta el rango saludable según tu criterio profesional.
      </p>
    </div>
  );
}















