import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // Password validation rules

  const getPasswordRules = (value) => ({
    minLength: value?.length >= 8,
    hasUppercase: /[A-Z]/.test(value),
    hasLowercase: /[a-z]/.test(value),
    hasNumber: /\d/.test(value),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
  });

  const passwordRules = getPasswordRules(password);
  const isPasswordValid = (value) =>
    Object.values(getPasswordRules(value)).every(Boolean);

  // Validation functions
  const validateField = (field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case "firstName":
        if (!value.trim()) {
          newErrors.firstName = "First name is required";
        } else if (value.trim().length < 4) {
          newErrors.firstName = "First name must be at least 4 characters";
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          newErrors.firstName = "First name can only contain letters";
        } else {
          delete newErrors.firstName;
        }
        break;

      case "lastName":
        if (!value.trim()) {
          newErrors.lastName = "Last name is required";
        } else if (value.trim().length < 4) {
          newErrors.lastName = "Last name must be at least 4 characters";
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          newErrors.lastName = "Last name can only contain letters";
        } else {
          delete newErrors.lastName;
        }
        break;

      case "emailId":
        if (!value.trim()) {
          newErrors.emailId = "Email is required";
        } else if (!emailRegex.test(value.trim())) {
          newErrors.emailId = "Please enter a valid email address";
        } else {
          delete newErrors.emailId;
        }
        break;

      case "password":
        if (!value) {
          newErrors.password = "Password is required";
        } else if (!isPasswordValid) {
          newErrors.password = "Password does not meet requirements";
        } else {
          delete newErrors.password;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    validateField("firstName", firstName);
    validateField("lastName", lastName);
    validateField("emailId", emailId);
    validateField("password", password);

    return (
      firstName.trim() &&
      lastName.trim() &&
      emailId.trim() &&
      password &&
      isPasswordValid &&
      Object.keys(errors).length === 0
    );
  };

  const handleSignup = async () => {
    setApiError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          emailId: emailId.trim().toLowerCase(),
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      navigate("/profile");
    } catch (err) {
      console.log(err);
      if (err.response?.data?.message) {
        setApiError(err.response.data.message);
      } else if (err.response?.status === 400) {
        setApiError("Invalid input data. Please check your information.");
      } else if (err.response?.status === 409) {
        setApiError("Email already exists. Please try with a different email.");
      } else if (err.response?.status >= 500) {
        setApiError("Server error. Please try again later.");
      } else {
        setApiError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFirstNameChange = (e) => {
    const value = e.target.value;
    setFirstName(value);
    setApiError("");
    validateField("firstName", value);
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value;
    setLastName(value);
    setApiError("");
    validateField("lastName", value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmailId(value);
    setApiError("");
    validateField("emailId", value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setApiError("");
    validateField("password", value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSignup();
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Join DevMatcha
          </h1>
          <p className="text-gray-400">Create your developer profile</p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Signup Form */}
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          {apiError && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-red-400 flex-shrink-0"
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
            {/* Name Fields Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Name *
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    onChange={handleFirstNameChange}
                    onKeyPress={handleKeyPress}
                    placeholder="John"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.firstName
                        ? "border-red-500/50 focus:ring-red-500/30"
                        : "border-slate-600/50 focus:ring-purple-500/30 focus:border-purple-500/50"
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 flex-shrink-0"
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
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name *
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    onChange={handleLastNameChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Doe"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.lastName
                        ? "border-red-500/50 focus:ring-red-500/30"
                        : "border-slate-600/50 focus:ring-purple-500/30 focus:border-purple-500/50"
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 flex-shrink-0"
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
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address *
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
                  placeholder="john.doe@example.com"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.emailId
                      ? "border-red-500/50 focus:ring-red-500/30"
                      : "border-slate-600/50 focus:ring-purple-500/30 focus:border-purple-500/50"
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.emailId && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1 flex-shrink-0"
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
                  {errors.emailId}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password *
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
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Create a strong password"
                  className={`w-full pl-10 pr-12 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.password
                      ? "border-red-500/50 focus:ring-red-500/30"
                      : "border-slate-600/50 focus:ring-purple-500/30 focus:border-purple-500/50"
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
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
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m3.121-3.121l4.243 4.242M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  ) : (
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Requirements */}
              {password && (
                <div className="mt-3 p-3 bg-slate-900/50 rounded-lg">
                  <p className="text-xs text-gray-300 mb-2">
                    Password must contain:
                  </p>
                  <div className="space-y-1">
                    {[
                      { key: "minLength", text: "At least 8 characters" },
                      {
                        key: "hasUppercase",
                        text: "One uppercase letter (A-Z)",
                      },
                      {
                        key: "hasLowercase",
                        text: "One lowercase letter (a-z)",
                      },
                      { key: "hasNumber", text: "One number (0-9)" },
                      {
                        key: "hasSpecialChar",
                        text: "One special character (!@#$%^&*)",
                      },
                    ].map(({ key, text }) => (
                      <div key={key} className="flex items-center space-x-2">
                        {passwordRules[key] ? (
                          <svg
                            className="w-4 h-4 text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                        <span
                          className={`text-xs ${
                            passwordRules[key]
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Signup Button */}
            <button
              className="group/btn relative overflow-hidden w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              onClick={handleSignup}
              disabled={
                isLoading || !isPasswordValid || Object.keys(errors).length > 0
              }
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
                    <span>Creating Account...</span>
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
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    <span>Create Account</span>
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            </button>

            {/* Login Link */}
            <div className="text-center pt-4">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-purple-400 hover:text-pink-400 font-medium transition-colors duration-300 hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
