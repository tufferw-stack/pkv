import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/veeqo-live');
      const json = await res.json();
      setData(json);
      setLoading(false);
    };
    fetchData();
    const interval = setInterval(fetchData, 60000); // every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading agents...</p>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>PKV Agent Dashboard</h1>
      <p><strong>Last Pull:</strong> {new Date(data.pulled_at).toLocaleString()}</p>

      <h2>Low Stock Alerts ({data.alerts.length})</h2>
      {data.alerts.length === 0 ? (
        <p style={{ color: 'green' }}>✅ All stock levels good!</p>
      ) : (
        <ul>
          {data.alerts.map((a, i) => (
            <li key={i} style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #ccc' }}>
              <strong>{a.message}</strong><br />
              <em>{a.action}</em><br />
              <button onClick={async () => {
                await fetch(a.api, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(a.payload)
                });
                alert(`Reordered ${a.payload.quantity} of ${a.sku}`);
              }}>
                Reorder Now
              </button>
            </li>
          ))}
        </ul>
      )}

      <p><a href={data.s3_log} target="_blank">View AWS S3 Log</a></p>
    </div>
  );
}
