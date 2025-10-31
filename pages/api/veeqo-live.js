import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export default async function handler(req, res) {
  try {
    const token = process.env.VEEQO_API_KEY;
    if (!token) throw new Error("Missing VEEQO_API_KEY");

    const r = await fetch("https://api.veeqo.com/products?per_page=5", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!r.ok) {
      const err = await r.text();
      throw new Error(`Veeqo error ${r.status}: ${err}`);
    }

    const data = await r.json();

    const alerts = data
      .filter(p => p.stock_level < 10)
      .map(p => `Low stock: ${p.title} (SKU: ${p.sku}) – ${p.stock_level} left!`);

    // AWS S3 LOG
    try {
      const s3 = new S3Client({ region: "us-east-1" });
      const logKey = `pulls/${new Date().toISOString().split('T')[0]}.json`;
      await s3.send(new PutObjectCommand({
        Bucket: "pkv-agent-logs",
        Key: logKey,
        Body: JSON.stringify({ pulled_at: new Date().toISOString(), alerts, sample: data.slice(0, 3) }, null, 2),
        ContentType: "application/json"
      }));
    } catch (e) {
      console.error("S3 failed:", e.message);
    }

    res.json({
      success: true,
      pulled_at: new Date().toISOString(),
      low_stock_alerts: alerts,
      sample: data.slice(0, 3).map(p => ({
        name: p.title,
        sku: p.sku,
        stock: p.stock_level
      }))
    });
  } catch (e) {
    console.error("API ERROR:", e.message);
    res.status(500).json({ error: e.message });
  }
}
