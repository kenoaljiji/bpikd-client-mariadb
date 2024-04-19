import React from "react";
import { Outlet } from "react-router-dom";
import AuthHeader from "./AuthHeader";
import "./style/auth.scss";

function AuthLayout() {
  // Assume you have some logic to check if user is logged in

  return (
    <div className="admin">
      <AuthHeader />
      <Outlet />
    </div>
  );
}

export default AuthLayout;
