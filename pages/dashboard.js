export default function Dashboard() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>PKV Agent Dashboard</h1>
      <p>API: <a href="/api/veeqo-live">/api/veeqo-live</a></p>
      <p>Status: <strong style={{ color: 'green' }}>Pulling Veeqo</strong></p>
    </div>
  );
}
