import { jsPDF } from "jspdf";
import fs from "fs/promises";
import path from "path";

async function loadRemoteImage(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`No se pudo cargar la imagen del logo: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const contentType = response.headers.get("content-type") || "image/png";
  return { buffer: Buffer.from(arrayBuffer), contentType };
}

async function loadLocalImage(url) {
  const localPath = path.join(process.cwd(), "public", url.replace(/^\//, ""));
  const buffer = await fs.readFile(localPath);
  const contentType = url.endsWith(".jpg") || url.endsWith(".jpeg") ? "image/jpeg" : "image/png";
  return { buffer, contentType };
}

async function loadImageAsBase64(url) {
  const loader = url.startsWith("http://") || url.startsWith("https://") ? loadRemoteImage : loadLocalImage;
  const { buffer, contentType } = await loader(url);
  const format = contentType.includes("jpeg") || contentType.includes("jpg") ? "JPEG" : "PNG";
  const base64 = buffer.toString("base64");
  return { data: base64, format };
}

async function renderPdf(menu, logoUrl, outPath) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  let cursorY = margin;

  if (logoUrl) {
    try {
      const { data, format } = await loadImageAsBase64(logoUrl);
      const imageWidth = 120;
      const imageHeight = 120;
      doc.addImage(data, format, margin, cursorY, imageWidth, imageHeight);
      cursorY += imageHeight + 20;
    } catch (error) {
      console.warn("No se pudo incrustar el logo en el PDF", error);
    }
  }

  doc.setFontSize(18);
  doc.text("Plan Alimenticio Personalizado", pageWidth / 2, cursorY, { align: "center" });
  cursorY += 30;

  doc.setFontSize(12);
  const textWidth = pageWidth - margin * 2;
  const lines = doc.splitTextToSize(menu, textWidth);
  doc.text(lines, margin, cursorY);

  const buffer = doc.output("arraybuffer");
  await fs.writeFile(outPath, Buffer.from(buffer));

  return outPath;
}

export { renderPdf };
