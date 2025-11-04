import { calculateUnitCogs } from "../../accounting-store";
export default function handler(req, res) {
  const sku = req.query.sku;
  const data = calculateUnitCogs(String(sku || "").trim());
  res.status(200).json({ ok: true, data });
}
