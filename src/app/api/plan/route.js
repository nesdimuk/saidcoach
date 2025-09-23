import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs/promises";

import { OpenAIClient } from "@/lib/openai-client";
import { renderPdf } from "@/lib/pdf";

const prisma = new PrismaClient();
const PLANS_DIR = path.join(process.cwd(), "public", "plans");

async function ensurePlansDirectory() {
  await fs.mkdir(PLANS_DIR, { recursive: true });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { trainerId, alumno } = body || {};

    if (!trainerId || !alumno) {
      return NextResponse.json(
        { error: "trainerId y datos del alumno son obligatorios" },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY no configurada" },
        { status: 500 },
      );
    }

    const prompt = `
Mi alumno se llama ${alumno.nombre}, tiene ${alumno.edad} años, es ${alumno.sexo}.
Pesa ${alumno.peso} kg, mide ${alumno.estatura} cm, actividad ${alumno.actividad}.
Objetivo: ${alumno.objetivo}. Hará ${alumno.comidas} comidas.
Alimentos disponibles: ${alumno.alimentos}.
Genera un menú para 1 día con cantidades exactas y macros por comida + totales diarios.
`;

    const openaiClient = new OpenAIClient({ apiKey });
    const response = await openaiClient.responses.create({
      model: "gpt-4o-mini",
      input: [{ role: "user", content: prompt }],
    });

    const outputText = OpenAIClient.extractText(response).trim();

    let storedResult = outputText;
    let parsedResult = null;

    try {
      parsedResult = JSON.parse(outputText);
      storedResult = JSON.stringify(parsedResult);
    } catch (error) {
      storedResult = JSON.stringify({ text: outputText });
    }

    const plan = await prisma.plan.create({
      data: {
        trainerId,
        traineeName: alumno.nombre,
        payloadJson: JSON.stringify(body),
        resultJson: storedResult,
      },
    });

    await ensurePlansDirectory();

    const trainer = await prisma.trainer.findUnique({ where: { id: trainerId } });
    const pdfPath = path.join(PLANS_DIR, `${plan.id}.pdf`);

    const pdfContent =
      parsedResult && typeof parsedResult === "object"
        ? JSON.stringify(parsedResult, null, 2)
        : outputText;

    await renderPdf(pdfContent, trainer?.logoUrl ?? null, pdfPath);

    const pdfUrl = `/plans/${plan.id}.pdf`;

    await prisma.plan.update({
      where: { id: plan.id },
      data: { pdfUrl },
    });

    return NextResponse.json({
      planId: plan.id,
      result: parsedResult ?? outputText,
      pdfUrl,
    });
  } catch (error) {
    console.error("Error al generar el plan", error);
    return NextResponse.json(
      { error: "No se pudo generar el plan" },
      { status: 500 },
    );
  }
}
