import React from "react";
import NavBar from "../Menubar/Navbar";
import { Outlet } from "react-router";

export default () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};
