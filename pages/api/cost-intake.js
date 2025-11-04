import { addBatch, calculateUnitCogs } from "../../accounting-store";
export default function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  try {
    const { sku, qty, cost, type } =
      (typeof req.body === "string" ? JSON.parse(req.body) : req.body) || {};
    addBatch({ sku, qty, cost, type });
    const summary = calculateUnitCogs(sku);
    res.status(200).json({ ok: true, summary });
  } catch (e) {
    res.status(400).json({ ok: false, error: String(e.message || e) });
  }
}
