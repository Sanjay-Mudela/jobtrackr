// frontend/src/components/ApplicationsOverTimeChart.jsx
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function formatDateYYYYMMDD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatLabel(date) {
  // Show as "DD" (e.g. 07) – short & clean
  const d = new Date(date);
  return String(d.getDate()).padStart(2, "0");
}

function ApplicationsOverTimeChart({ jobs }) {
  if (!jobs || jobs.length === 0) return null;

  // 1) Build a map for the last 30 days: dateString -> 0
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = [];
  const counts = {};

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = formatDateYYYYMMDD(d);
    days.push(key);
    counts[key] = 0;
  }

  // 2) Count applications per day (within the last 30 days)
  jobs.forEach((job) => {
    if (!job.appliedDate) return;
    const applied = new Date(job.appliedDate);
    applied.setHours(0, 0, 0, 0);

    const key = formatDateYYYYMMDD(applied);
    if (counts[key] !== undefined) {
      counts[key] += 1;
    }
  });

  // 3) Convert to chart data
  const data = days.map((dateStr) => ({
    date: dateStr,
    label: formatLabel(dateStr),
    value: counts[dateStr] || 0,
  }));

  const totalInWindow = data.reduce((sum, d) => sum + d.value, 0);

  // If literally nothing in 30 days, show a friendly message instead of an empty chart
  if (totalInWindow === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Applications in the last 30 days
            </h3>
            <p className="text-[11px] text-slate-400">
              You haven&apos;t logged any applications in this period yet.
            </p>
          </div>
        </div>
        <p className="text-[11px] text-slate-500">
          Start adding jobs to see your application trend over time.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">
            Applications in the last 30 days
          </h3>
          <p className="text-[11px] text-slate-400">
            See how consistently you&apos;ve been applying recently.
          </p>
        </div>
        <div className="rounded-full bg-slate-800/60 px-3 py-1 text-[11px] text-slate-300">
          Total:{" "}
          <span className="font-semibold text-slate-100">
            {totalInWindow}
          </span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1f2937"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
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
                backgroundColor: "#020617",
                borderColor: "#1f2937",
                borderRadius: "0.75rem",
                fontSize: "12px",
                padding: "8px 10px",
              }}
              labelFormatter={(label, payload) => {
                if (!payload || payload.length === 0) return "";
                const point = payload[0].payload;
                const d = new Date(point.date);
                return d.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
              }}
              itemStyle={{ color: "#e5e7eb" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              fill="rgba(99, 102, 241, 0.25)"
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ApplicationsOverTimeChart;
