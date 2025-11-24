import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddJob from "./pages/AddJob.jsx";
import EditJob from "./pages/EditJob.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext";

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
                <button
                  onClick={logout}
                  className="text-sm px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700"
                >
                  Logout
                </button>
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
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-white">JobTrackr</h1>
                <p className="text-slate-300 max-w-xl">
                  Track your job applications and interviews in one place. See
                  your progress and stay on top of follow-ups.
                </p>
              </div>
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
