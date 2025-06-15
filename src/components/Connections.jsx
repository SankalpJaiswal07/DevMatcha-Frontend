import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionsSlice";
import { Link } from "react-router";

function Connections() {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConnections = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });

      dispatch(addConnections(res?.data?.data));
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-sm mx-auto bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-3xl shadow-2xl p-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
            <svg
              className="w-10 h-10 text-white animate-spin"
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
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Loading Connections...
          </h3>
          <p className="text-gray-400 text-center leading-relaxed">
            Fetching your network of developers!
          </p>
          <div className="mt-6 inline-flex items-center px-4 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-sm">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse mr-2"></div>
            Please wait
          </div>
        </div>
      </div>
    );
  }

  if (connections.length === 0) {
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
                d="M3 21.016l.79-2.872C5.1 13.39 8.55 10.984 12 10.984M12 10a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM17 13a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM15 18h4M17 16v4"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            No Connections Yet
          </h1>
          <p className="text-gray-400">
            Start connecting with fellow developers!
          </p>
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
            Your Network
          </h1>
          <p className="text-gray-400">Connected developers in your network</p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Connections Grid */}
        <div className="grid gap-6">
          {connections.map((connection) => {
            const { _id, firstName, lastName, photoUrl, age, gender, about } =
              connection;

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
                      </div>
                    )}
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                      {about}
                    </p>
                  </div>

                  {/* Chat Button */}
                  <div className="flex-shrink-0">
                    <Link to={"/chat/" + _id}>
                      <button className="group/btn relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 active:scale-95">
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
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          <span>Chat</span>
                        </div>
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Stats */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-slate-800/30 backdrop-blur-lg border border-slate-700/50 rounded-full px-6 py-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-gray-400 text-sm">
              {connections.length} developer
              {connections.length !== 1 ? "s" : ""} in your network
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Connections;
