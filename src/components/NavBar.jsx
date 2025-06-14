import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { persistor } from "../utils/appStore";
import { Link, useNavigate, useLocation } from "react-router";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { useState } from "react";

export default function NavBar() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      await persistor.flush();
      return navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      dispatch(removeUser());
      await persistor.flush();
      navigate("/login");
    }
  };

  const isActiveRoute = (path) => location.pathname === path;

  const navLinks = [
    {
      path: "/connections",
      label: "Connections",
      icon: "M3 21.016l.79-2.872C5.1 13.39 8.55 10.984 12 10.984M12 10a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM17 13a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM15 18h4M17 16v4",
    },
    {
      path: "/requests",
      label: "Requests",
      icon: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4",
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                DevMatcha
              </span>
            </Link>
          </div>

          {user && (
            <>
              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <div className="flex items-center space-x-1">
                  {navLinks.map(({ path, label, icon }) => (
                    <Link
                      key={path}
                      to={path}
                      className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isActiveRoute(path)
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                          : "text-gray-300 hover:text-white hover:bg-slate-800/50"
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={icon}
                        />
                      </svg>
                      <span>{label}</span>
                      {isActiveRoute(path) && (
                        <div className="absolute inset-0 bg-white/10 rounded-xl animate-pulse"></div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Desktop User Menu */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-300">Welcome back,</p>
                  <p className="text-sm font-semibold text-white">
                    {user.firstName + " " + user.lastName}
                  </p>
                </div>

                <div className="relative group">
                  <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-800/50 transition-all duration-300">
                    <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-purple-500/30 group-hover:ring-purple-500/60 transition-all duration-300">
                      <img
                        alt="User photo"
                        src={user.photoUrl}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <svg
                      className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                    <div className="bg-slate-800/95 backdrop-blur-lg border border-slate-700/50 rounded-xl shadow-2xl py-2">
                      <Link
                        to="/profile"
                        className="flex items-center justify-between px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
                      >
                        <span>Profile</span>
                      </Link>
                      <hr className="my-1 border-slate-700/50" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all duration-200"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        isMobileMenuOpen
                          ? "M6 18L18 6M6 6l12 12"
                          : "M4 6h16M4 12h16M4 18h16"
                      }
                    />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {user && isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700/50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map(({ path, label, icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-base font-medium transition-all duration-300 ${
                    isActiveRoute(path)
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                      : "text-gray-300 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={icon}
                    />
                  </svg>
                  <span>{label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile User Info */}
            <div className="border-t border-slate-700/50 pt-4 pb-3">
              <div className="flex items-center px-3 space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-purple-500/30">
                  <img
                    alt="User photo"
                    src={user.photoUrl}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {user.firstName + " " + user.lastName}
                  </p>
                </div>
              </div>

              <div className="mt-3 px-2 space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
                >
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-xl text-base font-medium text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
