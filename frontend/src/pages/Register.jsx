import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const { showToast } = useToast();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/register", formData);
      login(res.data.user, res.data.token);
      showToast("Account created successfully 🎉", "success");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 gap-10 py-10">
        {/* Left: branding / benefits */}
        <div className="hidden md:flex flex-col justify-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-50">
            Create your <span className="text-indigo-400">JobTrackr</span>{" "}
            account
          </h1>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            Stay organized and consistent with your job hunt. Track every
            application, status update, and follow-up in one place.
          </p>

          <div className="mt-6 grid gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              <span>See which platforms give you the best responses.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>
                Plan follow-ups instead of forgetting about applications.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
              <span>Built to showcase your MERN skills to recruiters.</span>
            </div>
          </div>
        </div>

        {/* Right: register form card */}
        <Card className="p-6 sm:p-8 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-50">
              Create an account
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Sign up to start tracking your job applications.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-rose-500/60 bg-rose-950/40 px-3 py-2 text-xs text-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-xs font-medium text-slate-300">Name</label>
              <Input
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-medium text-slate-300">
                Email
              </label>
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-medium text-slate-300">
                Password
              </label>
              <Input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full justify-center"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </div>
          </form>

          {/* Footer links */}
          <div className="mt-4 text-xs text-slate-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-indigo-400 hover:text-indigo-300 underline-offset-2 hover:underline"
            >
              Sign in
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Register;
