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
      alert("Error adding job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto" }}>
      <h2>Add Job</h2>
      <form onSubmit={handleSubmit}>
        <label>Company</label>
        <input name="company" onChange={handleChange} required />

        <label>Position</label>
        <input name="position" onChange={handleChange} required />

        <label>Status</label>
        <select name="status" onChange={handleChange}>
          <option>Applied</option>
          <option>Online Test</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>

        <label>Source</label>
        <select name="source" onChange={handleChange}>
          <option>LinkedIn</option>
          <option>Naukri</option>
          <option>Indeed</option>
          <option>Referral</option>
          <option>Other</option>
        </select>

        <label>Location</label>
        <input name="location" onChange={handleChange} />

        <label>Notes</label>
        <textarea name="notes" onChange={handleChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}

export default AddJob;
