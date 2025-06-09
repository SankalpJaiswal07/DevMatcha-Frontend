import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

function EditProfile({ user }) {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [about, setAbout] = useState(user?.about || "");
  const [skills, setSkills] = useState(user?.skills?.join(", ") || "");
  const dispatch = useDispatch();

  const saveProfile = async () => {
    try {
      const res = axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, photoUrl, age, gender, about, skills },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="card bg-base-100 shadow-2xl border border-primary/20">
          <div className="card-body">
            <h2 className="card-title text-3xl font-bold text-center text-primary mb-6">
              Edit Profile
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-primary">
                    First Name
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  className="input input-bordered input-primary focus:input-secondary"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              {/* Last Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-primary">
                    Last Name
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  className="input input-bordered input-primary focus:input-secondary"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              {/* Age */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-primary">
                    Age
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="Enter age"
                  className="input input-bordered input-primary focus:input-secondary"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="18"
                  max="100"
                />
              </div>

              {/* Gender */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-primary">
                    Gender
                  </span>
                </label>
                <select
                  className="select select-bordered select-primary focus:select-secondary"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </select>
              </div>
            </div>

            {/* Photo URL */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text font-semibold text-primary">
                  Photo URL
                </span>
              </label>
              <input
                type="url"
                placeholder="Enter photo URL"
                className="input input-bordered input-primary focus:input-secondary"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </div>

            {/* Skills */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text font-semibold text-primary">
                  Skills
                </span>
              </label>
              <input
                type="text"
                placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
                className="input input-bordered input-primary focus:input-secondary"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
              <label className="label">
                <span className="label-text-alt text-secondary">
                  Separate multiple skills with commas
                </span>
              </label>
            </div>

            {/* About */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text font-semibold text-primary">
                  About
                </span>
              </label>
              <textarea
                className="textarea textarea-bordered textarea-primary focus:textarea-secondary h-24"
                placeholder="Tell us about yourself..."
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              ></textarea>
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
    </div>
  );
}

export default EditProfile;
