let batches = []; // { sku, qty, cost, type, ts }

export function addBatch({ sku, qty, cost, type }) {
  const q = Number(qty) || 0,
    c = Number(cost) || 0;
  if (!sku || q <= 0 || c < 0) throw new Error("Invalid batch");
  batches.push({ sku, qty: q, cost: c, type: type || "other", ts: Date.now() });
  return true;
}

export function calculateUnitCogs(sku) {
  const items = batches.filter((b) => b.sku === sku);
  if (!items.length) return { sku, unit: 0, qty: 0, total: 0 };
  const qty = items.reduce((s, b) => s + b.qty, 0);
  const total = items.reduce((s, b) => s + b.cost, 0);
  return { sku, unit: qty ? Number((total / qty).toFixed(4)) : 0, qty, total };
}

export function getAccountingSummary() {
  const map = new Map();
  for (const b of batches) {
    const cur = map.get(b.sku) || { sku: b.sku, qty: 0, total: 0 };
    cur.qty += b.qty;
    cur.total += b.cost;
    map.set(b.sku, cur);
  }
  const rows = [...map.values()].map((r) => ({
    ...r,
    unit: r.qty ? Number((r.total / r.qty).toFixed(4)) : 0,
  }));
  const grandTotal = rows.reduce((s, r) => s + r.total, 0);
  return {
    rows,
    grandTotal: Number(grandTotal.toFixed(2)),
    count: rows.length,
  };
}
