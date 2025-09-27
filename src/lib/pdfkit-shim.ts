import { jsPDF } from "jspdf";
import fs from "fs";

type PDFDocumentOptions = {
  margin?: number;
};

type TextOptions = {
  align?: "left" | "center" | "right";
};

type ImageOptions = {
  width?: number;
  height?: number;
  format?: "PNG" | "JPEG";
};

export default class PDFDocument {
  private readonly doc = new jsPDF({ unit: "pt", format: "a4" });
  private readonly margin: number;
  private cursorY: number;
  private stream: fs.WriteStream | null = null;

  constructor(options: PDFDocumentOptions = {}) {
    this.margin = options.margin ?? 40;
    this.cursorY = this.margin;
  }

  image(image: string | Buffer, x: number, y: number, options: ImageOptions = {}) {
    const width = options.width ?? 120;
    const height = options.height ?? width;
    const format = options.format ?? "PNG";
    if (typeof image === "string") {
      try {
        const data = fs.readFileSync(image);
        const base64 = data.toString("base64");
        this.doc.addImage(base64, format, x, y, width, height);
        return this;
      } catch (error) {
        console.warn("No se pudo cargar la imagen local", error);
        return this;
      }
    }

    const base64 = Buffer.from(image).toString("base64");
    this.doc.addImage(base64, format, x, y, width, height);
    return this;
  }

  fontSize(size: number) {
    this.doc.setFontSize(size);
    return this;
  }

  text(content: string, options: TextOptions = {}) {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    const textWidth = pageWidth - this.margin * 2;
    if (options.align && options.align !== "left") {
      this.doc.text(content, pageWidth / 2, this.cursorY, { align: options.align });
      this.cursorY += 20;
      return this;
    }

    const lines = this.doc.splitTextToSize(content, textWidth);
    this.doc.text(lines, this.margin, this.cursorY);
    this.cursorY += lines.length * 14;
    return this;
  }

  moveDown(lines = 1) {
    this.cursorY += lines * 14;
    return this;
  }

  pipe(stream: fs.WriteStream) {
    this.stream = stream;
    return stream;
  }

  end() {
    if (!this.stream) {
      return;
    }
    const buffer = this.doc.output("arraybuffer");
    this.stream.write(Buffer.from(buffer));
    this.stream.end();
  }
}
