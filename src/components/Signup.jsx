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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      //signup logic
      const res = await axios.post(
        BASE_URL + "/signup",
        {
          firstName,
          lastName,
          emailId,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      navigate("/profile");
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFirstNameChange = (e) => {
    setApiError("");
    setFirstName(e.target.value);
    if (errors.emailId) {
      setErrors((prev) => ({ ...prev, firstName: errors.firstName }));
    }
    if (apiError) setApiError(apiError);
  };
  const handleLastNameChange = (e) => {
    setApiError("");
    setLastName(e.target.value);
    if (errors.lastName) {
      setErrors((prev) => ({ ...prev, lastName: errors.lastName }));
    }
    if (apiError) setApiError(apiError);
  };

  const handleEmailChange = (e) => {
    setEmailId(e.target.value);
    if (errors.emailId) {
      setErrors((prev) => ({ ...prev, emailId: errors.emailId }));
    }
    if (apiError) setApiError("");
  };

  const handlePasswordChange = (e) => {
    setApiError("");
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: errors.password }));
    }
    if (apiError) setApiError(apiError);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSignup();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card card-bordered bg-base-300 w-96">
        <div className="card-body">
          <div className="w-full p-6 m-auto rounded-md shadow-md lg:max-w-lg">
            <h1 className="text-3xl font-semibold text-center text-indigo-700">
              Sign up
            </h1>

            {apiError && (
              <div className="alert alert-error mt-4 justify-center">
                <span>{apiError}</span>
              </div>
            )}

            <div className="space-y-4 mt-6">
              <div>
                <label className="label">
                  <span className="text-base label-text">First name</span>
                </label>
                <input
                  type="firstname"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  onKeyPress={handleKeyPress}
                  placeholder="First name"
                  className={`w-full input input-bordered input-primary ${
                    errors.firstName ? "input-error" : ""
                  }`}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="label">
                  <span className="text-base label-text">Last name</span>
                </label>
                <input
                  type="lastname"
                  value={lastName}
                  onChange={handleLastNameChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Last name"
                  className={`w-full input input-bordered input-primary ${
                    errors.lastName ? "input-error" : ""
                  }`}
                  disabled={isLoading}
                />
              </div>
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
                  onClick={handleSignup}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Signup"}
                </button>
              </div>
            </div>
            <div className="mt-2">
              <span>Already have an account? </span>
              <Link className="font-semibold  text-indigo-400" to="/login">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
