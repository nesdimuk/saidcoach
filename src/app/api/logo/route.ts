import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs/promises";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { prisma } from "@/lib/prisma";

const BUCKET = process.env.STORAGE_BUCKET_NAME ?? "logos";

function getS3Client() {
  const endpoint = process.env.STORAGE_BUCKET_URL;
  const accessKeyId = process.env.STORAGE_ACCESS_KEY;
  const secretAccessKey = process.env.STORAGE_SECRET_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return new S3Client({
    region: process.env.STORAGE_REGION ?? "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

async function uploadToLocal(buffer: Buffer, trainerId: string, filename: string) {
  const dir = path.join(process.cwd(), "public", "logos", `trainer_${trainerId}`);
  await fs.mkdir(dir, { recursive: true });
  const filePath = path.join(dir, filename);
  await fs.writeFile(filePath, buffer);
  return `/logos/trainer_${trainerId}/${filename}`;
}

function getFileExtension(file: File) {
  const mime = file.type || "image/png";
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
  if (mime.includes("svg")) return "svg";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("gif")) return "gif";
  return "png";
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");
  const trainerId = form.get("trainerId")?.toString();

  if (!(file instanceof File) || !trainerId) {
    return NextResponse.json({ error: "Faltan parámetros obligatorios" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const extension = getFileExtension(file);
  const key = `trainer_${trainerId}/${randomUUID()}.${extension}`;

  const s3Client = getS3Client();
  let logoUrl: string;

  if (s3Client) {
    const endpoint = process.env.STORAGE_BUCKET_URL?.replace(/\/$/, "");
    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: buffer,
          ContentType: file.type || "image/png",
          ACL: "public-read",
        }),
      );
    } catch (error) {
      console.error("No se pudo subir el logo al almacenamiento S3", error);
      return NextResponse.json({ error: "No se pudo subir el logo" }, { status: 502 });
    }

    logoUrl = `${endpoint}/${BUCKET}/${key}`;
  } else {
    const filename = key.split("/").pop() ?? `${randomUUID()}.${extension}`;
    logoUrl = await uploadToLocal(buffer, trainerId, filename);
  }

  try {
    await prisma.trainer.update({
      where: { id: trainerId },
      data: { logoUrl },
    });
  } catch (error) {
    console.error("No se pudo actualizar el entrenador", error);
    return NextResponse.json({ error: "Entrenador no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ logoUrl });
}
