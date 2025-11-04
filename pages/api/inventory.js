// Mock inventory data and simple reorder point calculation
export default function handler(req, res) {
  try {
    const { channel = "All" } = req.query || {};

    const base = [
      { sku: "SKU-123", on_hand: 12, sales_30d: 60, lead_time: 7 },
      { sku: "SKU-234", on_hand: 5, sales_30d: 10, lead_time: 14 },
      { sku: "SKU-345", on_hand: 50, sales_30d: 90, lead_time: 10 },
      { sku: "SKU-456", on_hand: 0, sales_30d: 5, lead_time: 21 },
      { sku: "SKU-567", on_hand: 8, sales_30d: 120, lead_time: 5 },
    ];

    const items = base.map((it) => {
      const daily_sales = Math.max(
        0,
        Math.round((it.sales_30d / 30) * 100) / 100,
      );
      const safety = 5; // days
      const reorder_point = Math.ceil(daily_sales * it.lead_time + safety);
      const suggested_order = Math.max(0, reorder_point - it.on_hand);
      return { ...it, daily_sales, safety, reorder_point, suggested_order };
    });

    return res.status(200).json({ items });
  } catch (err) {
    console.error("inventory api error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
