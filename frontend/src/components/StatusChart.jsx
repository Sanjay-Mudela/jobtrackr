// frontend/src/components/StatusChart.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function StatusChart({ stats }) {
  if (!stats) return null;

  const data = [
    { name: "Applied", value: stats["Applied"] || 0 },
    { name: "Online Test", value: stats["Online Test"] || 0 },
    { name: "Interview", value: stats["Interview"] || 0 },
    { name: "Offer", value: stats["Offer"] || 0 },
    { name: "Rejected", value: stats["Rejected"] || 0 },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-100">
          Applications by status
        </h3>
        <p className="text-[11px] text-slate-400">
          Overview of how your applications are distributed.
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={{ stroke: "#374151" }}
              tickLine={{ stroke: "#374151" }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={{ stroke: "#374151" }}
              tickLine={{ stroke: "#374151" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#020617",
                borderColor: "#1f2937",
                borderRadius: "0.5rem",
                fontSize: "12px",
              }}
              cursor={{ fill: "rgba(148, 163, 184, 0.1)" }}
            />
            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]}
              // Recharts will use default color; your Tailwind theme keeps overall style dark
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default StatusChart;
