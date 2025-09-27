import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import path from "path";
import fs from "fs/promises";

import { prisma } from "@/lib/prisma";
import { renderPdf } from "@/lib/pdf";

type AlumnoPayload = {
  nombre: string;
  edad: number;
  sexo: string;
  peso: number;
  estatura: number;
  actividad: string;
  objetivo: string;
  comidas: number;
  alimentos: string[] | string;
};

type PlanResponse = Record<string, unknown>;

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const PLANS_DIR = path.join(process.cwd(), "public", "plans");

async function ensurePlansDirectory() {
  await fs.mkdir(PLANS_DIR, { recursive: true });
}

function buildPrompt(alumno: AlumnoPayload) {
  const alimentos = Array.isArray(alumno.alimentos)
    ? alumno.alimentos.join(", ")
    : alumno.alimentos;

  return `Eres un nutricionista. Genera un menú detallado en formato JSON con la estructura {
  "meals": [
    {
      "name": "Desayuno",
      "items": [
        {"food": "", "quantity": "", "calories": 0, "macros": {"protein": 0, "carbs": 0, "fat": 0}}
      ],
      "totals": {"calories": 0, "protein": 0, "carbs": 0, "fat": 0}
    }
  ],
  "dailyTotals": {"calories": 0, "protein": 0, "carbs": 0, "fat": 0}
}.
Mi alumno se llama ${alumno.nombre}, tiene ${alumno.edad} años y es ${alumno.sexo}.
Pesa ${alumno.peso} kg, mide ${alumno.estatura} cm y su nivel de actividad es ${alumno.actividad}.
Objetivo: ${alumno.objetivo}. Realizará ${alumno.comidas} comidas al día.
Alimentos disponibles: ${alimentos}.
Devuelve únicamente el JSON solicitado.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { trainerId, alumno } = body as { trainerId?: string; alumno?: AlumnoPayload };

    if (!trainerId || !alumno) {
      return NextResponse.json({ error: "trainerId y datos del alumno son obligatorios" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY no configurada" }, { status: 500 });
    }

    const prompt = buildPrompt(alumno);

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [{ role: "user", content: prompt }],
    });

    const output = OpenAI.extractText(response).trim();

    if (!output) {
      return NextResponse.json({ error: "El modelo no entregó una respuesta válida" }, { status: 502 });
    }

    let parsedResult: PlanResponse;
    try {
      parsedResult = JSON.parse(output);
    } catch (error) {
      console.error("Respuesta del modelo no es JSON", error, output);
      return NextResponse.json(
        { error: "La respuesta del modelo no es JSON válido" },
        { status: 502 },
      );
    }

    const plan = await prisma.plan.create({
      data: {
        trainerId,
        traineeName: alumno.nombre,
        payloadJson: JSON.stringify(body),
        resultJson: JSON.stringify(parsedResult),
      },
    });

    await ensurePlansDirectory();

    const trainer = await prisma.trainer.findUnique({ where: { id: trainerId } });
    const pdfPath = path.join(PLANS_DIR, `${plan.id}.pdf`);
    const pdfContent = JSON.stringify(parsedResult, null, 2);

    await renderPdf(pdfContent, trainer?.logoUrl ?? null, pdfPath);

    const pdfUrl = `/plans/${plan.id}.pdf`;

    await prisma.plan.update({
      where: { id: plan.id },
      data: { pdfUrl },
    });

    return NextResponse.json({ planId: plan.id, result: parsedResult, pdfUrl });
  } catch (error) {
    console.error("Error al generar el plan", error);
    return NextResponse.json({ error: "No se pudo generar el plan" }, { status: 500 });
  }
}
