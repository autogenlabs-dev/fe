import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import RequestPopUp from "../components/RequestPopup/requestPopUp";
import WrapperComponent from "@/components/Wrapper/TableWrapper";
import { Badge } from "@/components/ui/badge";
import { useSelector, useDispatch } from "react-redux";
import { authSelector } from "@/redux/auth/authSlice";
import {
  addApprovalStatus,
  deleteTimeSheet,
  getRequestTimeSheet,
  getTimeSheet,
} from "@/redux/timesheet/timeSheetThunk";
import { requestSheetSelector, timeSheetSelector } from "@/redux/timesheet/timeSheetSlice";
import Loader from "../components/loader";
import {
  addDays,
  eachDayOfInterval,
  endOfWeek,
  startOfWeek,
  format,
  add,
} from "date-fns-v3";
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
import { ADMIN } from "@/constants";
import { Trash2 } from "lucide-react";
import DeleteModal from "@/components/RequestTimeSheet/DeleteModal";

const requestSheetDummyData = {
  timesheets: [
    {
      id: 1,
      userName: "John Doe",
      projectName: "Project Alpha",
      time: 40,
      weekStart: new Date("2024-09-01"),
      userId: 101,
      timesheets: [
        { date: new Date("2024-09-01"), time: 8 },
        { date: new Date("2024-09-02"), time: 8 },
        { date: new Date("2024-09-03"), time: 8 },
        { date: new Date("2024-09-04"), time: 8 },
        { date: new Date("2024-09-05"), time: 8 },
      ],
    },
    {
      id: 2,
      userName: "Jane Smith",
      projectName: "Project Beta",
      time: 35,
      weekStart: new Date("2024-09-01"),
      userId: 102,
      timesheets: [
        { date: new Date("2024-09-01"), time: 7 },
        { date: new Date("2024-09-02"), time: 7 },
        { date: new Date("2024-09-03"), time: 7 },
        { date: new Date("2024-09-04"), time: 7 },
        { date: new Date("2024-09-05"), time: 7 },
      ],
    },
    {
      id: 3,
      userName: "Alex Johnson",
      projectName: "Project Gamma",
      time: 45,
      weekStart: new Date("2024-09-01"),
      userId: 103,
      timesheets: [
        { date: new Date("2024-09-01"), time: 9 },
        { date: new Date("2024-09-02"), time: 9 },
        { date: new Date("2024-09-03"), time: 9 },
        { date: new Date("2024-09-04"), time: 9 },
        { date: new Date("2024-09-05"), time: 9 },
      ],
    },
    {
      id: 11,
      userName: "John Doe",
      projectName: "Project Mawhiba",
      time: 40,
      weekStart: new Date("2024-09-01"),
      userId: 101,
      timesheets: [
        { date: new Date("2024-09-01"), time: 8 },
        { date: new Date("2024-09-02"), time: 8 },
        { date: new Date("2024-09-03"), time: 8 },
        { date: new Date("2024-09-04"), time: 8 },
        { date: new Date("2024-09-05"), time: 8 },
      ],
    },
    {
      id: 21,
      userName: "Jane Smith",
      projectName: "Project FMS",
      time: 35,
      weekStart: new Date("2024-09-01"),
      userId: 102,
      timesheets: [
        { date: new Date("2024-09-01"), time: 7 },
        { date: new Date("2024-09-02"), time: 7 },
        { date: new Date("2024-09-03"), time: 7 },
        { date: new Date("2024-09-04"), time: 7 },
        { date: new Date("2024-09-05"), time: 7 },
      ],
    },
    {
      id: 32,
      userName: "Alex Johnson",
      projectName: "Project Az",
      time: 45,
      weekStart: new Date("2024-09-01"),
      userId: 103,
      timesheets: [
        { date: new Date("2024-09-01"), time: 9 },
        { date: new Date("2024-09-02"), time: 9 },
        { date: new Date("2024-09-03"), time: 9 },
        { date: new Date("2024-09-04"), time: 9 },
        { date: new Date("2024-09-05"), time: 9 },
      ],
    },
  ],
};

const RequestTimeSheet = () => {
  const { userInfo } = useSelector(authSelector);
  const dispatch = useDispatch();
  // let requestSheetData = useSelector(requestSheetSelector);
  let requestSheetData = useSelector(requestSheetSelector);
  const isLoading = useSelector((state) => state.timeSheetData.loading);

  // State for search, dropdown, pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState("All");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [timesheetToDelete, setTimesheetToDelete] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Max items per page
  const timeSheetData = useSelector(timeSheetSelector) || [];
  console.log(userInfo, " timesheetF===scacssajascnjnscjaa == ", timeSheetData);
  // const timeSheetFilteredData = (timeSheetData || [])?.filter(sheet => sheet.userId !== userInfo.id)
  const timeSheetFilteredData = Array.isArray(timeSheetData) ? 
          timeSheetData.filter(sheet => sheet.userId !== userInfo.id && sheet.approvalStatus === "submitted") : [];
  

  // if (requestSheetData?.timesheets) {
  //   requestSheetData = requestSheetDummyData;
  // }

  // console.log(requestSheetData, "===requestSheetDatarequestSheetData");
  

  const fetchingTimesheet = (newDate) => {
    // if (!newDate) newDate = selectedDate;
    
    // const startDate = getMondayOfWeek(newDate);
    // const endDate = getDateAfterOneWeek(startDate);
  
    // console.log(selectedDate, "===selectedDate+===selectedDate", startDate, " === end = ", endDate);
    
    setIsFetching(true);
  
    dispatch(getTimeSheet({ 
      projectId: null, 
      // date: startDate, 
      // endOfWeek: endDate, 
      token: userInfo.access?.token
    }))
      .unwrap()
      .then(res => {
        console.log(res, "==ascnsnajsnscascjncs");
        
        setIsFetching(false);
      })
      .catch(err => {
        setIsFetching(false);
      });
  };

  useEffect(()=>{
    fetchingTimesheet(new Date());
  }, [])

  useEffect(() => {
    if (userInfo && userInfo.access && userInfo.access.token) {
      dispatch(getRequestTimeSheet({ token: userInfo.access.token }));
    }
  }, [dispatch, userInfo]);

  const handleDelete = async () => {
    dispatch(
      deleteTimeSheet({ token: userInfo.access.token, body: { timesheet: timesheetToDelete } })
    );
    setShowDeleteModal(false);
  };

  const handleStatus = (status, timesheetId, userId, comments, projectName, projectId) => {
    const body = {
      timesheetId,
      userId,
      approvalStatus: status,
      comments,
      link: "/timesheetlist",
      projectName,
      projectId,
    };
    console.log(body, '=ancjanjsasa:bodddyyyy');
    
    dispatch(addApprovalStatus({ token: userInfo.access.token, body })).unwrap()
    .then(res => {
      // dispatch(getRequestTimeSheet({ token: userInfo.access.token }));
      fetchingTimesheet(new Date());
    })
    .catch(error => {})
  };

  const weekDates = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Filter timesheets based on search and dropdown
  const filteredTimesheets = timeSheetFilteredData?.filter((timesheet) => {
    const userName = timesheet?.project?.projectMember?.find(user => user?.memberId === timesheet?.userId)?.user?.name || '';
    const projectName = timesheet?.project?.projectname || ''; // Changed from projectName to projectname
    
    const matchesSearch = searchTerm?.length > 0 ? userName?.toLowerCase()?.includes(searchTerm.toLowerCase()) : true;
    const matchesProject = selectedProject === "All" || projectName === selectedProject;
    return matchesSearch && matchesProject;
  });

  // Get unique project names for dropdown
  const uniqueProjects = [...new Set(timeSheetFilteredData?.map(timesheet => timesheet?.project?.projectname).filter(Boolean))]; // Changed from projectName to projectname

  // Calculate pagination details
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTimesheets = filteredTimesheets?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((filteredTimesheets?.length || 0) / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // console.log(timeSheetFilteredData, "=akncasncnsjj:timeSheetFilteredData");
  

  return (
    <div className="w-full px-5 pt-6 ml-auto mr-auto">
      {/* Input and dropdown in a row */}
      <div className="flex items-center justify-end mb-4">
        <input
          type="text"
          placeholder="Search by user name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-52 mr-4 h-[37]"
        />
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-52"
        >
          <option value="All">All Projects</option>
          {uniqueProjects?.map((projectName, index) => (
            <option key={index} value={projectName}>
              {projectName}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <Loader />
        </div>
      ) : filteredTimesheets?.length > 0 ? (
        <>
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead className="bg-gray-100">User</TableHead>
                <TableHead className="bg-gray-100">Project Name</TableHead>
                <TableHead className="bg-gray-100">Total Hours Requested</TableHead>
                <TableHead className="bg-gray-100 min-w-[130px]">Week</TableHead>
                <TableHead className="bg-gray-100">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTimesheets?.map((timesheet) => (
                <TableRow key={timesheet.id}>
                  <TableCell>{timesheet?.project?.projectMember?.find(user => user?.memberId === timesheet?.userId)?.user?.name}</TableCell>
                  <TableCell>{timesheet?.project?.projectname}</TableCell> {/* Changed from projectName to projectname */}
                  <TableCell className="text-[#011c3b]">
                    <Badge
                      className={
                        " bg-opacity-100  bg-blue-100 text-[#002147] w-fit px-2 py-1 flex justify-center items-center rounded-2xl hover:bg-[#011c3b] hover:text-white"
                      }
                    >
                      {timesheet?.time}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {timesheet?.date ? (
                      `${format(new Date(timesheet.date), "LLL dd, y")} - ${format(
                        add(new Date(timesheet.date), { days: 6 }),
                        "LLL dd, y"
                      )}`
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <RequestPopUp
                      timesheetId={timesheet?.id}
                      userId={timesheet?.userId}
                      handleStatus={handleStatus}
                      projectName={timesheet?.project?.projectname} 
                      projectId={timesheet?.projectId}
                      approvalStatus={timesheet?.approvalStatus}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter></TableFooter>
          </Table>
        </>
      ) : (
        <div className="flex justify-center items-center h-[85vh] w-full">
          <h2 className="r">No timesheets requested.</h2>
        </div>
      )}

      {/* Custom Modal for Delete Confirmation */}
      {showDeleteModal && (
        <DeleteModal
          title="Are you sure you want to delete this timesheet?"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default RequestTimeSheet;









































// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import RequestPopUp from "../components/RequestPopup/requestPopUp";
// import WrapperComponent from "@/components/Wrapper/TableWrapper";
// import { Badge } from "@/components/ui/badge";
// import { useSelector, useDispatch } from "react-redux";
// import { authSelector } from "@/redux/auth/authSlice";
// import {
//   addApprovalStatus,
//   deleteTimeSheet,
//   getRequestTimeSheet,
//   getTimeSheet,
// } from "@/redux/timesheet/timeSheetThunk";
// import { requestSheetSelector, timeSheetSelector } from "@/redux/timesheet/timeSheetSlice";
// import Loader from "../components/loader";
// import {
//   addDays,
//   eachDayOfInterval,
//   endOfWeek,
//   startOfWeek,
//   format,
//   add,
// } from "date-fns-v3";
// import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
// import { ADMIN } from "@/constants";
// import { Trash2 } from "lucide-react";
// import DeleteModal from "@/components/RequestTimeSheet/DeleteModal";

// const requestSheetDummyData = {
//   timesheets: [
//     {
//       id: 1,
//       userName: "John Doe",
//       projectName: "Project Alpha",
//       time: 40,
//       weekStart: new Date("2024-09-01"),
//       userId: 101,
//       timesheets: [
//         { date: new Date("2024-09-01"), time: 8 },
//         { date: new Date("2024-09-02"), time: 8 },
//         { date: new Date("2024-09-03"), time: 8 },
//         { date: new Date("2024-09-04"), time: 8 },
//         { date: new Date("2024-09-05"), time: 8 },
//       ],
//     },
//     {
//       id: 2,
//       userName: "Jane Smith",
//       projectName: "Project Beta",
//       time: 35,
//       weekStart: new Date("2024-09-01"),
//       userId: 102,
//       timesheets: [
//         { date: new Date("2024-09-01"), time: 7 },
//         { date: new Date("2024-09-02"), time: 7 },
//         { date: new Date("2024-09-03"), time: 7 },
//         { date: new Date("2024-09-04"), time: 7 },
//         { date: new Date("2024-09-05"), time: 7 },
//       ],
//     },
//     {
//       id: 3,
//       userName: "Alex Johnson",
//       projectName: "Project Gamma",
//       time: 45,
//       weekStart: new Date("2024-09-01"),
//       userId: 103,
//       timesheets: [
//         { date: new Date("2024-09-01"), time: 9 },
//         { date: new Date("2024-09-02"), time: 9 },
//         { date: new Date("2024-09-03"), time: 9 },
//         { date: new Date("2024-09-04"), time: 9 },
//         { date: new Date("2024-09-05"), time: 9 },
//       ],
//     },
//     {
//       id: 11,
//       userName: "John Doe",
//       projectName: "Project Mawhiba",
//       time: 40,
//       weekStart: new Date("2024-09-01"),
//       userId: 101,
//       timesheets: [
//         { date: new Date("2024-09-01"), time: 8 },
//         { date: new Date("2024-09-02"), time: 8 },
//         { date: new Date("2024-09-03"), time: 8 },
//         { date: new Date("2024-09-04"), time: 8 },
//         { date: new Date("2024-09-05"), time: 8 },
//       ],
//     },
//     {
//       id: 21,
//       userName: "Jane Smith",
//       projectName: "Project FMS",
//       time: 35,
//       weekStart: new Date("2024-09-01"),
//       userId: 102,
//       timesheets: [
//         { date: new Date("2024-09-01"), time: 7 },
//         { date: new Date("2024-09-02"), time: 7 },
//         { date: new Date("2024-09-03"), time: 7 },
//         { date: new Date("2024-09-04"), time: 7 },
//         { date: new Date("2024-09-05"), time: 7 },
//       ],
//     },
//     {
//       id: 32,
//       userName: "Alex Johnson",
//       projectName: "Project Az",
//       time: 45,
//       weekStart: new Date("2024-09-01"),
//       userId: 103,
//       timesheets: [
//         { date: new Date("2024-09-01"), time: 9 },
//         { date: new Date("2024-09-02"), time: 9 },
//         { date: new Date("2024-09-03"), time: 9 },
//         { date: new Date("2024-09-04"), time: 9 },
//         { date: new Date("2024-09-05"), time: 9 },
//       ],
//     },
//   ],
// };

// const RequestTimeSheet = () => {
//   const { userInfo } = useSelector(authSelector);
//   const dispatch = useDispatch();
//   // let requestSheetData = useSelector(requestSheetSelector);
//   let requestSheetData = useSelector(requestSheetSelector);
//   const isLoading = useSelector((state) => state.timeSheetData.loading);

//   // State for search, dropdown, pagination
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedProject, setSelectedProject] = useState("All");
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [timesheetToDelete, setTimesheetToDelete] = useState(null);
//   const [isFetching, setIsFetching] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5; // Max items per page
//   const timeSheetData = useSelector(timeSheetSelector) || [];
//   const timeSheetFilteredData = timeSheetData?.filter(sheet => sheet.userId !== userInfo.id)

//   console.log(timeSheetFilteredData, " ===scacssajascnjnscjaa == ", timeSheetData);
  

//   if (requestSheetData?.timesheets) {
//     requestSheetData = requestSheetDummyData;
//   }

//   const fetchingTimesheet = (newDate) => {
//     // if (!newDate) newDate = selectedDate;
    
//     // const startDate = getMondayOfWeek(newDate);
//     // const endDate = getDateAfterOneWeek(startDate);
  
//     // console.log(selectedDate, "===selectedDate+===selectedDate", startDate, " === end = ", endDate);
    
//     setIsFetching(true);
  
//     dispatch(getTimeSheet({ 
//       projectId: null, 
//       // date: startDate, 
//       // endOfWeek: endDate, 
//       token: userInfo.access?.token
//     }))
//       .unwrap()
//       .then(res => {
//         console.log(res, "==ascnsnajsnscascjncs");
        
//         setIsFetching(false);
//       })
//       .catch(err => {
//         setIsFetching(false);
//       });
//   };

//   useEffect(()=>{
//     fetchingTimesheet(new Date());
//   }, [])

//   useEffect(() => {
//     if (userInfo && userInfo.access && userInfo.access.token) {
//       dispatch(getRequestTimeSheet({ token: userInfo.access.token }));
//     }
//   }, [dispatch, userInfo]);

//   const handleDelete = async () => {
//     dispatch(
//       deleteTimeSheet({ token: userInfo.access.token, body: { timesheet: timesheetToDelete } })
//     );
//     setShowDeleteModal(false);
//   };

//   const handleStatus = (status, timesheetId, userId, comments, projectName) => {
//     const body = {
//       timesheetId,
//       userId,
//       approvalStatus: status,
//       comments,
//       link: "/timesheetlist",
//       projectName,
//     };
//     dispatch(addApprovalStatus({ token: userInfo.access.token, body }));
//   };

//   const weekDates = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

//   // Filter timesheets based on search and dropdown
//   const filteredTimesheets = requestSheetData?.timesheets?.filter((timesheet) => {
//     const matchesSearch = searchTerm?.length > 0 ? timesheet?.userName?.toLowerCase()?.includes(searchTerm.toLowerCase()): true;
//     const matchesProject = selectedProject === "All" || timesheet.projectName === selectedProject;
//     return matchesSearch && matchesProject;
//   });

//   // Calculate pagination details
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentTimesheets = filteredTimesheets?.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil((filteredTimesheets?.length || 0) / itemsPerPage);

//   const nextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const prevPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   return (
//     <div className="w-full px-5 pt-6 ml-auto mr-auto">
//       {/* Input and dropdown in a row */}
//       <div className="flex items-center justify-end mb-4">
//         <input
//           type="text"
//           placeholder="Search by user name..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border border-gray-300 rounded px-4 py-2 w-52 mr-4 h-[37]"
//         />
//         <select
//           value={selectedProject}
//           onChange={(e) => setSelectedProject(e.target.value)}
//           className="border border-gray-300 rounded px-4 py-2 w-52"
//         >
//           <option value="All">All Projects</option>
//           {requestSheetData?.timesheets?.map((timesheet) => (
//             <option key={timesheet?.id} value={timesheet?.projectName}>
//               {timesheet?.projectName}
//             </option>
//           ))}
//         </select>
//       </div>

//       {isLoading ? (
//         <div className="flex justify-center items-center">
//           <Loader />
//         </div>
//       ) : currentTimesheets?.length > 0 ? (
//         <>
//           <Table className="">
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="bg-gray-100">User</TableHead>
//                 <TableHead className="bg-gray-100">Project Name</TableHead>
//                 <TableHead className="bg-gray-100">Total Hours Requested</TableHead>
//                 <TableHead className="bg-gray-100">Expense Requested</TableHead>
//                 <TableHead className="bg-gray-100 min-w-[130px]">Week</TableHead>
//                 <TableHead className="bg-gray-100">Status</TableHead>
//                 {userInfo?.roleAccess === ADMIN && (
//                   <TableHead className="bg-gray-100">Action</TableHead>
//                 )}
//                 {weekDates.map((day, index) => (
//                   <TableHead key={index} className="bg-gray-100 pr-12">
//                     {day}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {currentTimesheets?.map((timesheet) => (
//                 <TableRow key={timesheet.id}>
//                   <TableCell>{timesheet?.userName}</TableCell>
//                   <TableCell>{timesheet?.projectName}</TableCell>
//                   <TableCell className="text-[#011c3b]">
//                     <Badge
//                       className={
//                         " bg-opacity-100  bg-blue-100 text-[#002147] w-fit px-2 py-1 flex justify-center items-center rounded-2xl hover:bg-[#011c3b] hover:text-white"
//                       }
//                     >
//                       {" "}
//                       {timesheet?.time}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="text-[#011c3b]">
//                     <Badge
//                       className={
//                         " bg-opacity-100  bg-blue-100 text-[#002147] w-fit px-2 py-1 flex justify-center items-center rounded-2xl hover:bg-[#011c3b] hover:text-white"
//                       }
//                     >
//                       {" "}
//                       0
//                     </Badge>
//                   </TableCell>
//                   <TableCell>
//                     {`${format(timesheet?.weekStart, "LLL dd, y")} - ${format(
//                       add(timesheet?.weekStart, { days: 6 }),
//                       "LLL dd, y"
//                     )}`}
//                   </TableCell>
//                   <TableCell>
//                     <RequestPopUp
//                       timesheetId={timesheet?.id}
//                       userId={timesheet?.userId}
//                       handleStatus={handleStatus}
//                       projectName={timesheet?.projectName}
//                     />
//                   </TableCell>
//                   {userInfo?.roleAccess === ADMIN && (
//                     <TableCell>
//                       <div
//                         className="p-2 cursor-pointer"
//                         onClick={() => {
//                           setTimesheetToDelete(timesheet);
//                           setShowDeleteModal(true);
//                         }}
//                       >
//                         <Trash2 className="text-primary " size={22} />
//                       </div>
//                     </TableCell>
//                   )}
//                   {weekDates.map((date, index) => (
//                     <TableCell key={index}>
//                       <div>
//                         <div>
//                           {timesheet?.timesheets?.find(
//                             (day) => format(utcToZonedTime(day.date, "Etc/UTC"), "iiii") === date
//                           )?.time ?? 0}
//                         </div>
//                       </div>
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableBody>
//             <TableFooter></TableFooter>
//           </Table>

//           {/* Pagination Controls */}
//           <div className="flex justify-center items-center gap-4 mt-4">
//             <button
//               onClick={prevPage}
//               disabled={currentPage === 1}
//               className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <span>
//               Page {currentPage} of {totalPages}
//             </span>
//             <button
//               onClick={nextPage}
//               disabled={currentPage === totalPages}
//               className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </>
//       ) : (
//         <div className="flex justify-center items-center h-[85vh] w-full">
//           <h2 className="r">No timesheets requested.</h2>
//         </div>
//       )}

//       {/* Custom Modal for Delete Confirmation */}
//       {showDeleteModal && (
//         <DeleteModal
//           title="Are you sure you want to delete this timesheet?"
//           onConfirm={handleDelete}
//           onCancel={() => setShowDeleteModal(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default RequestTimeSheet;

































// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import RequestPopUp from "../components/RequestPopup/requestPopUp";
// import WrapperComponent from "@/components/Wrapper/TableWrapper";
// import { Badge } from "@/components/ui/badge";
// import { useSelector, useDispatch } from "react-redux";
// import { authSelector } from "@/redux/auth/authSlice";
// import {
//   addApprovalStatus,
//   deleteTimeSheet,
//   getRequestTimeSheet,
// } from "@/redux/timesheet/timeSheetThunk";
// import { requestSheetSelector } from "@/redux/timesheet/timeSheetSlice";
// import Loader from "../components/loader";
// import {
//   addDays,
//   eachDayOfInterval,
//   endOfWeek,
//   startOfWeek,
//   format,
//   add,
// } from "date-fns-v3";
// import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
// import { ADMIN } from "@/constants";
// import { Trash2 } from "lucide-react";
// import DeleteModal from "@/components/RequestTimeSheet/DeleteModal";
// // import CustomModal from "@/components/ui/CustomModal"; // Import the custom modal component

// const requestSheetDummyData = {
//   timesheets: [
//     {
//       id: 1,
//       userName: "John Doe",
//       projectName: "Project Alpha",
//       time: 40,
//       weekStart: new Date("2024-09-01"),
//       userId: 101,
//       timesheets: [
//         { date: new Date("2024-09-01"), time: 8 },
//         { date: new Date("2024-09-02"), time: 8 },
//         { date: new Date("2024-09-03"), time: 8 },
//         { date: new Date("2024-09-04"), time: 8 },
//         { date: new Date("2024-09-05"), time: 8 },
//       ],
//     },
//     {
//       id: 2,
//       userName: "Jane Smith",
//       projectName: "Project Beta",
//       time: 35,
//       weekStart: new Date("2024-09-01"),
//       userId: 102,
//       timesheets: [
//         { date: new Date("2024-09-01"), time: 7 },
//         { date: new Date("2024-09-02"), time: 7 },
//         { date: new Date("2024-09-03"), time: 7 },
//         { date: new Date("2024-09-04"), time: 7 },
//         { date: new Date("2024-09-05"), time: 7 },
//       ],
//     },
//     {
//       id: 3,
//       userName: "Alex Johnson",
//       projectName: "Project Gamma",
//       time: 45,
//       weekStart: new Date("2024-09-01"),
//       userId: 103,
//       timesheets: [
//         { date: new Date("2024-09-01"), time: 9 },
//         { date: new Date("2024-09-02"), time: 9 },
//         { date: new Date("2024-09-03"), time: 9 },
//         { date: new Date("2024-09-04"), time: 9 },
//         { date: new Date("2024-09-05"), time: 9 },
//       ],
//     },
//   ],
// };

// const RequestTimeSheet = () => {
//   const { userInfo } = useSelector(authSelector);
//   const dispatch = useDispatch();
//   let requestSheetData = useSelector(requestSheetSelector);
//   const isLoading = useSelector((state) => state.timeSheetData.loading);

//   // State for search and dropdown
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedProject, setSelectedProject] = useState("All");

//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [timesheetToDelete, setTimesheetToDelete] = useState(null);

//   if (requestSheetData?.timesheets) {
//     requestSheetData = requestSheetDummyData;
//   }

//   useEffect(() => {
//     if (userInfo && userInfo.access && userInfo.access.token) {
//       dispatch(getRequestTimeSheet({ token: userInfo.access.token }));
//     }
//   }, [dispatch, userInfo]);

//   const handleDelete = async () => {
//     dispatch(
//       deleteTimeSheet({ token: userInfo.access.token, body: { timesheet: timesheetToDelete } })
//     );
//     setShowDeleteModal(false);
//   };

//   const handleStatus = (status, timesheetId, userId, comments, projectName) => {
//     const body = {
//       timesheetId,
//       userId,
//       approvalStatus: status,
//       comments,
//       link: "/timesheetlist",
//       projectName,
//     };
//     dispatch(addApprovalStatus({ token: userInfo.access.token, body }));
//   };

//   const weekDates = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

//   // Filter timesheets based on search and dropdown
//   const filteredTimesheets = requestSheetData?.timesheets?.filter((timesheet) => {
//     const matchesSearch = timesheet.projectName.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesProject = selectedProject === "All" || timesheet.projectName === selectedProject;
//     return matchesSearch && matchesProject;
//   });

//   return (
//     <div className="w-full px-5 pt-6 ml-auto mr-auto">
//       {/* Input and dropdown in a row */}
//       <div className="flex items-center justify-end mb-4">
//         <input
//           type="text"
//           placeholder="Search by project name..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border border-gray-300 rounded px-4 py-2 w-52 mr-4"
//         />
//         <select
//           value={selectedProject}
//           onChange={(e) => setSelectedProject(e.target.value)}
//           className="border border-gray-300 rounded px-4 py-2 w-52"
//         >
//           <option value="All">All Projects</option>
//           {requestSheetData.timesheets.map((timesheet) => (
//             <option key={timesheet.id} value={timesheet.projectName}>
//               {timesheet.projectName}
//             </option>
//           ))}
//         </select>
//       </div>

//       {isLoading ? (
//         <div className="flex justify-center items-center">
//           <Loader />
//         </div>
//       ) : filteredTimesheets.length > 0 ? (
//         <Table className="">
//           <TableHeader>
//             <TableRow>
//               <TableHead className="bg-gray-100">User</TableHead>
//               <TableHead className="bg-gray-100">Project Name</TableHead>
//               <TableHead className="bg-gray-100">Total Hours Requested</TableHead>
//               <TableHead className="bg-gray-100">Expense Requested</TableHead>
//               <TableHead className="bg-gray-100 min-w-[130px]">Week</TableHead>
//               <TableHead className="bg-gray-100">Status</TableHead>
//               {userInfo?.roleAccess === ADMIN && (
//                 <TableHead className="bg-gray-100">Action</TableHead>
//               )}
//               {weekDates.map((day, index) => (
//                 <TableHead key={index} className="bg-gray-100 pr-12">
//                   {day}
//                 </TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredTimesheets.map((timesheet) => (
//               <TableRow key={timesheet.id}>
//                 <TableCell>{timesheet.userName}</TableCell>
//                 <TableCell>{timesheet.projectName}</TableCell>
//                 <TableCell className="text-[#011c3b]">
//                   <Badge
//                     className={
//                       " bg-opacity-100  bg-blue-100 text-[#002147] w-fit px-2 py-1 flex justify-center items-center rounded-2xl hover:bg-[#011c3b] hover:text-white"
//                     }
//                   >
//                     {" "}
//                     {timesheet.time}
//                   </Badge>
//                 </TableCell>
//                 <TableCell className="text-[#011c3b]">
//                   <Badge
//                     className={
//                       " bg-opacity-100  bg-blue-100 text-[#002147] w-fit px-2 py-1 flex justify-center items-center rounded-2xl hover:bg-[#011c3b] hover:text-white"
//                     }
//                   >
//                     {" "}
//                     0
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   {`${format(timesheet.weekStart, "LLL dd, y")} - ${format(
//                     add(timesheet.weekStart, { days: 6 }),
//                     "LLL dd, y"
//                   )}`}
//                 </TableCell>
//                 <TableCell>
//                   {" "}
//                   <RequestPopUp
//                     timesheetId={timesheet.id}
//                     userId={timesheet.userId}
//                     handleStatus={handleStatus}
//                     projectName={timesheet.projectName}
//                   />
//                 </TableCell>
//                 {userInfo?.roleAccess === ADMIN && (
//                   <TableCell>
//                     <div
//                       className="p-2 cursor-pointer"
//                       onClick={() => {
//                         setTimesheetToDelete(timesheet);
//                         setShowDeleteModal(true);
//                       }}
//                     >
//                       <Trash2 className="text-primary " size={22} />
//                     </div>
//                   </TableCell>
//                 )}
//                 {weekDates.map((date, index) => (
//                   <TableCell key={index}>
//                     <div>
//                       <div>
//                         {timesheet.timesheets.find(
//                           (day) =>
//                             format(utcToZonedTime(day.date, "Etc/UTC"), "iiii") === date
//                         )?.time ?? 0}
//                       </div>
//                     </div>
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//           <TableFooter></TableFooter>
//         </Table>
//       ) : (
//         <div className="flex justify-center items-center h-[85vh] w-full">
//           <h2 className="r">No timesheets requested.</h2>
//         </div>
//       )}

//       {/* Custom Modal for Delete Confirmation */}
//       {showDeleteModal && (
//         <DeleteModal
//           title="Are you sure you want to delete this timesheet?"
//           onConfirm={handleDelete}
//           onCancel={() => setShowDeleteModal(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default RequestTimeSheet;

































// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import RequestPopUp from "../components/RequestPopup/requestPopUp";
// import WrapperComponent from "@/components/Wrapper/TableWrapper";
// import { Badge } from "@/components/ui/badge";
// import { useSelector, useDispatch } from "react-redux";
// import { authSelector } from "@/redux/auth/authSlice";
// import {
//   addApprovalStatus,
//   deleteTimeSheet,
//   getRequestTimeSheet,
// } from "@/redux/timesheet/timeSheetThunk";
// import { requestSheetSelector } from "@/redux/timesheet/timeSheetSlice";
// import Loader from "../components/loader";
// import {
//   addDays,
//   eachDayOfInterval,
//   endOfWeek,
//   startOfWeek,
//   format,
//   add,
// } from "date-fns-v3";
// import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
// import { ADMIN } from "@/constants";
// import { Trash2 } from "lucide-react";
// import DeleteModal from "@/components/RequestTimeSheet/DeleteModal";
// // import CustomModal from "@/components/ui/CustomModal"; // Import the custom modal component

// const requestSheetDummyData = {
//   timesheets: [
//     {
//       id: 1,
//       userName: "John Doe",
//       projectName: "Project Alpha",
//       time: 40,
//       weekStart: new Date("2024-09-01"),
//       userId: 101,
//       timesheets: [
//         { date: new Date("2024-09-01"), time: 8 },
//         { date: new Date("2024-09-02"), time: 8 },
//         { date: new Date("2024-09-03"), time: 8 },
//         { date: new Date("2024-09-04"), time: 8 },
//         { date: new Date("2024-09-05"), time: 8 },
//       ],
//     },
//     {
//       id: 2,
//       userName: "Jane Smith",
//       projectName: "Project Beta",
//       time: 35,
//       weekStart: new Date("2024-09-01"),
//       userId: 102,
//       timesheets: [
//         { date: new Date("2024-09-01"), time: 7 },
//         { date: new Date("2024-09-02"), time: 7 },
//         { date: new Date("2024-09-03"), time: 7 },
//         { date: new Date("2024-09-04"), time: 7 },
//         { date: new Date("2024-09-05"), time: 7 },
//       ],
//     },
//     {
//       id: 3,
//       userName: "Alex Johnson",
//       projectName: "Project Gamma",
//       time: 45,
//       weekStart: new Date("2024-09-01"),
//       userId: 103,
//       timesheets: [
//         { date: new Date("2024-09-01"), time: 9 },
//         { date: new Date("2024-09-02"), time: 9 },
//         { date: new Date("2024-09-03"), time: 9 },
//         { date: new Date("2024-09-04"), time: 9 },
//         { date: new Date("2024-09-05"), time: 9 },
//       ],
//     },
//   ],
// };

// const RequestTimeSheet = () => {
//   const { userInfo } = useSelector(authSelector);
//   const dispatch = useDispatch();
//   let requestSheetData = useSelector(requestSheetSelector);
//   const isLoading = useSelector((state) => state.timeSheetData.loading);

//   // State for search and dropdown
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedProject, setSelectedProject] = useState("All");

//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [timesheetToDelete, setTimesheetToDelete] = useState(null);

//   if (requestSheetData?.timesheets) {
//     requestSheetData = requestSheetDummyData;
//   }

//   useEffect(() => {
//     if (userInfo && userInfo.access && userInfo.access.token) {
//       dispatch(getRequestTimeSheet({ token: userInfo.access.token }));
//     }
//   }, [dispatch, userInfo]);

//   const handleDelete = async () => {
//     dispatch(
//       deleteTimeSheet({ token: userInfo.access.token, body: { timesheet: timesheetToDelete } })
//     );
//     setShowDeleteModal(false);
//   };

//   const handleStatus = (status, timesheetId, userId, comments, projectName) => {
//     const body = {
//       timesheetId,
//       userId,
//       approvalStatus: status,
//       comments,
//       link: "/timesheetlist",
//       projectName,
//     };
//     dispatch(addApprovalStatus({ token: userInfo.access.token, body }));
//   };

//   const weekDates = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

//   // Filter timesheets based on search and dropdown
//   const filteredTimesheets = requestSheetData?.timesheets?.filter((timesheet) => {
//     const matchesSearch = timesheet.projectName.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesProject = selectedProject === "All" || timesheet.projectName === selectedProject;
//     return matchesSearch && matchesProject;
//   });

//   return (
//     <div className="w-full px-5 pt-6 ml-auto mr-auto">
//       {/* Input and dropdown in a row */}
//       <div className="flex items-center justify-end mb-4">
//         <input
//           type="text"
//           placeholder="Search by project name..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border border-gray-300 rounded px-4 py-2 w-52 mr-4"
//         />
//         <select
//           value={selectedProject}
//           onChange={(e) => setSelectedProject(e.target.value)}
//           className="border border-gray-300 rounded px-4 py-2 w-52"
//         >
//           <option value="All">All Projects</option>
//           {requestSheetData.timesheets.map((timesheet) => (
//             <option key={timesheet.id} value={timesheet.projectName}>
//               {timesheet.projectName}
//             </option>
//           ))}
//         </select>
//       </div>

//       {isLoading ? (
//         <div className="flex justify-center items-center">
//           <Loader />
//         </div>
//       ) : filteredTimesheets.length > 0 ? (
//         <Table className="">
//           <TableHeader>
//             <TableRow>
//               <TableHead className="bg-gray-100">User</TableHead>
//               <TableHead className="bg-gray-100">Project Name</TableHead>
//               <TableHead className="bg-gray-100">Total Hours Requested</TableHead>
//               <TableHead className="bg-gray-100">Expense Requested</TableHead>
//               <TableHead className="bg-gray-100 min-w-[130px]">Week</TableHead>
//               <TableHead className="bg-gray-100">Status</TableHead>
//               {userInfo?.roleAccess === ADMIN && (
//                 <TableHead className="bg-gray-100">Action</TableHead>
//               )}
//               {weekDates.map((day, index) => (
//                 <TableHead key={index} className="bg-gray-100 pr-12">
//                   {day}
//                 </TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredTimesheets.map((timesheet) => (
//               <TableRow key={timesheet.id}>
//                 <TableCell>{timesheet.userName}</TableCell>
//                 <TableCell>{timesheet.projectName}</TableCell>
//                 <TableCell className="text-[#011c3b]">
//                   <Badge
//                     className={
//                       " bg-opacity-100  bg-blue-100 text-[#002147] w-fit px-2 py-1 flex justify-center items-center rounded-2xl hover:bg-[#011c3b] hover:text-white"
//                     }
//                   >
//                     {" "}
//                     {timesheet.time}
//                   </Badge>
//                 </TableCell>
//                 <TableCell className="text-[#011c3b]">
//                   <Badge
//                     className={
//                       " bg-opacity-100  bg-blue-100 text-[#002147] w-fit px-2 py-1 flex justify-center items-center rounded-2xl hover:bg-[#011c3b] hover:text-white"
//                     }
//                   >
//                     {" "}
//                     0
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   {`${format(timesheet.weekStart, "LLL dd, y")} - ${format(
//                     add(timesheet.weekStart, { days: 6 }),
//                     "LLL dd, y"
//                   )}`}
//                 </TableCell>
//                 <TableCell>
//                   {" "}
//                   <RequestPopUp
//                     timesheetId={timesheet.id}
//                     userId={timesheet.userId}
//                     handleStatus={handleStatus}
//                     projectName={timesheet.projectName}
//                   />
//                 </TableCell>
//                 {userInfo?.roleAccess === ADMIN && (
//                   <TableCell>
//                     <div
//                       className="p-2 cursor-pointer"
//                       onClick={() => {
//                         setTimesheetToDelete(timesheet);
//                         setShowDeleteModal(true);
//                       }}
//                     >
//                       <Trash2 className="text-primary " size={22} />
//                     </div>
//                   </TableCell>
//                 )}
//                 {weekDates.map((date, index) => (
//                   <TableCell key={index}>
//                     <div>
//                       <div>
//                         {timesheet.timesheets.find(
//                           (day) =>
//                             format(utcToZonedTime(day.date, "Etc/UTC"), "iiii") === date
//                         )?.time ?? 0}
//                       </div>
//                     </div>
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//           <TableFooter></TableFooter>
//         </Table>
//       ) : (
//         <div className="flex justify-center items-center h-[85vh] w-full">
//           <h2 className="r">No timesheets requested.</h2>
//         </div>
//       )}

//       {/* Custom Modal for Delete Confirmation */}
//       {showDeleteModal && (
//         <DeleteModal
//           title="Are you sure you want to delete this timesheet?"
//           onConfirm={handleDelete}
//           onCancel={() => setShowDeleteModal(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default RequestTimeSheet;

































// import React, { useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import RequestPopUp from "../components/RequestPopup/requestPopUp";
// import WrapperComponent from "@/components/Wrapper/TableWrapper";
// import { Badge } from "@/components/ui/badge";
// import { useSelector, useDispatch } from "react-redux";
// import { authSelector } from "@/redux/auth/authSlice";
// import {
//   addApprovalStatus,
//   deleteTimeSheet,
//   getRequestTimeSheet,
// } from "@/redux/timesheet/timeSheetThunk";
// import { requestSheetSelector } from "@/redux/timesheet/timeSheetSlice";
// import Loader from "../components/loader";
// import {
//   addDays,
//   eachDayOfInterval,
//   endOfWeek,
//   startOfWeek,
//   format,
//   formatISO,
//   add,
// } from "date-fns-v3";
// import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
// import { ADMIN } from "@/constants";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogClose,
// } from "@/components/ui/dialog";
// import { Trash2 } from "lucide-react";

// const requestSheetDummyData = {
//   timesheets: [
//     {
//       id: 1,
//       userName: "John Doe",
//       projectName: "Project Alpha",
//       time: 40, // Total hours requested
//       weekStart: new Date("2024-09-01"),
//       userId: 101,
//       timesheets: [
//         { date: new Date("2024-09-01"), time: 8 },
//         { date: new Date("2024-09-02"), time: 8 },
//         { date: new Date("2024-09-03"), time: 8 },
//         { date: new Date("2024-09-04"), time: 8 },
//         { date: new Date("2024-09-05"), time: 8 },
//       ],
//     },
//     {
//       id: 2,
//       userName: "Jane Smith",
//       projectName: "Project Beta",
//       time: 35, // Total hours requested
//       weekStart: new Date("2024-09-01"),
//       userId: 102,
//       timesheets: [
//         { date: new Date("2024-09-01"), time: 7 },
//         { date: new Date("2024-09-02"), time: 7 },
//         { date: new Date("2024-09-03"), time: 7 },
//         { date: new Date("2024-09-04"), time: 7 },
//         { date: new Date("2024-09-05"), time: 7 },
//       ],
//     },
//     {
//       id: 3,
//       userName: "Alex Johnson",
//       projectName: "Project Gamma",
//       time: 45, // Total hours requested
//       weekStart: new Date("2024-09-01"),
//       userId: 103,
//       timesheets: [
//         { date: new Date("2024-09-01"), time: 9 },
//         { date: new Date("2024-09-02"), time: 9 },
//         { date: new Date("2024-09-03"), time: 9 },
//         { date: new Date("2024-09-04"), time: 9 },
//         { date: new Date("2024-09-05"), time: 9 },
//       ],
//     },
//   ],
// };

// const RequestTimeSheet = () => {
//   const { userInfo } = useSelector(authSelector);
//   const dispatch = useDispatch();
//   let requestSheetData = useSelector(requestSheetSelector);
//   const isLoading = useSelector((state) => state.timeSheetData.loading);

//   if(requestSheetData?.timesheets){
//     requestSheetData = requestSheetDummyData
//   }

//   useEffect(() => {
//     if (userInfo && userInfo.access && userInfo.access.token) {
//       dispatch(getRequestTimeSheet({ token: userInfo.access.token }));
//     }
//   }, []);

//   const handleDelete = async (timesheet) => {
//     const body = {
//       timesheet,
//     };
//     dispatch(deleteTimeSheet({ token: userInfo.access.token, body }));
//   };

//   const handleStatus = (status, timesheetId, userId, comments, projectName) => {
//     const body = {
//       timesheetId,
//       userId,
//       approvalStatus: status,
//       comments,
//       link: "/timesheetlist",
//       projectName,
//     };
//     dispatch(addApprovalStatus({ token: userInfo.access.token, body }));
//   };

//   const weekDates = [
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//     "Sunday",
//   ];

//   return (
//     <div className="w-full px-5 pt-6 ml-auto mr-auto">
//       {isLoading ? (
//         <div className="flex justify-center items-center">
//           <Loader />
//         </div>
//       ) : requestSheetData &&
//         requestSheetData.timesheets &&
//         requestSheetData.timesheets.length > 0 ? (
//         <Table className="">
//           <TableHeader>
//             <TableRow>
//               <TableHead className="bg-gray-100">User</TableHead>
//               <TableHead className="bg-gray-100">Project Name</TableHead>
//               <TableHead className="bg-gray-100">
//                 Total Hours Requested
//               </TableHead>
//               <TableHead className="bg-gray-100">Expense Requested</TableHead>
//               <TableHead className="bg-gray-100 min-w-[130px]">
//                 Week
//               </TableHead>
//               <TableHead className="bg-gray-100">Status</TableHead>
//               {userInfo?.roleAccess === ADMIN && (
//                 <TableHead className="bg-gray-100">Action</TableHead>
//               )}
//               {weekDates.map((day, index) => (
//                 <TableHead key={index} className="bg-gray-100 pr-12">
//                   {day}
//                 </TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {requestSheetData.timesheets.map((timesheet) => (
//               <TableRow key={timesheet.id}>
//                 <TableCell>{timesheet.userName}</TableCell>
//                 <TableCell>{timesheet.projectName}</TableCell>
//                 <TableCell className="text-[#011c3b]">
//                   <Badge
//                     className={
//                       " bg-opacity-100  bg-blue-100 text-[#002147] w-fit px-2 py-1 flex justify-center items-center rounded-2xl hover:bg-[#011c3b] hover:text-white"
//                     }
//                   >
//                     {" "}
//                     {timesheet.time}
//                   </Badge>
//                 </TableCell>
//                 <TableCell className="text-[#011c3b]">
//                   <Badge
//                     className={
//                       " bg-opacity-100  bg-blue-100 text-[#002147] w-fit px-2 py-1 flex justify-center items-center rounded-2xl hover:bg-[#011c3b] hover:text-white"
//                     }
//                   >
//                     {" "}
//                     0
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   {`${format(timesheet.weekStart, "LLL dd, y")} - ${format(
//                     add(timesheet.weekStart, { days: 6 }),
//                     "LLL dd, y"
//                   )}`}
//                 </TableCell>
//                 <TableCell>
//                   {" "}
//                   <RequestPopUp
//                     timesheetId={timesheet.id}
//                     userId={timesheet.userId}
//                     handleStatus={handleStatus}
//                     projectName={timesheet.projectName}
//                   />
//                 </TableCell>
//                 {userInfo?.roleAccess === ADMIN && (
//                   <TableCell>
//                     <Dialog>
//                       <DialogTrigger asChild>
//                         <div
//                           className="p-2 cursor-pointer"
//                           onClick={(e) => e.stopPropagation()}
//                         >
//                           <Trash2 className="text-primary " size={22} />
//                         </div>
//                       </DialogTrigger>
//                       <DialogContent className="sm:max-w-[425px] z-[99999]">
//                         <DialogHeader>
//                           <DialogTitle>
//                             Are you sure you want to delete this timesheet?
//                           </DialogTitle>
//                         </DialogHeader>
//                         <DialogFooter className="pt-10">
//                           <DialogClose asChild>
//                             <Button
//                               type="button"
//                               className="text-white bg-[red] hover:bg-[red]"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleDelete(timesheet);
//                               }}
//                             >
//                               Yes
//                             </Button>
//                           </DialogClose>
//                           <DialogClose asChild>
//                             <Button
//                               type="button"
//                               className="text-[black] bg-[#E2E8F0] hover:bg-[#E2E8F0]"
//                               onClick={(e) => e.stopPropagation()}
//                             >
//                               No
//                             </Button>
//                           </DialogClose>
//                         </DialogFooter>
//                       </DialogContent>
//                     </Dialog>
//                   </TableCell>
//                 )}
//                 {weekDates.map((date, index) => (
//                   // map through the array of week dates and render a table cell for each date
//                   <TableCell key={index}>
//                     <div>
//                       <div>
//                         {timesheet.timesheets.find(
//                           (day) =>
//                             format(
//                               utcToZonedTime(day.date, "Etc/UTC"),
//                               "iiii"
//                             ) === date
//                         )?.time ?? 0}
//                       </div>
//                     </div>
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//           <TableFooter></TableFooter>
//         </Table>
//       ) : (
//         <div className="flex justify-center items-center h-[85vh] w-full">
//           <h2 className="r">No timesheets requested.</h2>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RequestTimeSheet;
