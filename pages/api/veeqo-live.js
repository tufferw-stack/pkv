export default async function handler(req, res) {
  const token = process.env.VEEQO_API_KEY;
  if (!token) return res.status(500).json({ error: "Missing VEEQO_API_KEY" });

  try {
    const r = await fetch("https://api.veeqo.com/products?per_page=5", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!r.ok) throw new Error(`Veeqo API error: ${r.status}`);

    const data = await r.json();

    const alerts = data
      .filter(p => p.stock_level < 10)
      .map(p => `Low stock: ${p.title} (SKU: ${p.sku}) – only ${p.stockf_level} left!`);

    res.json({
      success: true,
      pulled_at: new Date().toISOString(),
      total_products: data.length,
      low_stock_alerts: alerts,
      sample: data.slice(0, 3).map(p => ({
        name: p.title,
        sku: p.sku,
        stock: p.stock_level
      }))
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
