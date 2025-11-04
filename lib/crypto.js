import crypto from "crypto";

function getKey() {
  const b64 = process.env.DATA_KEY;
  if (!b64) throw new Error("DATA_KEY env is not set");
  const key = Buffer.from(b64, "base64");
  if (key.length !== 32) throw new Error("DATA_KEY must be base64 of 32 bytes");
  return key;
}

export function encryptSecret(plaintext) {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(String(plaintext), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return {
    ciphertext: ciphertext.toString("base64"),
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    version: process.env.DATA_KEY_VERSION || "v1",
  };
}

export function decryptSecret({ ciphertext, iv, tag }) {
  const key = getKey();
  const ct = Buffer.from(ciphertext, "base64");
  const _iv = Buffer.from(iv, "base64");
  const _tag = Buffer.from(tag, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, _iv);
  decipher.setAuthTag(_tag);
  const out = Buffer.concat([decipher.update(ct), decipher.final()]);
  return out.toString("utf8");
}

export default { encryptSecret, decryptSecret };
