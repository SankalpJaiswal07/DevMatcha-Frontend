import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import UserCard from "./UserCard";
import { useNavigate } from "react-router";

function EditProfile({ user }) {
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl);
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender);
  const [about, setAbout] = useState(user?.about);
  const [skills, setSkills] = useState(user?.skills?.join(", "));
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const skillsArray = skills
    .split(",")
    .map((skill) => skill.trim())
    .filter((skill) => skill);

  const saveProfile = async () => {
    //Clear Errors
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about,
          skills: skillsArray,
        },
        { withCredentials: true }
      );

      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Edit Profile Form */}
        <div className="w-full lg:w-2/3">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-purple-500/10 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent mb-2">
                Edit Profile
              </h1>
              <p className="text-gray-400">
                Update your developer profile information
              </p>
            </div>

            <div className="space-y-6">
              {/* Name Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-gray-400 transition-all duration-300"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-gray-400 transition-all duration-300"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              {/* Age and Gender Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Age */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    Age
                  </label>
                  <input
                    type="number"
                    placeholder="Enter age"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-gray-400 transition-all duration-300"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="18"
                    max="100"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    Gender
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white transition-all duration-300"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="" className="bg-slate-800">
                      Select Gender
                    </option>
                    <option value="male" className="bg-slate-800">
                      Male
                    </option>
                    <option value="female" className="bg-slate-800">
                      Female
                    </option>
                    <option value="others" className="bg-slate-800">
                      Others
                    </option>
                  </select>
                </div>
              </div>

              {/* Photo URL */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">
                  Photo URL
                </label>
                <input
                  type="url"
                  placeholder="Enter photo URL"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-gray-400 transition-all duration-300"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">
                  Skills
                </label>
                <input
                  type="text"
                  placeholder="e.g., JavaScript, React, Node.js"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-gray-400 transition-all duration-300"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
                <p className="text-sm text-gray-400">
                  Separate skills with commas
                </p>
              </div>

              {/* About */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">
                  About
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-gray-400 transition-all duration-300 resize-none h-32"
                  placeholder="Tell us about yourself..."
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 flex justify-center">
              <button
                className="relative px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 group overflow-hidden"
                onClick={saveProfile}
              >
                <span className="relative z-10">Save Profile</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            </div>
          </div>
        </div>

        {/* User Card Preview */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-4">
            <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 text-center">
                Preview
              </h3>
              <UserCard
                user={[
                  {
                    id: user._id,
                    firstName,
                    lastName,
                    photoUrl,
                    age,
                    gender,
                    about,
                    skills: skillsArray,
                  },
                ]}
                isEdit={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-emerald-500/90 backdrop-blur-lg border border-emerald-400/30 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">Profile saved successfully!</span>
          </div>
        </div>
      )}

      <style jsx="true">{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

export default EditProfile;
