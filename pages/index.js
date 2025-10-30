export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>PKV Agent Platform</h1>
      <p>API: <a href="/api/veeqo-live">/api/veeqo-live</a></p>
      <p>Status: <span style={{ color: 'green' }}>Live & Pulling Veeqo</span></p>
    </div>
  );
}
