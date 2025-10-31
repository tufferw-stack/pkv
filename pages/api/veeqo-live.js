res.json({
  success: true,
  pulled_at: new Date().toISOString(),
  total_products: data.length,
  s3_log: `https://s3.console.aws.amazon.com/s3/object/pkv-agent-logs?prefix=${logKey}`,

  // === ALERTS FOR YOUR APP ===
  alerts: alerts.map(alert => {
    const sku = alert.split('(SKU: ')[1]?.split(')')[0];
    return {
      message: alert,
      sku,
      action: `Reorder 50 units`,
      api: `/api/reorder`,
      payload: {
        sku,
        quantity: 50,
        supplier_id: process.env.DEFAULT_SUPPLIER_ID
      }
    };
  }),
  // === END ALERTS ===

  sample: data.slice(0, 3).map(p => ({
    name: p.title,
    sku: p.sku,
    stock: p.stock_level
  }))
});
