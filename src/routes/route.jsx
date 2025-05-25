import { Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import PrivateRoute from "./PrivateRoute";
import Createproject from "@/components/CreateProject/createProject";
import Forgetpassword from "@/pages/Forgetpassword";
import Confirmpassword from "@/pages/Confirmpassword";
import CreateUserForm from "@/components/CreateUser/CreateUserForm";
import User from "@/pages/User";
import EditUserForm from "@/components/EditUser/editUser";
import { Navigate } from "react-router-dom";
import Projects from "@/pages/Projects";
import EditProjectForm from "../components/EditProject/editProject";
import Timesheet from "@/pages/Timesheet";
import CreateSheetRequest from "@/components/AddTimeSheet/createSheetRequest";
import RequestTimeSheet from "@/pages/requestTimeSheet";
import ProjectDetails from "@/components/ProjectDetails/projectDetails";
import TimeSheetDetails from "@/components/TimeSheetDetails/timeSheetDetails";
import ExpenseSheet from "@/pages/ExpenseSheet";
import CreateExpenseSheet from "@/components/AddExpenseSheet/CreateExpenseSheet";
import TimesheetList from "@/components/TimesheetList/timesheetlist";
import ExpenseSheetDetails from "@/components/ExpenseSheetDetails/expenseSheetDetails";
import RequestExpenseSheet from "@/pages/requestExpenseSheet";
import ProjectRequests from "@/pages/projectRequests";
import Layout from "@/components/Layout/Index";
import { element } from "prop-types";
import BulkTimeEntries from "@/components/TimesheetList/BulkTimeEntries";
import ClientList from "@/pages/Client";
import AddClientForm from "@/pages/AddClientForm";
import OtpVerify from "@/pages/OtpVerify";
import ProjectTimesheetView from "@/components/ProjectTimesheetView/ProjectTimesheetView";
import UsersTimesheet from "@/components/UsersTimesheet/UsersTimesheet";


const private_route = [
  { id: 1, path: '/dashboard', element: <Dashboard /> },
  { id: 2, path: '/createproject', element: <Createproject /> },
  { id: 3, path: '/projects', element: <Projects /> },
  { id: 4, path: '/projectrequests', element: <ProjectRequests /> },
  { id: 5, path: '/users', element: <User /> },
  { id: 6, path: '/createuser', element: <CreateUserForm /> },
  { id: 7, path: '/users/:id', element: <CreateUserForm /> },
  { id: 8, path: '/projects/:id', element: <Createproject /> },
  { id: 9, path: '/timesheet', element: <Timesheet /> },
  { id: 10, path: '/createtimesheet', element: <CreateSheetRequest /> },
  { id: 11, path: "/requesttimesheet", element: <RequestTimeSheet /> },
  { id: 12, path: "/projectdetails/:id", element: <ProjectDetails /> },
  { id: 13, path: "timesheetdetails/:id", element: <TimeSheetDetails /> },
  { id: 14, path: "/expensesheet", element: <ExpenseSheet /> },
  { id: 15, path: "/createexpensesheet", element: <CreateExpenseSheet /> },
  { id: 16, path: "/timesheetlist", element: <TimesheetList /> },
  { id: 17, path: "/expensesheetdetails", element: <ExpenseSheetDetails/> },
  { id: 18, path: "/project-timesheet-view/:projectId", element: <ProjectTimesheetView /> },
  { id: 193, path: "/requestexpensesheet", element: <RequestExpenseSheet /> },
  { id: 192, path: "/bulk-time-entry", element: <BulkTimeEntries isFromDashboard={true} /> },  { id: 191, path: "/clients", element: <ClientList /> },
  { id: 190, path: "/add-client", element: <AddClientForm /> },
  { id: 189, path: "/edit-client/:clientId", element: <AddClientForm /> },
  { id: 188, path: "/users-timesheet", element: <UsersTimesheet /> },
  // { id: 119, path: "/verify-otp", element: <OtpVerify /> },
];

function MainRouter() {

  return (
    <Router>
      <Routes>
        <Route path="/confirm-password" element={<Confirmpassword />} />
        <Route path="/forget-password" element={<Forgetpassword />} />
        <Route path="/verify-otp" element={<OtpVerify />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        {private_route.map(({ id, path, element }) => <Route key={id} path={path} element={<PrivateRoute>{element}</PrivateRoute>} />)}
        {/* <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/createproject" element={<Layout><Createproject /></Layout>} />
          <Route path="/projects" element={<Layout><Projects /></Layout>} />
          <Route path="/projectrequests" element={<ProjectRequests />} />
          <Route path="/users" element={<Layout><User /></Layout>} />
          <Route path="/createuser" element={<Layout><CreateUserForm /></Layout>} />
          <Route path="/users/:id" element={<Layout><EditUserForm /></Layout>} />
          <Route path="/projects/:id" element={<Layout><EditProjectForm /></Layout>} />
          <Route path="timesheet" element={<Layout><Timesheet /></Layout>} />
          <Route path="/createtimesheet" element={<Layout><CreateSheetRequest /></Layout>} />
          <Route path="/requesttimesheet" element={<Layout><RequestTimeSheet /></Layout>} />
          <Route path="/projectdetails/:id" element={<Layout><ProjectDetails /></Layout>} />
          <Route path="timesheetdetails/:id" element={<Layout><TimeSheetDetails /></Layout>} />
          <Route path="expensesheet" element={<Layout><ExpenseSheet /></Layout>} />
          <Route path="/createexpensesheet" element={<Layout><CreateExpenseSheet /></Layout>} />
          <Route path="timesheetlist" element={<Layout><TimesheetList /></Layout>} />
          <Route path="expensesheetdetails" element={<Layout><ExpenseSheetDetails/></Layout>} />
          <Route path="/requestexpensesheet" element={<Layout><RequestExpenseSheet /></Layout>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route> */}
      </Routes>
    </Router>
  );
}

export default MainRouter;
