import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequests } from "../utils/requestSlice";

function Requests() {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequests = async (status, _id) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequests(_id));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });

      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return;

  if (requests.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            No Pending Requests
          </h1>
          <p className="text-gray-400">You're all caught up!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Connection Requests
          </h1>
          <p className="text-gray-400">
            Developers who want to connect with you
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Requests List */}
        <div className="space-y-6">
          {requests.map((request) => {
            const { _id, firstName, lastName, photoUrl, age, gender, about } =
              request.fromUserId;

            return (
              <div
                key={_id}
                className="group bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-500/30"
              >
                <div className="flex items-center space-x-6">
                  {/* Profile Image */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-purple-500/20 group-hover:ring-purple-500/40 transition-all duration-300">
                      <img
                        alt="profile"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={photoUrl}
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors duration-300">
                      {firstName + " " + lastName}
                    </h2>
                    {age && gender && (
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {age + ", " + gender}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-500/30">
                          Pending
                        </span>
                      </div>
                    )}
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                      {about}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      className="group/btn relative overflow-hidden bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 hover:scale-105 active:scale-95"
                      onClick={() => reviewRequests("rejected", request._id)}
                    >
                      <div className="flex items-center space-x-2">
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        <span>Reject</span>
                      </div>
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                    </button>

                    <button
                      className="group/btn relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 hover:scale-105 active:scale-95"
                      onClick={() => reviewRequests("accepted", request._id)}
                    >
                      <div className="flex items-center space-x-2">
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
                        <span>Accept</span>
                      </div>
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Stats */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-slate-800/30 backdrop-blur-lg border border-slate-700/50 rounded-full px-6 py-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-gray-400 text-sm">
              {requests.length} pending request
              {requests.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Requests;
