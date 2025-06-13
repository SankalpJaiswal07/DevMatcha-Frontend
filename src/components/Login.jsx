import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";

function Login() {
  const [emailId, setEmailId] = useState("sankalp@gmail.com");
  const [password, setPassword] = useState("Sankalp@123");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Clear previous API error
    setApiError("");

    setIsLoading(true);

    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId: emailId.trim(),
          password,
        },
        { withCredentials: true }
      );

      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      console.log(err);

      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const message = err.response.data?.message || err.response.data?.error;

        switch (status) {
          case 400:
            setApiError(message || "Invalid email or password");
            break;
          case 404:
            setApiError("User not found");
            break;
          case 500:
            setApiError("Server error. Please try again later");
            break;
          default:
            setApiError(message || "Login failed. Please try again");
        }
      } else if (err.request) {
        // Network error
        setApiError("Network error. Please check your connection");
      } else {
        // Other error
        setApiError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Clear field errors when user starts typing
  const handleEmailChange = (e) => {
    setEmailId(e.target.value);
    if (errors.emailId) {
      setErrors((prev) => ({ ...prev, emailId: "" }));
    }
    if (apiError) setApiError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
    if (apiError) setApiError("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400">Sign in to your developer account</p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Login Form */}
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          {apiError && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-red-300 text-sm">{apiError}</span>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  value={emailId}
                  onChange={handleEmailChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.emailId
                      ? "border-red-500/50 focus:ring-red-500/30"
                      : "border-slate-600/50 focus:ring-purple-500/30 focus:border-purple-500/50"
                  }`}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.password
                      ? "border-red-500/50 focus:ring-red-500/30"
                      : "border-slate-600/50 focus:ring-purple-500/30 focus:border-purple-500/50"
                  }`}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              className="group/btn relative overflow-hidden w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              onClick={handleLogin}
              disabled={isLoading}
            >
              <div className="flex items-center justify-center space-x-2">
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
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
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Sign In</span>
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            </button>

            {/* Sign Up Link */}
            <div className="text-center pt-4">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-purple-400 hover:text-pink-400 font-medium transition-colors duration-300 hover:underline"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
