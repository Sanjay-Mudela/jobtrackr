import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../context/ToastContext";

function EditJob() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const { showToast } = useToast();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        const data = res.data;

        // Normalize followUpDate for <input type="date" />
        const normalizedJob = {
          ...data,
          followUpDate: data.followUpDate
            ? data.followUpDate.slice(0, 10) // "YYYY-MM-DD"
            : "",
        };

        setJob(normalizedJob);
      } catch (err) {
        console.error(err);
        alert("Failed to load job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/jobs/${id}`, job);
      showToast("Job updated successfully ✏️", "success");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      showToast("Failed to update job", "error");
      alert("Failed to update job");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !job) return <p>Loading...</p>;

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Edit Job</h2>
        <button
          onClick={() => navigate(-1)}
          className="text-xs text-slate-300 hover:text-indigo-300"
        >
          ← Back
        </button>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-200">Company</label>
            <input
              name="company"
              className="input-field"
              value={job.company}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm text-slate-200">Position</label>
            <input
              name="position"
              className="input-field"
              value={job.position}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-200">Status</label>
              <select
                name="status"
                className="input-field"
                value={job.status}
                onChange={handleChange}
              >
                <option>Applied</option>
                <option>Online Test</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-200">Source</label>
              <select
                name="source"
                className="input-field"
                value={job.source || "Other"}
                onChange={handleChange}
              >
                <option>LinkedIn</option>
                <option>Naukri</option>
                <option>Indeed</option>
                <option>Company Website</option>
                <option>Referral</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* NEW: Follow-up date (optional) */}
          <div>
            <label className="text-sm text-slate-200">
              Follow-up date{" "}
              <span className="text-xs text-slate-400">(optional)</span>
            </label>
            <input
              type="date"
              name="followUpDate"
              className="input-field"
              value={job.followUpDate || ""}
              onChange={handleChange}
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Update when you plan to follow up for this application.
            </p>
          </div>

          <div>
            <label className="text-sm text-slate-200">Location</label>
            <input
              name="location"
              className="input-field"
              value={job.location || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm text-slate-200">Notes</label>
            <textarea
              name="notes"
              className="input-field"
              rows={3}
              value={job.notes || ""}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full mt-2 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 disabled:opacity-70 text-sm font-medium"
          >
            {saving ? "Updating..." : "Update Job"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditJob;
