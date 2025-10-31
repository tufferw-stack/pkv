import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/veeqo-live');
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
        setData(json);
        setError(null);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p style={{ padding: '2rem' }}>Loading agents...</p>;
  if (error) return <p style={{ padding: '2rem', color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: '800px' }}>
      <h1>PKV Agent Dashboard</h1>
      <p><strong>Last Pull:</strong> {new Date(data.pulled_at).toLocaleString()}</p>

      <h2>Low Stock Alerts ({data.low_stock_alerts.length})</h2>
      {data.low_stock_alerts.length === 0 ? (
        <p style={{ color: 'green' }}>✅ All stock levels good!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {data.low_stock_alerts.map((alert, i) => {
            const sku = alert.split('(SKU: ')[1]?.split(')')[0];
            return (
              <li key={i} style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                <strong>{alert}</strong><br />
                <button
                  onClick={async () => {
                    if (!sku) return alert("SKU not found");
                    const payload = {
                      sku,
                      quantity: 50,
                      supplier_id: "your-supplier-id-here" // Replace with actual
                    };
                    const r = await fetch('/api/reorder', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(payload)
                    });
                    const result = await r.json();
                    alert(result.success ? `Reordered 50 of ${sku}!` : result.error || "Failed");
                  }}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: '#0070f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Reorder 50 Now
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <p>
        <a href="https://s3.console.aws.amazon.com/s3/buckets/pkv-agent-logs" target="_blank" rel="noopener noreferrer">
          View AWS S3 Logs
        </a>
      </p>
    </div>
  );
}
