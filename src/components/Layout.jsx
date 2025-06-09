import { Outlet } from "react-router";
import NavBar from "./NavBar";

function Layout() {
  return (
    <div className="relative">
      <NavBar />
      <Outlet />
    </div>
  );
}

export default Layout;
