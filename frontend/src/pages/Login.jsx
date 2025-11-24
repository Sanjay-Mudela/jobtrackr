import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();
  const { showToast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reason = params.get("reason");

    if (reason === "session-expired") {
      showToast("Session expired, please sign in again", "error");
    }
  }, [location.search, showToast]);

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
      const res = await api.post("/auth/login", formData);
      login(res.data.user, res.data.token);
      showToast("Logged in successfully ✅", "success");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 gap-10 py-10">
        {/* Left: branding / marketing panel */}
        <div className="hidden md:flex flex-col justify-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-50">
            Welcome back to <span className="text-indigo-400">JobTrackr</span>
          </h1>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            Log in to track your job applications, follow-ups, and interview
            pipeline in one clean dashboard. Stay consistent and never miss a
            follow-up again.
          </p>

          <div className="mt-6 grid gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>See your applications by status, source, and time.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              <span>
                Plan follow-ups with smart reminders on the dashboard.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span>Built with a production-ready MERN stack.</span>
            </div>
          </div>
        </div>

        {/* Right: login form card */}
        <Card className="p-6 sm:p-8 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-50">Sign in</h2>
            <p className="mt-1 text-sm text-slate-400">
              Enter your email and password to access your dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-rose-500/60 bg-rose-950/40 px-3 py-2 text-xs text-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="••••••••"
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
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>

          {/* Footer links */}
          <div className="mt-4 text-xs text-slate-400">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-indigo-400 hover:text-indigo-300 underline-offset-2 hover:underline"
            >
              Create one
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Login;
