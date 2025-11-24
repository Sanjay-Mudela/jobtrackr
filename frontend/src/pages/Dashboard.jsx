import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

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

    return matchesSearch && matchesStatus;
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

      {/* Filters row: Search + Status */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex-1 flex gap-3">
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

          <div className="w-40">
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
        </div>

        {/* Optional count display */}
        <div className="text-xs text-slate-400 text-right">
          Showing{" "}
          <span className="text-slate-100 font-semibold">
            {filteredJobs.length}
          </span>{" "}
          of <span className="text-slate-100 font-semibold">{jobs.length}</span>{" "}
          jobs
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
              {filteredJobs.map((job) => (
                <tr
                  key={job._id}
                  className="border-t border-slate-800 hover:bg-slate-900/80"
                >
                  <td className="px-4 py-3">{job.company}</td>
                  <td className="px-4 py-3">{job.position}</td>
                  <td className="px-4 py-3">{job.status}</td>
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
