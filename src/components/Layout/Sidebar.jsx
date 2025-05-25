import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';
import { CalendarClock, Users, BarChartHorizontal, Plus, BetweenHorizontalStart } from 'lucide-react';
import { authSelector } from "@/redux/auth/authSlice";
import { useSelector } from "react-redux";
import { ADMIN, DIRECTOR, GENERAL, OPERATIONAL_DIRECTOR, PROJECT_MANAGER } from "@/constants";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { userInfo } = useSelector(authSelector);
  const location = useLocation();
  const pathname = location.pathname;
  console.log(pathname, "=====loc.pathhhhhh");

  return (
    <div className={`sidebar hide-scroll-bar ${isOpen ? 'open' : ''}`}>
      <div className="relative">
        {isOpen && <p onClick={toggleSidebar} className='absolute top-2 right-4 rotate-45 cursor-pointer'><Plus /></p>}
      </div>
      <ul className="mt-6">
        {/* Dashboard Link */}
        <li className="relative px-6 py-3">
          <NavLink
            exact="true"
            activeClassName="activeClass"
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${pathname === '/dashboard' ? "text-[#002147]": ""}`}
            to="/dashboard"
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
            {isOpen && <span className="ml-4">Dashboard</span>}
          </NavLink>
        </li>

        {/* Conditional Links based on user roles */}
        {(userInfo?.roleAccess === ADMIN ||
          userInfo?.roleAccess === OPERATIONAL_DIRECTOR ||
          userInfo?.roleAccess === DIRECTOR ||
          userInfo?.roleAccess === PROJECT_MANAGER) && (
          <li className="relative px-6 py-3">
            <NavLink
              exact="true"
              activeClassName="activeClass"
              title="View Create projects"
              className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${pathname === '/createproject' ? "text-[#002147]": ""}`}
              to="/createproject"
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
              {isOpen && <span className="ml-4">Create Project</span>}
            </NavLink>
          </li>
        )}

        {/* Projects Link */}
         <li className="relative px-6 py-3">
          <NavLink
            exact="true"
            activeClassName="activeClass"
            title="View Projects" // Add this line for hover text
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${pathname === '/projects' ? "text-[#002147]" : ""}`}
            to="/projects"
          >
            <BarChartHorizontal className="w-5 h-4" />
            {isOpen && <span className="ml-4">Projects</span>}
          </NavLink>
        </li>


        {/* Timesheet Link */}
        <li className="relative px-6 py-3">
          <NavLink
            exact="true"
            activeClassName="activeClass"
            title="View Timesheet" // Add this line for hover text
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${pathname === '/timesheetlist' ? "text-[#002147]": ""}`}
            to="/timesheetlist"
          >
            <CalendarClock className="w-5 h-4" />
            {isOpen && <span className="ml-4">Timesheet</span>}
          </NavLink>
        </li>

        {/* Project Requests (Admin Only) */}
        {(userInfo?.roleAccess === ADMIN || userInfo?.roleAccess === OPERATIONAL_DIRECTOR) && (
          <li className="relative px-6 py-3">
            <NavLink
              exact="true"
              title="View Project Requests" 
              activeClassName="activeClass"
              className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${pathname === '/projectrequests' ? "text-[#002147]": ""}`}
              to="/projectrequests"
            >
              <CalendarClock className="w-5 h-4" />
              {isOpen && <span className="ml-4">Project Requests</span>}
            </NavLink>
          </li>
        )}

        {/* Timesheet Requests (Non-General) */}
        {userInfo?.roleAccess !== GENERAL && (
          <li className="relative px-6 py-3">
            <NavLink
              exact="true"
              activeClassName="activeClass"
              title="View Timesheet Requests" 
              className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${pathname === '/requesttimesheet' ? "text-[#002147]": ""}`}
              to="/requesttimesheet"
            >
              <CalendarClock className="w-5 h-4" />
              {isOpen && <span className="ml-4">Timesheet Requests</span>}
            </NavLink>
          </li>
        )}

        {/* Expense Sheet Link */}
        <li className="relative px-6 py-3">
          <NavLink
            exact="true"
            activeClassName="activeClass"
            title="View Expense Sheet" 
            className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${pathname === '/expensesheet' ? "text-[#002147]": ""}`}
            to="/expensesheet"
          >
            <BarChartHorizontal className="w-5 h-4" />
            {isOpen && <span className="ml-4">Expense Sheet</span>}
          </NavLink>
        </li>

        {/* Expense Requests (Non-General) */}
        {userInfo?.roleAccess !== GENERAL && (
          <li className="relative px-6 py-3">
            <NavLink
              exact="true"
              activeClassName="activeClass"
              title="View Expenses Requests" 
              className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${pathname === '/requestexpensesheet' ? "text-[#002147]": ""}`}
              to="/requestexpensesheet"
            >
              <CalendarClock className="w-5 h-4" />
              {isOpen && <span className="ml-4">Expenses Requests</span>}
            </NavLink>
          </li>
        )}

        {/* Users Link (Non-General) */}
        {userInfo?.roleAccess !== GENERAL && (
          <li className="relative px-6 py-3">
            <NavLink
              exact="true"
              activeClassName="activeClass"
              title="View Users" 
              className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${pathname === '/users' ? "text-[#002147]": ""}`}
              to="/users"
            >
              <Users className="w-5 h-4" />
              {isOpen && <span className="ml-4">Users</span>}
            </NavLink>
          </li>
        )}
        {/*  */}
        {userInfo?.roleAccess !== GENERAL && (
          <li className="relative px-6 py-3">
            <NavLink
              exact="true"
              title="View Clients" 
              activeClassName="activeClass"
              className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${pathname === '/clients' ? "text-[#002147]": ""}`}
              to="/clients"
            >
              <BetweenHorizontalStart className="w-5 h-4" />
              {isOpen && <span className="ml-4">Clients</span>}
            </NavLink>
          </li>
        )}

        {/* Users Timesheet (Non-General) */}
        {userInfo?.roleAccess !== GENERAL && (
          <li className="relative px-6 py-3">
            <NavLink
              exact="true"
              title="View Users Timesheet" 
              activeClassName="activeClass"
              className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${pathname === '/users-timesheet' ? "text-[#002147]": ""}`}
              to="/users-timesheet"
            >
              <CalendarClock className="w-5 h-4" />
              {isOpen && <span className="ml-4">Users Timesheet</span>}
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;
























// import React from 'react';
// import PropTypes from 'prop-types';
// import { NavLink } from 'react-router-dom';
// import { CalendarClock, Users, BarChartHorizontal, Plus } from 'lucide-react';

// const Sidebar = ({ isOpen, toggleSidebar }) => {
//   return (
//     <div className={`sidebar ${isOpen ? 'open' : ''}`}>
//         <div className="relative">
//             {isOpen && <p onClick={toggleSidebar} className='absolute top-2 right-4 rotate-45 cursor-pointer'><Plus /></p>}
//         </div>
//       <ul className="mt-6">
//         {/* Dashboard Link */}
//         <li className="relative px-6 py-3">
//           <NavLink
//             exact="true"
//             activeClassName="activeClass"
//             className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
//             to="/dashboard"
//           >
//             <svg
//               className="w-5 h-5"
//               aria-hidden="true"
//               fill="none"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
//             </svg>
//             {isOpen && <span className="ml-4">Dashboard</span>}
//           </NavLink>
//         </li>

//         {/* Projects Link */}
//         <li className="relative px-6 py-3">
//           <NavLink
//             exact="true"
//             activeClassName="activeClass"
//             className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
//             to="/projects"
//           >
//             <BarChartHorizontal className="w-5 h-4" />
//             {isOpen && <span className="ml-4">Projects</span>}
//           </NavLink>
//         </li>

//         {/* Timesheet Link */}
//         <li className="relative px-6 py-3">
//           <NavLink
//             exact="true"
//             activeClassName="activeClass"
//             className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
//             to="/timesheetlist"
//           >
//             <CalendarClock className="w-5 h-4" />
//             {isOpen && <span className="ml-4">Timesheet</span>}
//           </NavLink>
//         </li>

//         {/* Users Link */}
//         <li className="relative px-6 py-3">
//           <NavLink
//             exact="true"
//             activeClassName="activeClass"
//             className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
//             to="/users"
//           >
//             <Users className="w-5 h-4" />
//             {isOpen && <span className="ml-4">Users</span>}
//           </NavLink>
//         </li>
        
//       </ul>
//     </div>
//   );
// };

// Sidebar.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   toggleSidebar: PropTypes.func.isRequired,
// };

// export default Sidebar;
