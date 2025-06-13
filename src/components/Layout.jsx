import { Outlet } from "react-router";
import NavBar from "./NavBar";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router";

function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    if (userData === null) return;
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (error) {
      if (error.status === 401) {
        navigate("/login");
      } else {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="relative">
      <NavBar />
      <Outlet />
    </div>
  );
}

export default Layout;
