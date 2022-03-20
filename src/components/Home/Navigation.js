import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";
import Home from "./Home";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";
import Profile from "../Profile/Profile";
import Market from "../Market/Market";
import WithoutNav from "./WithoutNav";
import WithNav from "./WithNav";
import WithSideBar from "./WithSideBar";
import { SiteDataContext } from "../../SiteData";
import avatarSample from "../../assets/DashboardAsset/userProfile.png";

// Check if user  is logged in
const RequireLogIn = ({ children }) => {
  const { checkJWT, user_data, is_data_ready } =
    React.useContext(SiteDataContext);
  if (!is_data_ready) {
    return <h1>Loading...</h1>;
  }
  if (!user_data) {
    return <Navigate to="/login/?error=login" />;
  }
  if (!checkJWT()) {
    return <Navigate to="/login/?error=expired" />;
  }
  return children;
};

function Navigation() {
  return (
    <Router>
      <Routes>
        <Route element={<WithNav />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route
          element={
            <WithSideBar nameIt={"Dashboard"} profilePic={avatarSample} />
          }
        >
          <Route
            path="/dashboard"
            element={
              <RequireLogIn>
                <Dashboard dashDP={avatarSample} />
              </RequireLogIn>
            }
          />
        </Route>
        <Route
          element={<WithSideBar nameIt={"Profile"} profilePic={avatarSample} />}
        >
          <Route
            path="/profile"
            element={
              <RequireLogIn>
                <Profile avatarSample={avatarSample} />
              </RequireLogIn>
            }
          />
        </Route>
        <Route
          element={<WithSideBar nameIt={"Market"} profilePic={avatarSample} />}
        >
          <Route path="/market" element={<Market />} />
        </Route>
        <Route
          element={
            <WithSideBar nameIt={"Dashboard"} profilePic={avatarSample} />
          }
        >
          <Route
            path="/dashboard"
            element={
              <RequireLogIn>
                <Dashboard dashDP={avatarSample} />
              </RequireLogIn>
            }
          />
        </Route>
        <Route element={<WithoutNav />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default Navigation;
