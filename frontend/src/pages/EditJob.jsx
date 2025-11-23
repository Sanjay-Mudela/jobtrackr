import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";

function EditJob() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data);
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put(`/jobs/${id}`, job);
    navigate("/dashboard");
  };

  if (!job) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto" }}>
      <h2>Edit Job</h2>
      <form onSubmit={handleSubmit}>
        <label>Company</label>
        <input name="company" value={job.company} onChange={handleChange} />

        <label>Position</label>
        <input name="position" value={job.position} onChange={handleChange} />

        <label>Status</label>
        <select name="status" value={job.status} onChange={handleChange}>
          <option>Applied</option>
          <option>Online Test</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>

        <label>Notes</label>
        <textarea name="notes" value={job.notes} onChange={handleChange} />

        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default EditJob;
