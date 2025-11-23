import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function AddJob() {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    status: "Applied",
    source: "LinkedIn",
    location: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/jobs", formData);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error adding job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Add Job</h2>
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
              placeholder="Company name"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-sm text-slate-200">Position</label>
            <input
              name="position"
              className="input-field"
              placeholder="Job title / role"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-200">Status</label>
              <select
                name="status"
                className="input-field"
                value={formData.status}
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
                value={formData.source}
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

          <div>
            <label className="text-sm text-slate-200">Location</label>
            <input
              name="location"
              className="input-field"
              placeholder="City / Remote"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm text-slate-200">Notes</label>
            <textarea
              name="notes"
              className="input-field"
              placeholder="Interview notes, HR name, etc."
              rows={3}
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 disabled:opacity-70 text-sm font-medium"
          >
            {loading ? "Saving..." : "Save Job"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddJob;
