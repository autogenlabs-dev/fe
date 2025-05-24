import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { projectSelector } from "@/redux/project/projectSlice";
import AdminDashboard from "@/components/DashboardNotification/adminDashboard";
import DirectorDasboard from "@/components/DashboardNotification/directorDasboard";
import GeneralDashboard from "@/components/DashboardNotification/generalDashboard";
import { authSelector } from "@/redux/auth/authSlice";
import { ADMIN, DIRECTOR, GENERAL, PROJECT_MANAGER } from "@/constants";
import WrapperComponent from "@/components/Wrapper/TableWrapper";
import axiosIns from "@/api/axios";
import Loader from "@/components/loader";

const Dashboard = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector(authSelector);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // const fetchNotifications = async () => {
  //   setLoading(true);
  //   const headers = {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${userInfo.access.token}`,
  //   };

  //   const { data } = await axiosIns.get(`/notifications`, {
  //     headers,
  //   });

  //   console.log(data, "==data:notifications");
    

  //   setNotifications(data.notifications);
  //   setLoading(false);
  // };

  // const removeNotification = async (notificationId) => {
  //   setLoading(true);
  //   const headers = {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${userInfo.access.token}`,
  //   };
  //   const { data } = await axiosIns.delete(`/notifications/${notificationId}`, {
  //     headers,
  //   });
  //   fetchNotifications();
  // };


  // useEffect(() => {
  //   fetchNotifications();
  // }, []);

  return (
      <div className="py-5 px-4">
        {loading ? (
          <div className="absolute inset-0 top-6 flex justify-center items-center z-50">
            <Loader />
          </div>
        ) : (
          <div className="">
            {/* <h2 className="mb-4">Recent Activity</h2> */}
              {/* {userInfo?.roleAccess === ADMIN && ( */}
                <AdminDashboard
                  notifications={notifications}
                  loading={loading}
                  // handleRefresh={fetchNotifications}
                  // removeNotification={removeNotification}
                />
              {/* )} */}
              {/* {(userInfo?.roleAccess === DIRECTOR ||
                userInfo?.roleAccess === PROJECT_MANAGER) && (
                <DirectorDasboard
                  notifications={notifications}
                  loading={loading}
                  handleRefresh={fetchNotifications}
                />
              )}
              {userInfo?.roleAccess === GENERAL && (
                <GeneralDashboard
                  notifications={notifications}
                  loading={loading}
                  handleRefresh={fetchNotifications}
                />
              )} */}
          </div>
        )}
      </div>
  );
};

export default Dashboard;
