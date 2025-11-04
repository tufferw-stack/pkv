export default function Home() {
  return (
    <div style={{ padding: "40px", fontFamily: "system-ui" }}>
      <h1>PKV Agents Platform</h1>
      <p>
        API:{" "}
        <a href="/api/veeqo-live" style={{ color: "blue" }}>
          /api/veeqo-live
        </a>
      </p>
      <p>
        Status: <strong style={{ color: "green" }}>Veeqo Pull Active</strong>
      </p>
    </div>
  );
}
