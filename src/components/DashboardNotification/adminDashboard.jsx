import React, { useEffect, useState } from "react";
import { BellRing, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loader";
import { authSelector } from "@/redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import NewExpenseEntry from "../TimesheetList/NewExpenseEntry";
import NewTimeEntry from "../TimesheetList/NewTimeEntry";
import DashboardChart from "../Charts/DashboardChart";
import RecentMatters from "../DashboardComponent/RecentMatter";
import ExpenseEntry from "../DashboardComponent/ExpenseEntry";
import TimeEntry from "../DashboardComponent/TimeEntry";
import QuickInsights from "../DashboardComponent/QuickInsights";
import { projectSelector } from "@/redux/project/projectSlice";
import { getMyProjects, getProjects } from "@/redux/project/projectThunk";
import { ADMIN, DIRECTOR, GENERAL, OPERATIONAL_DIRECTOR, PROJECT_MANAGER } from "@/constants";
import ProjectsOverview from "../DashboardComponent/ProjectsOverview";
import CreateExpenseSheet from "../AddExpenseSheet/CreateExpenseSheet";

const AdminDashboard = ({ notifications, loading, handleRefresh, removeNotification }) => {
  const [showTimeModal, setshowTimeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const { userInfo } = useSelector(authSelector);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(userInfo, "====scknajcnjancaa");
  const [liveProjects, setliveProjects] = useState(null);
  const [budget, setbudget] = useState(null);
  const [expenseBudget, setexpenseBudget] = useState(null);
  const [labourBudget, setlabourBudget] = useState(null);
  const [loadingQuick, setLoadingQuick] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState(null);
  
  const {
    projects,
    loading: projectLoading,
    error: userError,
  } = useSelector(projectSelector);

  if (loading) {
    return <Loader />;
  }

  const CHARTS = [
    { id: 1, title: "Billable Amount", data: [0, 20, 20, 10, 30, 50, 40], text: 'Billable Amount', },
    { id: 2, title: "Billable Hours", data: [0, 10, 10, 10, 30, 20, 30], text: 'Billable Hours', },
    { id: 3, title: "Labor Hours", data: [0, 20, 30, 40, 60, 40, 80], text: 'Labor Hours', },
  ]

  
  // useEffect(() => {
  //   setLoadingQuick(true);
  //   (userInfo?.roleAccess === DIRECTOR ||
  //     userInfo?.roleAccess === PROJECT_MANAGER ||
  //     userInfo?.roleAccess === GENERAL) &&
  //     dispatch(getMyProjects(userInfo?.access?.token));

  //   (userInfo?.roleAccess === ADMIN || userInfo?.roleAccess === OPERATIONAL_DIRECTOR) &&
  //     dispatch(getProjects(userInfo?.access?.token));
  //     setLoadingQuick(false);
  // }, []);

  useEffect(() => {
    if (
      userInfo?.roleAccess === DIRECTOR ||
      userInfo?.roleAccess === PROJECT_MANAGER ||
      userInfo?.roleAccess === GENERAL
    ) {
      dispatch(getMyProjects(userInfo?.access?.token));
    }
  
    if (
      userInfo?.roleAccess === ADMIN || 
      userInfo?.roleAccess === OPERATIONAL_DIRECTOR
    ) {
      dispatch(getProjects(userInfo?.access?.token));
    }
    
    setLoadingQuick(false);
  }, []);
  

  console.log(projects, "=ascknasccna");
  

  useEffect(() => {
    if (projects?.length > 0) {
      console.log(projects, "===projectsprojects");
      
      let tempProjectsNames = projects?.map((e) => {
        return { 
          projectName: e?.projectname, 
          projectId: e?.id, 
          total_fee: e.total_fee,
          multiplier: e.multiplier,
        };
      });
      setDropdownOptions(tempProjectsNames);
    }
    let liveProjects = projects?.filter((e) => e?.status === "inprogress");
    let totalBudget = liveProjects?.reduce((a, c) => a + c?.total_fee, 0);
    let totalLobourBudget = liveProjects?.reduce(
      (a, c) => a + c?.labour_budget,
      0
    );
    let totalExpenseBudget = liveProjects?.reduce((a, c) => a + c?.budget, 0);

    // console.log({ projects, liveProjects, totalBudget, totalLobourBudget, }, "acmkasakcsac:adminDashboard");
    

    setliveProjects(liveProjects?.length);
    setbudget(totalBudget);
    setexpenseBudget(totalExpenseBudget);
    setlabourBudget(totalLobourBudget);
  }, [projects]);


  return (
    <div className="w-full">
      <QuickInsights 
        projects={projects}
        liveProjects={liveProjects}
        budget={budget}
        expenseBudget={expenseBudget}
        labourBudget={labourBudget}
        loading={loadingQuick}
      />
      {userInfo?.roleAccess !== GENERAL && <ProjectsOverview dropdownOptions={dropdownOptions} />}
      {/* <div className="w-full flex justify-between">
        <span></span>
        <div className="flex gap-2">
          <NewTimeEntry open={showTimeModal} close={setshowTimeModal} type="tableBody">
            <Button className="bg-[#002147] hover:bg-[#002147] text-white" onClick={()=>setshowTimeModal(true)}>Add Time</Button>
          </NewTimeEntry>
          <NewExpenseEntry open={showExpenseModal} close={setShowExpenseModal}>
            <Button className="bg-[#002147] hover:bg-[#002147] text-white" onClick={()=>setShowExpenseModal(true)}>Add Expense</Button>
          </NewExpenseEntry>
          <Button className="bg-[#002147] hover:bg-[#002147] text-white" onClick={()=>navigate("/bulk-time-entry")}>Add Bulk Time</Button>
        </div>
      </div> */}
      <div className="flex flex-wrap gap-8 mt-3">
        {/* {CHARTS.map(chart => <DashboardChart key={chart.id} label={chart.title} data={chart.data} text={chart.text} />)} */}
        {userInfo?.roleAccess !== GENERAL && <DashboardChart projects={projects} />}
        <RecentMatters />
        {/* <ExpenseEntry /> */}
        <div className="w-[48%] border border-gray-300 rounded-lg pt-4">
          <CreateExpenseSheet className="" isNavigate={"no"} isShowSubmit={true} />
        </div>
        <div className="w-[48%] border border-gray-300 rounded-lg pt-4">
          {/* <TimeEntry /> */}
          <NewTimeEntry isDashboard={true} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
























// import React from "react";
// import { BellRing, X } from "lucide-react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import Loader from "@/components/loader";

// const AdminDashboard = ({ notifications, loading, handleRefresh, removeNotification }) => {
//   if (loading) {
//     return <Loader />;
//   }


//   return (
//     <div className="w-full">
//       <div className="overflow-auto max-h-[50vh]">
//         {notifications && notifications.length > 0 ? (
//           notifications.map((notification) => (
//             <div className="flex items-center pb-4" key={notification.id}>
//               <Link to={notification.link}>
//                 <h1 className="flex text-lg items-center">
//                   {notification.message}
//                   <BellRing className="ml-6 cursor-pointer" />
//                 </h1>
//               </Link>
//               <X
//                 size={20}
//                 className="ml-6 cursor-pointer"
//                 onClick={() => removeNotification(notification.id)}
//               />
//             </div>
//           ))
//         ) : (
//           <h1 className="flex text-lg">
//             No Notifications <BellRing className="ml-4 cursor-pointer" />
//           </h1>
//         )}
//       </div>
//       <Button className="mt-2 flex" onClick={handleRefresh}>
//         Refresh
//       </Button>
//     </div>
//   );
// };

// export default AdminDashboard;
