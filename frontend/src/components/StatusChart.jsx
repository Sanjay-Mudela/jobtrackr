import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import Card from "./ui/Card";


const STATUS_COLORS = {
  Applied: "#6366f1", // indigo
  "Online Test": "#f59e0b", // amber
  Interview: "#a855f7", // purple
  Offer: "#10b981", // emerald
  Rejected: "#ef4444", // red
};

function StatusChart({ stats }) {
  if (!stats) return null;

  const data = [
    { name: "Applied", value: stats["Applied"] || 0 },
    { name: "Online Test", value: stats["Online Test"] || 0 },
    { name: "Interview", value: stats["Interview"] || 0 },
    { name: "Offer", value: stats["Offer"] || 0 },
    { name: "Rejected", value: stats["Rejected"] || 0 },
  ];

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className="px-4 py-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">
            Applications by status
          </h3>
          <p className="text-[11px] text-slate-400">
            Visual breakdown of where your applications currently are.
          </p>
        </div>
        <div className="rounded-full bg-slate-800/60 px-3 py-1 text-[11px] text-slate-300">
          Total: <span className="font-semibold text-slate-100">{total}</span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1f2937" // slate-800
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#9ca3af" }} // slate-400
              axisLine={{ stroke: "#1f2937" }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={{ stroke: "#1f2937" }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#020617", // slate-950
                borderColor: "#1f2937", // slate-800
                borderRadius: "0.75rem",
                fontSize: "12px",
                padding: "8px 10px",
              }}
              labelStyle={{ color: "#e5e7eb", marginBottom: 4 }} // slate-200
              itemStyle={{ color: "#e5e7eb" }}
              cursor={{ fill: "rgba(148, 163, 184, 0.06)" }} // slate-400/6
            />
            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              barSize={32}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={STATUS_COLORS[entry.name] || "#6366f1"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default StatusChart;
