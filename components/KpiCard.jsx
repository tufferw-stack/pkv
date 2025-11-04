export default function KpiCard({ label, value, sub }) {
  return (
    <div className="kpi">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
      {sub && <div className="text-xs text-neutral-500">{sub}</div>}
    </div>
  );
}
