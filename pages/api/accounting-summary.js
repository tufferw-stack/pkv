import { getAccountingSummary } from "../../accounting-store";
export default function handler(req, res) {
  const data = getAccountingSummary();
  res.status(200).json({ ok: true, data });
}
