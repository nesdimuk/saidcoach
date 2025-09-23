import { createHash, createHmac } from "crypto";

function toAmzDate(date) {
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

function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}

function getSigningKey(secret, dateStamp, region, service) {
  const kDate = createHmac("sha256", `AWS4${secret}`).update(dateStamp).digest();
  const kRegion = createHmac("sha256", kDate).update(region).digest();
  const kService = createHmac("sha256", kRegion).update(service).digest();
  return createHmac("sha256", kService).update("aws4_request").digest();
}

function encodeRfc3986(url) {
  return encodeURIComponent(url).replace(/[!*'()]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

function encodePath(path) {
  return path
    .split("/")
    .map((segment) => encodeRfc3986(segment))
    .join("/");
}

class PutObjectCommand {
  constructor(input) {
    this.input = input;
  }
}

class S3Client {
  constructor(config) {
    this.region = config.region;
    this.endpoint = new URL(config.endpoint);
    this.credentials = config.credentials;
  }

  async send(command) {
    const { Bucket, Key, Body, ContentType, ACL } = command.input;
    const path = `/${Bucket}/${encodePath(Key)}`;
    const url = new URL(path, this.endpoint);

    const { amzDate, dateStamp } = toAmzDate(new Date());
    const service = "s3";
    const host = url.host;
    const payloadHash = hash(Body);

    const headers = {
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
    const stringToSign = [
      "AWS4-HMAC-SHA256",
      amzDate,
      credentialScope,
      hash(canonicalRequest),
    ].join("\n");

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
      let errorText = "";
      try {
        errorText = await response.text();
      } catch (err) {
        errorText = "";
      }
      throw new Error(`Failed to upload object to S3: ${response.status} ${response.statusText} ${errorText}`.trim());
    }
  }
}

export { PutObjectCommand, S3Client };
