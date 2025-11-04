// Lightweight best-practices stub. Accepts ?channel= and returns an array of items.
export default function handler(req, res) {
  try {
    const { channel = "All" } = req.query || {};

    // Base mock items. Structure: { title, url, summary }
    const base = [
      {
        title: "Review top SKUs for margin erosion",
        url: "https://example.com/margin-erosion",
        summary: "Identify SKUs with declining margins and investigate causes.",
      },
      {
        title: "Sync inventory with Veeqo regularly",
        url: "https://example.com/veeqo-sync",
        summary: "Ensure inventory sync runs every 4 hours to avoid oversells.",
      },
      {
        title: "Bundle slow-moving items",
        url: "https://example.com/bundles",
        summary:
          "Create bundles to increase average order value and clear slow SKUs.",
      },
      {
        title: "Monitor advertising ROAS",
        url: "https://example.com/roas",
        summary: "Review ad spend vs. revenue for each channel weekly.",
      },
      {
        title: "Use auto-approval for low-risk changes",
        url: "https://example.com/auto-approve",
        summary:
          "Enable auto-approve for small, low-risk inventory/cost adjustments.",
      },
      {
        title: "Audit fees and reimbursements",
        url: "https://example.com/fees",
        summary:
          "Regularly audit marketplace fees and refunds to preserve margin.",
      },
    ];

    // Simple channel switch — ready to replace with per-channel fetchers.
    let items = base;
    if (
      channel &&
      typeof channel === "string" &&
      channel.toLowerCase() !== "all"
    ) {
      // For demo: tweak items slightly by tagging channel in title/summary
      items = base.map((it, i) => ({
        title: `${it.title} — ${channel}`,
        url: it.url,
        summary: `${it.summary} (recommended for ${channel})`,
      }));
    }

    return res.status(200).json({ items });
  } catch (err) {
    console.error("best-practices error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
