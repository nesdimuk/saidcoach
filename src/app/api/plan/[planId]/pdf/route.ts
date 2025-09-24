import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, context: { params: { planId: string } }) {
  const { planId } = context.params;

  if (!planId) {
    return NextResponse.json({ error: "Plan no encontrado" }, { status: 400 });
  }

  const plan = await prisma.plan.findUnique({ where: { id: planId } });

  if (!plan?.pdfUrl) {
    return NextResponse.json({ error: "Plan no encontrado" }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), "public", plan.pdfUrl.replace(/^\//, ""));

  try {
    const file = await fs.readFile(filePath);
    return new NextResponse(file, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=plan-${planId}.pdf`,
      },
    });
  } catch (error) {
    console.error("No se pudo leer el PDF del plan", error);
    return NextResponse.json({ error: "PDF no disponible" }, { status: 404 });
  }
}
