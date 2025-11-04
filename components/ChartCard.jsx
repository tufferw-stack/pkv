import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
export default function ChartCard({ data }) {
  return (
    <div className="card p-4 h-64">
      <div className="font-semibold mb-2">Revenue (mock)</div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="d" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="y" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
