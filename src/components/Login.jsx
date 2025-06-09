import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router";
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
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card card-bordered bg-base-300 w-96">
        <div className="card-body">
          <div className="w-full p-6 m-auto rounded-md shadow-md lg:max-w-lg">
            <h1 className="text-3xl font-semibold text-center text-purple-700">
              Login
            </h1>

            {apiError && (
              <div className="alert alert-error mt-4 justify-center">
                <span>{apiError}</span>
              </div>
            )}

            <div className="space-y-4 mt-6">
              <div>
                <label className="label">
                  <span className="text-base label-text">Email</span>
                </label>
                <input
                  type="email"
                  value={emailId}
                  onChange={handleEmailChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Email Address"
                  className={`w-full input input-bordered input-primary ${
                    errors.emailId ? "input-error" : ""
                  }`}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="label">
                  <span className="text-base label-text">Password</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter Password"
                  className={`w-full input input-bordered input-primary ${
                    errors.password ? "input-error" : ""
                  }`}
                  disabled={isLoading}
                />
              </div>

              <div>
                <button
                  className={`btn btn-primary w-full ${
                    isLoading ? "loading" : ""
                  }`}
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
