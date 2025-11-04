import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });
  try {
    const { orgId } = req.query || {};
    if (!orgId) return res.status(400).json({ error: "orgId required" });
    const items = await prisma.integration.findMany({
      where: { orgId },
      orderBy: { createdAt: "desc" },
    });
    // Do NOT return ciphertext to clients. Return metadata only.
    const out = items.map((i) => ({
      id: i.id,
      provider: i.provider,
      last4: i.last4,
      keyVersion: i.keyVersion,
      createdAt: i.createdAt,
    }));
    return res.status(200).json({ items: out });
  } catch (err) {
    console.error("integrations.get error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
