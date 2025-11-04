export default function DateRange({ value = "30d", onChange }) {
  return (
    <div className="flex items-center gap-2">
      <select
        className="input"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      >
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
        <option value="90d">Last 90 days</option>
        <option value="365d">Last 12 months</option>
      </select>
    </div>
  );
}
