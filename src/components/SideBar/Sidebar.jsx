import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { CalendarClock, Link } from "lucide-react";
import { Users } from "lucide-react";
import { BarChartHorizontal } from "lucide-react";
import { authSelector } from "@/redux/auth/authSlice";
import { useSelector } from "react-redux";
import { ADMIN, DIRECTOR, GENERAL, OPERATIONAL_DIRECTOR, PROJECT_MANAGER } from "@/constants";

const Sidebar = () => {
  const { userInfo } = useSelector(authSelector);

  return (
    <>
      <aside className="  flex-shrink-0  w-72 overflow-y-auto bg-white  md:block shadow-lg  min-h-screen ">
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <a className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200">
            Smart FMS
          </a>
          <ul className="mt-6">
            <li className="relative px-6 py-3">
              <NavLink
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                to={"/dashboard"}
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span className="ml-4">Dashboard</span>
              </NavLink>
            </li>
          </ul>
          <ul>
            {(userInfo?.roleAccess === ADMIN ||
              userInfo?.roleAccess === OPERATIONAL_DIRECTOR ||
              userInfo?.roleAccess === DIRECTOR ||
              userInfo?.roleAccess === PROJECT_MANAGER) && (
              <li className="relative px-6 py-3">
                <NavLink
                  className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                  to={"/createproject"}
                >
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                  <span className="ml-4">Create Project</span>
                </NavLink>
              </li>
            )}
            <li className="relative px-6 py-3">
              <NavLink
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                to={"/projects"}
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
                <span className="ml-4">Projects</span>
              </NavLink>
            </li>

            {/* <li className="relative px-6 py-3">
              <NavLink
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                to={"/timesheet"}
              >
                <CalendarClock className="w-5 h-4" />
                <span className="ml-4">Timesheets</span>
              </NavLink>
            </li> */}
             {(userInfo?.roleAccess === ADMIN || userInfo?.roleAccess === OPERATIONAL_DIRECTOR) && (
              <li className="relative px-6 py-3">
                <NavLink
                  className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                  to={"/projectrequests"}
                >
                  <CalendarClock className="w-5 h-4" />
                  <span className="ml-4">Project Requests</span>
                </NavLink>
              </li>
            )}
            <li className="relative px-6 py-3">
              <NavLink
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                to={"/timesheetlist"}
              >
                <CalendarClock className="w-5 h-4" />
                <span className="ml-4">Timesheet</span>
              </NavLink>
            </li>
            {userInfo?.roleAccess !== GENERAL && (
              <li className="relative px-6 py-3">
                <NavLink
                  className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                  to={"/requesttimesheet"}
                >
                  <CalendarClock className="w-5 h-4" />
                  <span className="ml-4">Timesheet Requests</span>
                </NavLink>
              </li>
            )}
            <li className="relative px-6 py-3">
              <NavLink
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                to={"/expensesheet"}
              >
                <BarChartHorizontal className="w-5 h-4" />
                <span className="ml-4">Expense Sheet</span>
              </NavLink>
            </li>
            {userInfo?.roleAccess !== GENERAL && (
              <li className="relative px-6 py-3">
                <NavLink
                  className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                  to={"/requestexpensesheet"}
                >
                  <CalendarClock className="w-5 h-4" />
                  <span className="ml-4">Expenses Requests</span>
                </NavLink>
              </li>
            )}
            {userInfo?.roleAccess !== GENERAL && (
              <li className="relative px-6 py-3">
                <NavLink
                  className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                  to={"/users"}
                >
                  <Users className="w-5 h-4" />
                  <span className="ml-4">Users</span>
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </aside>
      <Outlet />
    </>
  );
};

export default Sidebar;
