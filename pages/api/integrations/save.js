import { PrismaClient } from "@prisma/client";
import { encryptSecret } from "../../../lib/crypto.js";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  try {
    const { orgId, provider, key } = req.body || {};
    if (!orgId || !provider || !key)
      return res
        .status(400)
        .json({ error: "orgId, provider and key are required" });

    // Encrypt the provided key server-side. Plaintext never returned to browser.
    const enc = encryptSecret(key);
    const last4 = String(key).slice(-4);
    const created = await prisma.integration.create({
      data: {
        orgId,
        provider,
        keyCipher: Buffer.from(enc.ciphertext, "base64"),
        keyIv: Buffer.from(enc.iv, "base64"),
        keyTag: Buffer.from(enc.tag, "base64"),
        keyVersion: enc.version,
        last4,
      },
    });

    return res.status(200).json({ ok: true, id: created.id, last4 });
  } catch (err) {
    console.error("integrations.save error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
