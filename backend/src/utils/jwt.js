import crypto from "crypto";
import ENV from "../config/env.js";

export const signToken = (payload, expiresIn = 3600) => {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
  const body = Buffer.from(JSON.stringify({
    ...payload,
    exp: Date.now() + expiresIn * 1000
  })).toString("base64");

  const signature = crypto
    .createHmac("sha256", ENV.JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64");

  return `${header}.${body}.${signature}`;
};

export const verifyToken = (token) => {
  const [header, body, signature] = token.split(".");
  const expectedSig = crypto
    .createHmac("sha256", ENV.JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64");

  if (signature !== expectedSig) throw new Error("Invalid token");

  const payload = JSON.parse(Buffer.from(body, "base64").toString());
  if (Date.now() > payload.exp) throw new Error("Token expired");

  return payload;
};
