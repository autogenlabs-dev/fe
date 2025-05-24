import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { authSelector, logoutUser } from "@/redux/auth/authSlice";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { BellRing, LogOut } from 'lucide-react';
import { User } from 'lucide-react';
import logo from "@/assets/Logo_png.png";
import axiosIns from '@/api/axios';

const Header = ({ toggleSidebar }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useSelector(authSelector);
  const dispatch = useDispatch();
  const location = useLocation();
  const userName = userInfo ? userInfo?.name : null;
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const routes = {
    createproject: "Add new project",
    projects: "Projects",
    createtimesheet:"Create Timesheet",
    requesttimesheet: "Requested Time Sheet",
    timesheetlist: "TimeSheets",
    timesheet:"TimeSheet",
    ["request-expensesheet"]: "Request Expense Sheet",
    requestexpensesheet: "Request Expense Sheet",
    expensesheet: "Expensesheet",
    users: "Users",
    dashboard: "Dashboard",
    createuser: "Create User",
    projectrequests: "Project Requests",
  };
  const currentRoute = Object.keys(routes).find((route) =>
    location.pathname.includes(route)
  );
  const isEditingUser = location.pathname.includes("/users/");
  const isEditingProject = location.pathname.includes("/projects/");
  const isProjectDetails = location.pathname.includes("/projectdetails/");
  const isTimeSheetDetails = location.pathname.includes("/timesheetdetails/");

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const closeProfileMenu = () => {
    setIsProfileMenuOpen(false);
  };

  const fetchNotifications = async () => {
    setLoading(true);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.access.token}`,
    };

    const { data } = await axiosIns.get(`/notifications`, {
      headers,
    });

    console.log(data, "==data:notifications");
    

    setNotifications(data.notifications);
    setLoading(false);
  };

  const removeNotification = async (notificationId) => {
    setLoading(true);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.access.token}`,
    };
    const { data } = await axiosIns.delete(`/notifications/${notificationId}`, {
      headers,
    });
    fetchNotifications();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotification(false); // Close notification dropdown
      }
    };
    
    // Add event listener for clicks
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      // Cleanup event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        closeProfileMenu(); // Close notification dropdown
      }
    };
    
    // Add event listener for clicks
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      // Cleanup event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <header className="header">
      <button className="menu-btn" onClick={toggleSidebar}>&#9776;</button>
      <div className='w-full flex items-center justify-between'>
        <div className="flex items-center justify-between w-full z-10 text-[#002147]">
          <div className='ml-2 md:ml-4 flex gap-5 items-center'>
            {localStorage?.getItem("isShowLogoInHeader") &&<img src={logo} className="w-[40px] h-[40px] object-contain bg-main rounded-full" />}
            <h1 className={`text-[#002147] font-bold md:text-xl`}>
                {isEditingUser
                    ? "Edit User"
                    : isEditingProject
                    ? "Edit Project"
                    : isProjectDetails
                    ? "Projects Details"
                    : isTimeSheetDetails
                    ? "Time Sheet Details"
                    : routes[currentRoute] || "Dashboard"}
            </h1>
          </div>
            <div className="flex items-center">
            {/* {userName && <p className="mr-2">{userName}</p>} */}
              <ul className="  flex flex-shrink-0 mr-2 md:mr-10">
                  <li className="relative " ref={notificationRef}>
                  <button
                      className="align-middle rounded-full focus:shadow-outline-purple focus:outline-none border-2 "
                      onClick={()=>setShowNotification(!showNotification)}
                      // onKeyDown={(e) => e.key === "Escape" && closeProfileMenu()}
                      aria-label="Account"
                      aria-haspopup="true"
                  >
                      {/* <img
                      className="object-cover w-10 h-10 rounded-full "
                      src="https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2220431045.jpg"
                      alt=""
                      aria-hidden="true"
                      /> */}
                      {/* <User  className="text-[#002147]  w-8 h-8 rounded-full "/> */}
                      <div className='p-1 border border-gray-300 rounded-full'>
                        <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="27" height="27">
                          <path 
                            d="m20,8c2.206,0,4-1.794,4-4s-1.794-4-4-4-4,1.794-4,4,1.794,4,4,4Zm0-6c1.103,0,2,.897,2,2s-.897,2-2,2-2-.897-2-2,.897-2,2-2Zm3.272,14.247l-.005-.019s0,0,0-.001h0l-1.573-6.473c-.538.158-1.105.247-1.694.247-.104,0-.205-.01-.308-.016l1.637,6.735c.002.007.007.012.008.02h-.004c.082.308.021.615-.169.866-.192.255-.476.395-.796.395H3.493c-.305,0-.589-.137-.778-.371-.192-.24-.264-.548-.207-.812l2.352-9.117c.746-3.356,3.682-5.7,7.14-5.7.773,0,1.523.132,2.232.361.188-.661.484-1.275.872-1.821-.979-.348-2.025-.539-3.104-.539C7.598,0,3.859,2.988,2.916,7.233L.564,16.352c-.197.89.018,1.811.591,2.528.573.712,1.426,1.12,2.338,1.12h3.608c.465,2.279,2.484,4,4.899,4s4.434-1.721,4.899-4h3.47c.947,0,1.817-.433,2.39-1.186.556-.733.739-1.66.514-2.55-.001-.006,0-.011,0-.017Zm-11.272,5.753c-1.302,0-2.402-.839-2.816-2h5.631c-.414,1.161-1.514,2-2.816,2Z" 
                            stroke='rgb(29 78 216)' 
                            strokeWidth='0.5' 
                          />
                        </svg>
                      </div>
                  </button>
                  {showNotification && (
                    <ul
                      className="scrollable absolute right-0 w-[370px] p-2 mt-4 space-y-2 text-[#002147] bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700 z-[9999] max-h-[400px] overflow-auto"
                      aria-label="submenu"
                    >
                      {notifications?.length > 0 ? (
                        notifications.map((notif) => (
                          <li className="flex items-center gap-3 px-2 pt-2 pb-1 cursor-pointer border-b border-gray-200 hover:bg-gray-300" key={notif.id}>
                            <div className='w-6 h-6'>
                              <BellRing className="w-5 h-5 object-contain" style={{ aspectRatio: "1 / 1" }} /> 
                            </div>
                            {notif.message}
                          </li>
                        ))
                      ) : (
                        <li className="flex justify-center px-2">No Notification</li>
                      )}
                    </ul>
                  )}
                  </li>
              </ul>
              <ul className="  flex flex-shrink-0 mr-2 md:mr-10">
                  <li className="relative " ref={profileRef}>
                  <button
                      className="align-middle rounded-full focus:shadow-outline-purple focus:outline-none border-2 "
                      onClick={toggleProfileMenu}
                      onKeyDown={(e) => e.key === "Escape" && closeProfileMenu()}
                      aria-label="Account"
                      aria-haspopup="true"
                  >
                      {/* <img
                      className="object-cover w-10 h-10 rounded-full "
                      src="https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2220431045.jpg"
                      alt=""
                      aria-hidden="true"
                      /> */}
                      <User  className="text-[#002147]  w-8 h-8 rounded-full "/>

                  </button>
                  {isProfileMenuOpen && (
                    <ul
                      onClick={closeProfileMenu}
                      onKeyDown={(e) => e.key === "Escape" && closeProfileMenu()}
                      className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700 z-50"
                      aria-label="submenu"
                      >
                        <li className="text-center font-bold">{userName && userName.charAt(0).toUpperCase() + userName.slice(1)}</li>
                        <li className="flex">
                            <Button
                            className="inline-flex border gap-2 border-red-500 items-center w-full px-2 py-1 text-sm bg-white text-gray-600 font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                            onClick={() => {
                                dispatch(logoutUser());
                            }}
                            >
                            <LogOut className="text-red-500"/>
                            <span className="text-red-500">Log out</span>
                            </Button>
                        </li>
                      </ul>
                  )}
                  </li>
              </ul>
          </div>
      </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};

export default Header;
