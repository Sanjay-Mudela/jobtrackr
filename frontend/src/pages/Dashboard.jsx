import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import StatusChart from "../components/StatusChart";
import SourceChart from "../components/SourceChart";
import ApplicationsOverTimeChart from "../components/ApplicationsOverTimeChart";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

function getFollowUpInfo(job) {
  if (!job.followUpDate) return null;

  const today = new Date();
  const follow = new Date(job.followUpDate);

  // Ignore time portion (only compare dates)
  today.setHours(0, 0, 0, 0);
  follow.setHours(0, 0, 0, 0);

  const diffMs = follow.getTime() - today.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24); // +ve: future, -ve: past

  const finalStatuses = ["Offer", "Rejected"];
  const isFinal = finalStatuses.includes(job.status);

  if (isFinal) return null;

  if (diffDays < 0) {
    return { label: "Follow-up overdue", type: "overdue" };
  }
  if (diffDays === 0) {
    return { label: "Follow up today", type: "today" };
  }
  if (diffDays > 0 && diffDays <= 3) {
    return { label: "Upcoming follow-up", type: "upcoming" };
  }

  return { label: "Follow-up scheduled", type: "scheduled" };
}

function getStatusBadgeClasses(status) {
  let base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium";

  switch (status) {
    case "Applied":
      return base + " bg-slate-800 text-slate-100 ring-1 ring-slate-600";
    case "Online Test":
      return base + " bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/40";
    case "Interview":
      return (
        base + " bg-purple-500/15 text-purple-300 ring-1 ring-purple-500/40"
      );
    case "Offer":
      return (
        base + " bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40"
      );
    case "Rejected":
      return base + " bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/40";
    default:
      return base + " bg-slate-800 text-slate-100 ring-1 ring-slate-700";
  }
}

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState("");

  // NEW: search + filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  // NEW: sorting state
  const [sortOption, setSortOption] = useState("latest");
  const [showFollowUpsOnly, setShowFollowUpsOnly] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        setJobs(res.data.jobs);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch jobs");
      } finally {
        setLoadingJobs(false);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await api.get("/jobs/stats");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchJobs();
    fetchStats();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      const res = await api.get("/jobs/stats");
      setStats(res.data);
      showToast("Job deleted successfully 🗑️", "success");
    } catch (err) {
      console.error(err);
      showToast("Delete failed", "error");
      alert("Delete failed");
    }
  };

  // 🔍 Compute filtered jobs based on search + status
  const filteredJobs = jobs.filter((job) => {
    const text = `${job.company} ${job.position}`.toLowerCase();
    const matchesSearch = text.includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ? true : job.status === statusFilter;

    // NEW: follow-up filter
    const matchesFollowUp = !showFollowUpsOnly
      ? true
      : Boolean(getFollowUpInfo(job));

    return matchesSearch && matchesStatus && matchesFollowUp;
  });

  // NEW: sort the filtered jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    // Prefer appliedDate if present, otherwise fall back to createdAt
    const dateA = new Date(a.appliedDate || a.createdAt);
    const dateB = new Date(b.appliedDate || b.createdAt);

    if (sortOption === "latest") {
      // Newest first
      return dateB - dateA;
    }

    if (sortOption === "oldest") {
      // Oldest first
      return dateA - dateB;
    }

    if (sortOption === "company-asc") {
      // Company A–Z
      return a.company.localeCompare(b.company);
    }

    if (sortOption === "company-desc") {
      // Company Z–A
      return b.company.localeCompare(a.company);
    }

    // Fallback: no change
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Welcome, {user?.name}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Overview of your job search progress and upcoming follow-ups.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Total applications pill */}
          <div className="hidden sm:inline-flex items-center rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-300">
            Total applications:&nbsp;
            <span className="font-semibold text-slate-50">
              {stats?.total ?? jobs.length}
            </span>
          </div>

          {/* Add Job button */}
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate("/add-job")}
            className="flex items-center gap-1 shadow-sm"
          >
            <span>➕</span>
            <span>Add Job</span>
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      {loadingStats || !stats ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard label="Total" value={stats.total} color="bg-slate-800" />
          <StatCard
            label="Applied"
            value={stats["Applied"]}
            color="bg-blue-900/60"
          />
          <StatCard
            label="Online Test"
            value={stats["Online Test"]}
            color="bg-amber-900/60"
          />
          <StatCard
            label="Interview"
            value={stats["Interview"]}
            color="bg-purple-900/60"
          />
          <StatCard
            label="Offer"
            value={stats["Offer"]}
            color="bg-emerald-900/60"
          />
          <StatCard
            label="Rejected"
            value={stats["Rejected"]}
            color="bg-rose-900/60"
          />
        </div>
      )}

      {/* Charts row: status + source */}
      {!loadingStats && stats && (
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <StatusChart stats={stats} />
          <SourceChart jobs={jobs} />
        </div>
      )}

      {/* Applications over time */}
      {!loadingJobs && jobs.length > 0 && (
        <div className="mt-4">
          <ApplicationsOverTimeChart jobs={jobs} />
        </div>
      )}

      {/* Filters row: Search + Status + Sort */}
      <Card className="mt-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between px-4 py-3">
        {/* Left side: search + status */}
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="w-full sm:w-64">
            <label className="text-xs text-slate-300">Search</label>
            <input
              type="text"
              placeholder="Search by company or position..."
              className="input-field mt-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status filter */}
          <div className="w-full sm:w-40">
            <label className="text-xs text-slate-300">Status</label>
            <select
              className="input-field mt-1"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Applied">Applied</option>
              <option value="Online Test">Online Test</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Sort dropdown */}
          <div className="w-full sm:w-48">
            <label className="text-xs text-slate-300">Sort by</label>
            <select
              className="input-field mt-1"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="latest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="company-asc">Company (A–Z)</option>
              <option value="company-desc">Company (Z–A)</option>
            </select>
          </div>
        </div>

        {/* Right side: follow-up toggle + count */}
        <div className="flex flex-col items-end gap-2 text-xs">
          <label className="flex items-center gap-2 text-slate-300">
            <input
              type="checkbox"
              checked={showFollowUpsOnly}
              onChange={(e) => setShowFollowUpsOnly(e.target.checked)}
              className="h-4 w-4 rounded border-slate-500 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
            />
            <span className="text-[11px] sm:text-xs">Show follow-ups only</span>
          </label>

          <div className="text-[11px] sm:text-xs text-slate-400">
            Showing{" "}
            <span className="text-slate-100 font-semibold">
              {sortedJobs.length}
            </span>{" "}
            of{" "}
            <span className="text-slate-100 font-semibold">{jobs.length}</span>{" "}
            jobs
          </div>
        </div>
      </Card>

      {/* Jobs table */}
      <Card className="overflow-hidden mt-6">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-slate-100">Job Applications</h3>
        </div>

        {loadingJobs ? (
          <JobsTableSkeleton />
        ) : error ? (
          <p className="p-4 text-sm text-red-400">{error}</p>
        ) : jobs.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-300">
            <p>You haven&apos;t added any job applications yet.</p>
            <button
              onClick={() => navigate("/add-job")}
              className="mt-3 inline-flex items-center gap-1 rounded-lg bg-indigo-500 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-600 transition"
            >
              <span>➕</span>
              <span>Add your first job</span>
            </button>
          </div>
        ) : filteredJobs.length === 0 ? (
          <p className="p-4 text-sm text-slate-300">
            No jobs match your search/filter. Try clearing filters or adjusting
            your search.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-950/70 border-b border-slate-800">
                <th className="px-4 py-3 text-left text-[11px] font-semibold tracking-wide text-slate-300 uppercase">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold tracking-wide text-slate-300 uppercase">
                  Position
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold tracking-wide text-slate-300 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold tracking-wide text-slate-300 uppercase w-32">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedJobs.map((job, index) => (
                <tr
                  key={job._id}
                  className={`border-t border-slate-800 hover:bg-slate-900/70 transition-colors ${
                    index % 2 === 0 ? "bg-slate-900/40" : "bg-slate-900/20"
                  }`}
                >
                  <td className="px-4 py-3 align-top">
                    <div className="font-medium text-slate-100">
                      {job.company}
                    </div>

                    {/* Follow-up badge (if any) */}
                    {(() => {
                      const info = getFollowUpInfo(job);
                      if (!info) return null;

                      let baseClasses =
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium mt-1";

                      if (info.type === "overdue") {
                        baseClasses +=
                          " bg-red-500/15 text-red-300 ring-1 ring-red-500/40";
                      } else if (info.type === "today") {
                        baseClasses +=
                          " bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/40";
                      } else if (info.type === "upcoming") {
                        baseClasses +=
                          " bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/40";
                      } else {
                        // scheduled
                        baseClasses +=
                          " bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30";
                      }

                      return <span className={baseClasses}>{info.label}</span>;
                    })()}
                  </td>

                  <td className="px-4 py-3">{job.position}</td>

                  <td className="px-4 py-3">
                    <span className={getStatusBadgeClasses(job.status)}>
                      {job.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/edit-job/${job._id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(job._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div
      className={`rounded-xl border border-slate-800 px-4 py-3 flex flex-col gap-1 ${color}`}
    >
      <span className="text-xs uppercase tracking-wide text-slate-300">
        {label}
      </span>
      <span className="text-2xl font-bold text-white">{value}</span>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-20 rounded-xl border border-slate-800 bg-slate-800/60"
        />
      ))}
    </div>
  );
}

function ChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-pulse">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="h-64 rounded-xl border border-slate-800 bg-slate-800/60"
        />
      ))}
    </div>
  );
}

function JobsTableSkeleton() {
  return (
    <div className="p-4 space-y-3 animate-pulse">
      <div className="h-4 w-32 bg-slate-700/70 rounded" />
      <div className="h-10 w-full bg-slate-800/60 rounded" />
      <div className="h-10 w-full bg-slate-800/60 rounded" />
      <div className="h-10 w-full bg-slate-800/60 rounded" />
    </div>
  );
}

export default Dashboard;
