declare var Buffer: {
  from(input: ArrayBuffer | string, encoding?: BufferEncoding): Buffer;
  readonly prototype: Buffer;
};

declare type BufferEncoding =
  | "ascii"
  | "utf8"
  | "utf-8"
  | "utf16le"
  | "ucs2"
  | "ucs-2"
  | "base64"
  | "base64url"
  | "latin1"
  | "binary"
  | "hex";

declare type Buffer = Uint8Array & { length: number };

declare module "fs" {
  const fs: any;
  export = fs;
}

declare module "fs/promises" {
  const fs: any;
  export = fs;
}

declare module "path" {
  const path: any;
  export = path;
}

declare module "pdfkit" {
  const PDFDocument: any;
  export default PDFDocument;
}

declare module "crypto" {
  export function createHash(algorithm: string): { update(data: any): any; digest(encoding?: BufferEncoding): any };
  export function createHmac(algorithm: string, key: any): { update(data: any): any; digest(encoding?: BufferEncoding): any };
}
