import React from "react";
import SideBar from "../Menubar/AccountMenu";
import { Outlet } from "react-router";

export default (props) => {
  return (
    <>
      <SideBar titleName={props.nameIt} UserDP={props.profilePic} />
      <Outlet />
    </>
  );
};
