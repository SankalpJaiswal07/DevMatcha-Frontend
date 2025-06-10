import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import UserCard from "./UserCard";

function EditProfile({ user }) {
  console.log(user);
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl);
  const [age, setAge] = useState(user?.age);
  const [gender, setGender] = useState(user?.gender);
  const [about, setAbout] = useState(user?.about);
  const [skills, setSkills] = useState(user?.skills?.join(", "));
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

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
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4 flex flex-col md:flex-row gap-6 items-start justify-center">
        {/* Edit Profile Form */}
        <div className="w-full md:w-2/3">
          <div className="card bg-base-100 shadow-2xl border border-primary/20">
            <div className="card-body">
              <h2 className="card-title text-3xl font-bold text-center text-primary mb-6">
                Edit Profile
              </h2>
              <div className="space-y-4">
                {/* First Name */}
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="w-32 font-semibold text-primary">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    className="input input-bordered input-primary focus:input-secondary flex-1"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                {/* Last Name */}
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="w-32 font-semibold text-primary">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    className="input input-bordered input-primary focus:input-secondary flex-1"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                {/* Age */}
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="w-32 font-semibold text-primary">Age</label>
                  <input
                    type="number"
                    placeholder="Enter age"
                    className="input input-bordered input-primary focus:input-secondary flex-1"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="18"
                    max="100"
                  />
                </div>

                {/* Gender */}
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="w-32 font-semibold text-primary">
                    Gender
                  </label>
                  <select
                    className="select select-bordered select-primary focus:select-secondary flex-1"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                  </select>
                </div>

                {/* Photo URL */}
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="w-32 font-semibold text-primary">
                    Photo URL
                  </label>
                  <input
                    type="url"
                    placeholder="Enter photo URL"
                    className="input input-bordered input-primary focus:input-secondary flex-1"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                </div>

                {/* Skills */}
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="w-32 font-semibold text-primary">
                    Skills
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., JavaScript, React, Node.js"
                    className="input input-bordered input-primary focus:input-secondary flex-1"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </div>

                {/* About */}
                <div className="flex flex-col md:flex-row md:items-start gap-2">
                  <label className="w-32 font-semibold text-primary mt-2">
                    About
                  </label>
                  <textarea
                    className="textarea textarea-bordered textarea-primary focus:textarea-secondary h-24 flex-1"
                    placeholder="Tell us about yourself..."
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                  ></textarea>
                </div>
              </div>

              {/* Save Button */}
              <div className="card-actions justify-center mt-8">
                <button
                  className="btn btn-primary btn-wide text-white hover:btn-secondary transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={saveProfile}
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User Card Preview */}
        <div className="w-full md:w-1/3">
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
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </>
  );
}

export default EditProfile;
