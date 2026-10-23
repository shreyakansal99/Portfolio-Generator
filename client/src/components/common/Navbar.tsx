import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <Link to="/" className="text-xl font-bold text-indigo-600">
        PortfolioGen
      </Link>

      <div className="flex items-center gap-4 text-sm font-medium">
        {user ? (
          <>
            <Link to="/dashboard" className="text-slate-700 hover:text-indigo-600">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-slate-700 hover:text-indigo-600">
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}