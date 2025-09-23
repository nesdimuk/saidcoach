import { createHash, createHmac } from "crypto";

type Credentials = {
  accessKeyId: string;
  secretAccessKey: string;
};

type S3ClientConfig = {
  region: string;
  endpoint: string;
  credentials: Credentials;
};

type PutObjectInput = {
  Bucket: string;
  Key: string;
  Body: Buffer;
  ContentType?: string;
  ACL?: string;
};

function toAmzDate(date: Date) {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const min = String(date.getUTCMinutes()).padStart(2, "0");
  const ss = String(date.getUTCSeconds()).padStart(2, "0");
  return {
    amzDate: `${yyyy}${mm}${dd}T${hh}${min}${ss}Z`,
    dateStamp: `${yyyy}${mm}${dd}`,
  };
}

function hash(value: string | Buffer) {
  return createHash("sha256").update(value).digest("hex");
}

function getSigningKey(secret: string, dateStamp: string, region: string, service: string) {
  const kDate = createHmac("sha256", `AWS4${secret}`).update(dateStamp).digest();
  const kRegion = createHmac("sha256", kDate).update(region).digest();
  const kService = createHmac("sha256", kRegion).update(service).digest();
  return createHmac("sha256", kService).update("aws4_request").digest();
}

function encodeRfc3986(url: string) {
  return encodeURIComponent(url).replace(/[!*'()]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

function encodePath(pathname: string) {
  return pathname
    .split("/")
    .map((segment) => encodeRfc3986(segment))
    .join("/");
}

export class PutObjectCommand {
  constructor(readonly input: PutObjectInput) {}
}

export class S3Client {
  private readonly region: string;
  private readonly endpoint: URL;
  private readonly credentials: Credentials;

  constructor(config: S3ClientConfig) {
    this.region = config.region;
    this.endpoint = new URL(config.endpoint);
    this.credentials = config.credentials;
  }

  async send(command: PutObjectCommand) {
    const { Bucket, Key, Body, ContentType, ACL } = command.input;
    const path = `/${Bucket}/${encodePath(Key)}`;
    const url = new URL(path, this.endpoint);

    const { amzDate, dateStamp } = toAmzDate(new Date());
    const service = "s3";
    const host = url.host;
    const payloadHash = hash(Body);

    const headers: Record<string, string> = {
      host,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
    };

    if (ContentType) {
      headers["content-type"] = ContentType;
    }

    if (ACL) {
      headers["x-amz-acl"] = ACL;
    }

    const canonicalHeaders = Object.keys(headers)
      .sort()
      .map((key) => `${key}:${headers[key].trim()}`)
      .join("\n");

    const signedHeaders = Object.keys(headers)
      .map((key) => key.toLowerCase())
      .sort()
      .join(";");

    const canonicalRequest = [
      "PUT",
      url.pathname,
      url.searchParams.toString(),
      `${canonicalHeaders}\n`,
      signedHeaders,
      payloadHash,
    ].join("\n");

    const credentialScope = `${dateStamp}/${this.region}/${service}/aws4_request`;
    const stringToSign = ["AWS4-HMAC-SHA256", amzDate, credentialScope, hash(canonicalRequest)].join("\n");

    const signingKey = getSigningKey(this.credentials.secretAccessKey, dateStamp, this.region, service);
    const signature = createHmac("sha256", signingKey).update(stringToSign).digest("hex");

    const authorizationHeader = `AWS4-HMAC-SHA256 Credential=${this.credentials.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const requestHeaders = {
      ...Object.fromEntries(
        Object.entries(headers).map(([key, value]) => [
          key
            .split("-")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join("-"),
          value,
        ]),
      ),
      Authorization: authorizationHeader,
      "Content-Length": String(Body.length),
    };

    const response = await fetch(url.toString(), {
      method: "PUT",
      headers: requestHeaders,
      body: Body,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(`Failed to upload object to S3: ${response.status} ${response.statusText} ${errorText}`.trim());
    }
  }
}
