import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import StatusChart from "../components/StatusChart";
import SourceChart from "../components/SourceChart";

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Welcome, {user?.name}
          </h2>
          <p className="text-slate-400 text-sm">
            Track your job applications and see your progress at a glance.
          </p>
        </div>

        <button
          onClick={() => navigate("/add-job")}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-sm font-medium shadow-sm"
        >
          <span>➕</span>
          <span>Add Job</span>
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {loadingStats || !stats ? (
          <p className="text-sm text-slate-300">Loading stats...</p>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* Charts row: status + source */}
      {!loadingStats && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <StatusChart stats={stats} />
          <SourceChart jobs={jobs} />
        </div>
      )}

      {/* Filters row: Search + Status + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
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

          {/* NEW: Sort dropdown */}
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
          {/* NEW: Follow-ups only toggle */}
          <label className="flex items-center gap-2 text-slate-300">
            <input
              type="checkbox"
              checked={showFollowUpsOnly}
              onChange={(e) => setShowFollowUpsOnly(e.target.checked)}
              className="h-4 w-4 rounded border-slate-500 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
            />
            <span className="text-[11px] sm:text-xs">Show follow-ups only</span>
          </label>

          {/* Count display */}
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
      </div>

      {/* Jobs table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-slate-100">Job Applications</h3>
        </div>

        {loadingJobs ? (
          <p className="p-4 text-sm text-slate-300">Loading jobs...</p>
        ) : error ? (
          <p className="p-4 text-sm text-red-400">{error}</p>
        ) : filteredJobs.length === 0 ? (
          <p className="p-4 text-sm text-slate-300">
            No jobs match your search/filter. Try clearing filters or adding a
            new job.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-950">
              <tr className="text-left text-slate-400">
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedJobs.map((job) => (
                <tr
                  key={job._id}
                  className="border-t border-slate-800 hover:bg-slate-900/80"
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

                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => navigate(`/edit-job/${job._id}`)}
                      className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="px-2 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
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

export default Dashboard;
