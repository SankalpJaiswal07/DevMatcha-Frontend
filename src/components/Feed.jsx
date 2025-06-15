import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import { useNavigate } from "react-router";

function Feed() {
  const feed = useSelector((store) => store.feed);
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user || !user._id) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const getFeed = async () => {
      if (feed !== null) return;
      try {
        const res = await axios.get(BASE_URL + "/feed", {
          withCredentials: true,
        });

        dispatch(addFeed(res?.data?.data));
      } catch (error) {
        if (error.status === 401) {
          navigate("/login");
        } else {
          console.log(error);
        }
      }
    };
    getFeed();
  }, [user, feed, dispatch, navigate]);

  if (feed === null) {
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
            Loading Feed...
          </h3>
          <p className="text-gray-400 text-center leading-relaxed">
            Finding amazing developers for you to connect with!
          </p>
          <div className="mt-6 inline-flex items-center px-4 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-sm">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse mr-2"></div>
            Please wait
          </div>
        </div>
      </div>
    );
  }

  if (feed.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-sm mx-auto bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-3xl shadow-2xl p-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
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
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">All Caught Up!</h3>
          <p className="text-gray-400 text-center leading-relaxed">
            You've reviewed all available profiles. Check back later for more
            developers to connect with!
          </p>
          <div className="mt-6 inline-flex items-center px-4 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-sm">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse mr-2"></div>
            No more profiles
          </div>
        </div>
      </div>
    );
  }

  return (
    feed.length > 0 && (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8">
        <UserCard user={feed} />
      </div>
    )
  );
}

export default Feed;
