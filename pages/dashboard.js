export default function Dashboard() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>PKV Agent Dashboard</h1>
      <p>API: <a href="/api/veeqo-live">/api/veeqo-live</a></p>
      <p>Status: <strong style={{ color: 'green' }}>Pulling Veeqo</strong></p>
      <p><a href="https://s3.console.aws.amazon.com/s3/buckets/pkv-agent-logs" target="_blank">View AWS S3 Logs</a></p>
    </div>
  );
}
