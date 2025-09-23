import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

type LogoSource = {
  data: Buffer | string;
  format: "PNG" | "JPEG";
};

async function loadLogo(logoUrl: string): Promise<LogoSource | null> {
  try {
    if (logoUrl.startsWith("http://") || logoUrl.startsWith("https://")) {
      const response = await fetch(logoUrl);
      if (!response.ok) {
        throw new Error(`No se pudo descargar el logo: ${response.status}`);
      }
      const contentType = response.headers.get("content-type") ?? "image/png";
      const format = contentType.includes("jpeg") || contentType.includes("jpg") ? "JPEG" : "PNG";
      const arrayBuffer = await response.arrayBuffer();
      return { data: Buffer.from(arrayBuffer), format };
    }

    const filePath = logoUrl.startsWith("/")
      ? path.join(process.cwd(), "public", logoUrl.replace(/^\//, ""))
      : logoUrl;
    const extension = filePath.toLowerCase().endsWith(".jpg") || filePath.toLowerCase().endsWith(".jpeg") ? "JPEG" : "PNG";
    return { data: filePath, format: extension };
  } catch (error) {
    console.warn("No se pudo cargar el logo para el PDF", error);
    return null;
  }
}

export async function renderPdf(menu: string, logoUrl: string | null | undefined, outPath: string): Promise<string> {
  const imageSource = logoUrl ? await loadLogo(logoUrl) : null;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const writeStream = fs.createWriteStream(outPath);

    writeStream.on("finish", () => resolve(outPath));
    writeStream.on("error", reject);
    doc.on("error", reject);

    doc.pipe(writeStream);

    if (imageSource) {
      try {
        doc.image(imageSource.data, 40, 30, { width: 100, format: imageSource.format });
      } catch (error) {
        console.warn("No se pudo incrustar el logo en el PDF", error);
      }
    }

    doc.fontSize(18).text("Plan Alimenticio Personalizado", { align: "center" }).moveDown();
    doc.fontSize(12).text(menu);

    doc.end();
  });
}
