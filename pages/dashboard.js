import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/veeqo-live');
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p style={{ padding: '2rem' }}>Loading agents...</p>;
  if (error) return <p style={{ padding: '2rem', color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>PKV Agent Dashboard</h1>
      <p><strong>Last Pull:</strong> {new Date(data.pulled_at).toLocaleString()}</p>

      <h2>Low Stock Alerts ({data.low_stock_alerts.length})</h2>
      {data.low_stock_alerts.length === 0 ? (
        <p style={{ color: 'green' }}>✅ All stock levels good!</p>
      ) : (
        <ul>
          {data.low_stock_alerts.map((alert, i) => (
            <li key={i} style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #ccc' }}>
              <strong>{alert}</strong><br />
              <button onClick={async () => {
                const sku = alert.split('(SKU: ')[1]?.split(')')[0];
                if (!sku) return alert("SKU not found");
                const payload = {
                  sku,
                  quantity: 50,
                  supplier_id: process.env.NEXT_PUBLIC_DEFAULT_SUPPLIER_ID || "your-supplier-id"
                };
                const r = await fetch('/api/reorder', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
                });
                const result = await r.json();
                alert(result.success ? `Reordered 50 of ${sku}!` : result.error);
              }}>
                Reorder 50 Now
              </button>
            </li>
          ))}
        </ul>
      )}

      <p>
        <a href={data.s3_log || "https://s3.console.aws.amazon.com/s3/buckets/pkv-agent-logs"} target="_blank">
          View AWS S3 Log
        </a>
      </p>
    </div>
  );
}
