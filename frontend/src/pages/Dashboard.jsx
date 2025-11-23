import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        setJobs(res.data.jobs);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto" }}>
      <h2>Welcome, {user?.name}</h2>

      <button
        onClick={() => (window.location.href = "/add-job")}
        style={{ marginTop: "15px" }}
      >
        ➕ Add Job
      </button>

      <hr style={{ margin: "20px 0" }} />

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : jobs.length === 0 ? (
        <p>No job applications yet. Click “Add Job” to create one.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Company</th>
              <th>Position</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.company}</td>
                <td>{job.position}</td>
                <td>{job.status}</td>
                <td>
                  <button
                    onClick={() =>
                      (window.location.href = `/edit-job/${job._id}`)
                    }
                  >
                    ✏ Edit
                  </button>
                  <button
                    style={{ marginLeft: "5px", color: "red" }}
                    onClick={async () => {
                      try {
                        await api.delete(`/jobs/${job._id}`);
                        setJobs((prev) =>
                          prev.filter((j) => j._id !== job._id)
                        );
                      } catch {
                        alert("Delete failed");
                      }
                    }}
                  >
                    ❌ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;
