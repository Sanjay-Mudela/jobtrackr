import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddJob from "./pages/AddJob.jsx";
import EditJob from "./pages/EditJob.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext";
import Button from "./components/ui/Button";
import Card from "./components/ui/Card";

function App() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen text-slate-100 bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-10 bg-slate-950/70 backdrop-blur-xl border-b border-slate-800 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-bold text-indigo-400">
            JobTrackr
          </Link>

          <div className="flex items-center gap-4">
            {!user && (
              <>
                <Link
                  to="/login"
                  className="text-sm text-slate-200 hover:text-indigo-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm px-3 py-1 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white"
                >
                  Register
                </Link>
              </>
            )}

            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm text-slate-200 hover:text-indigo-300"
                >
                  Dashboard
                </Link>
                <Button variant="secondary" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8 sm:px-8">
        <Routes>
          <Route
            path="/"
            element={
              <section className="py-6">
                <Card className="p-6 sm:p-8 flex flex-col gap-6">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-400">
                      Job application dashboard
                    </p>
                    <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
                      Stay on top of your job search.
                    </h1>
                    <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl">
                      Track every application, follow-up and interview in one
                      clean dashboard. See where your efforts go and never miss
                      a follow-up.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {user ? (
                      <>
                        <Link to="/dashboard">
                          <Button variant="primary" size="md">
                            Go to dashboard
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to="/register">
                          <Button variant="primary" size="md">
                            Get started free
                          </Button>
                        </Link>
                        <Link to="/login">
                          <Button variant="secondary" size="md">
                            Sign in
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="grid gap-2 text-xs text-slate-400 sm:text-[13px]">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>
                        See applications by status, source and over time.
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                      <span>
                        Plan follow-ups with smart reminders on your dashboard.
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      <span>
                        Built as a production-ready MERN project for your
                        portfolio.
                      </span>
                    </div>
                  </div>
                </Card>
              </section>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-job"
            element={
              <ProtectedRoute>
                <AddJob />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-job/:id"
            element={
              <ProtectedRoute>
                <EditJob />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
