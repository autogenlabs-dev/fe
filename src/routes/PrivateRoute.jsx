import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authSelector } from "@/redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Layout from "@/components/Layout/Index";

const PrivateRoute = ({ children }) => {
  const { loading, error, userInfo } = useSelector(authSelector);
  // console.log(userInfo);
  if (!userInfo?.access?.token) return <Navigate to="/login" />;
  // return <Outlet />;
  return (
    <Layout>{children}</Layout>
  );
};

export default PrivateRoute;