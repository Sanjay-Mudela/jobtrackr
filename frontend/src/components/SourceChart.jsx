import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Card from "./ui/Card";


// Match your dark theme + distinct per-source colors
const SOURCE_COLORS = {
  LinkedIn: "#0ea5e9", // sky
  Naukri: "#6366f1", // indigo
  Indeed: "#a855f7", // purple
  "Company Website": "#f59e0b", // amber
  Referral: "#10b981", // emerald
  Other: "#e5e7eb", // slate-200
};

const SOURCE_ORDER = [
  "LinkedIn",
  "Naukri",
  "Indeed",
  "Company Website",
  "Referral",
  "Other",
];

function SourceChart({ jobs }) {
  if (!jobs || jobs.length === 0) return null;

  // Count jobs per source
  const counts = SOURCE_ORDER.reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {});

  jobs.forEach((job) => {
    const src = job.source && SOURCE_ORDER.includes(job.source)
      ? job.source
      : "Other";
    counts[src] += 1;
  });

  const data = SOURCE_ORDER
    .map((name) => ({ name, value: counts[name] }))
    .filter((d) => d.value > 0); // hide empty sources

  if (data.length === 0) return null;

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className="px-4 py-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">
            Applications by source
          </h3>
          <p className="text-[11px] text-slate-400">
            Where your applications are coming from.
          </p>
        </div>
        <div className="rounded-full bg-slate-800/60 px-3 py-1 text-[11px] text-slate-300">
          Sources:{" "}
          <span className="font-semibold text-slate-100">
            {data.length}
          </span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={SOURCE_COLORS[entry.name] || "#6366f1"}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#020617",
                borderColor: "#1f2937",
                borderRadius: "0.75rem",
                fontSize: "12px",
                padding: "8px 10px",
              }}
              labelStyle={{ color: "#e5e7eb", marginBottom: 4 }}
              itemStyle={{ color: "#e5e7eb" }}
            />
            <Legend
              verticalAlign="bottom"
              height={32}
              wrapperStyle={{
                fontSize: "11px",
                color: "#9ca3af",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-2 text-[11px] text-slate-500">
        Total applications:{" "}
        <span className="font-semibold text-slate-200">{total}</span>
      </p>
    </Card>
  );
}

export default SourceChart;
