import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

function Feed() {
  const feed = useSelector((store) => store.feed);
  const user = useSelector((store) => store.user);

  const dispatch = useDispatch();
  useEffect(() => {
    const getFeed = async () => {
      if (feed !== null) return;
      try {
        const res = await axios.get(BASE_URL + "/feed", {
          withCredentials: true,
        });

        dispatch(addFeed(res?.data?.data));
      } catch (error) {
        console.log(error);
      }
    };
    getFeed();
  }, [user, feed, dispatch]);

  if (feed === null) {
    return (
      <h1 className="flex justify-center my-10 text-gray-400">
        Loading feed...
      </h1>
    );
  }

  // No users available
  if (feed.length === 0) {
    return (
      <h1 className="flex justify-center my-10 text-gray-500">
        No new users found!
      </h1>
    );
  }

  return (
    feed.length > 0 && (
      <div className="flex justify-center">
        <UserCard user={feed} />
      </div>
    )
  );
}

export default Feed;
