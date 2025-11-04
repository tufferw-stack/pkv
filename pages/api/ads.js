// Mock ads data and simple channel-aware tweaks
export default function handler(req, res) {
  try {
    const { channel = "All" } = req.query || {};

    // base mock campaigns
    const base = [
      {
        campaign: "Spring Push",
        status: "Active",
        spend: 1250.5,
        sales: 7500.0,
        bidStrategy: "Auto",
      },
      {
        campaign: "Brand Awareness",
        status: "Paused",
        spend: 300.0,
        sales: 1200.0,
        bidStrategy: "Manual",
      },
      {
        campaign: "Clearance Promo",
        status: "Active",
        spend: 720.0,
        sales: 3600.0,
        bidStrategy: "Auto",
      },
      {
        campaign: "New Launch",
        status: "Active",
        spend: 2100.0,
        sales: 4200.0,
        bidStrategy: "Maximize Conversions",
      },
      {
        campaign: "Retargeting",
        status: "Active",
        spend: 480.0,
        sales: 2400.0,
        bidStrategy: "CPA Target",
      },
      {
        campaign: "International",
        status: "Paused",
        spend: 95.0,
        sales: 190.0,
        bidStrategy: "Manual",
      },
    ];

    // adjust numbers slightly for channel (demo)
    const items = base.map((it, i) => {
      const factor = channel && channel !== "All" ? 1 + (i % 3) * 0.05 : 1;
      const spend = Math.round(it.spend * factor * 100) / 100;
      const sales = Math.round(it.sales * factor * 100) / 100;
      const roas = spend > 0 ? Math.round((sales / spend) * 100) / 100 : 0;
      const tacos = sales > 0 ? Math.round((spend / sales) * 10000) / 100 : 0; // percent
      return { ...it, spend, sales, roas, tacos };
    });

    return res.status(200).json({ items });
  } catch (err) {
    console.error("ads api error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
