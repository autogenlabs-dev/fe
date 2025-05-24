import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { authSelector } from "@/redux/auth/authSlice";
import { getTimeSheet } from "@/redux/timesheet/timeSheetThunk";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../components/loader";
import TableWrapper from "@/components/Wrapper/TableWrapper";
import { useNavigate } from "react-router-dom";
import { timeSheetSelector } from "@/redux/timesheet/timeSheetSlice";
import { Dialog, DialogTrigger, DialogContent } from "@radix-ui/react-dialog"; // Using Radix UI Dialog for modal
import { DayPicker } from "react-day-picker"; // Import DayPicker
// import "react-day-picker/style.css"; // Import DayPicker CSS

const Timesheet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector(authSelector);
  const timeSheetData = useSelector(timeSheetSelector);
  const isLoading = useSelector((state) => state.timeSheetData.loading);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("All Week");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (userInfo && userInfo.access && userInfo.access.token) {
      const projectId = 6;
      dispatch(getTimeSheet({ projectId, date: selectedDate, token: userInfo.access.token }));
    }
  }, [userInfo, selectedDate]);

  const handleTabClick = (day) => {
    setActiveTab(day);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmitNewEntry = (event) => {
    event.preventDefault();
    // Logic to handle submission of new time entry
    closeModal();
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Time & Expenses</h1>
        <p className="text-sm mt-2">
          SHOWING <span className="text-[#002147] cursor-pointer">ALL ENTRIES</span> FOR THE WEEK OF <span className="text-[#002147]">SEPTEMBER 1, 2024</span> FOR <span className="text-[#002147] cursor-pointer">MYSELF</span>
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
        {/* Date and Search Inputs */}
        <div className="flex items-center gap-4">
          <input
            type="date"
            className="border p-2 rounded"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => handleDateChange(new Date(e.target.value))}
          />
          <div className="flex items-center border p-2 rounded">
            <input type="text" placeholder="Search" className="outline-none" />
            <button className="ml-2 text-gray-600 hover:text-black">
              🔍
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button className="text-[#002147]">previous week</Button>
          <Button className="text-[#002147]">next week</Button>
          <Button className="text-[#002147]">today</Button>
          <Button className="text-[#002147]">clear</Button>
          <Button className="text-[#002147]">advanced</Button>
        </div>
      </div>

      {/* Tabs for Weekdays */}
      <div className="flex border-b mb-4">
        {["All Week", "Sun (9/1)", "Mon (9/2)", "Tue (9/3)", "Wed (9/4)", "Thu (9/5)", "Fri (9/6)", "Sat (9/7)"].map((day, index) => (
          <Button
            key={index}
            className={`flex-1 p-2 ${
              activeTab === day ? "bg-[#002147] text-white" : "bg-gray-200"
            }`}
            onClick={() => handleTabClick(day)}
          >
            {day}
          </Button>
        ))}
      </div>

      <div className="flex justify-between mb-4">
        <div className="flex-1">
          {/* Placeholder for Graph */}
          <div className="bg-gray-200 h-32 w-full rounded"></div>
        </div>
        <div className="flex gap-2">
          <Button className="bg-[#002147] text-white">Add Time</Button>
          <Button className="bg-[#002147] text-white">Add Expense</Button>
          <Button className="bg-[#002147] text-white">Add Bulk Time</Button>
        </div>
      </div>

      {/* Timesheet Data Table */}
      <TableWrapper heading="">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            <Table className="pt-8">
              <TableHeader className="sticky top-0 bg-gray-200 ">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Matter</TableHead>
                  <TableHead>Private Description</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Labor (hrs)</TableHead>
                  <TableHead>Billable (hrs)</TableHead>
                  <TableHead>Total (hrs)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeSheetData && timeSheetData.timesheet && timeSheetData.timesheet.length > 0 ? (
                  timeSheetData.timesheet.map((timesheet, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(timesheet.date).toLocaleDateString()}</TableCell>
                      <TableCell>{timesheet.client}</TableCell>
                      <TableCell>{timesheet.matter}</TableCell>
                      <TableCell>{timesheet.privateDescription}</TableCell>
                      <TableCell>{timesheet.cost}</TableCell>
                      <TableCell>{timesheet.laborHours}</TableCell>
                      <TableCell>{timesheet.billableHours}</TableCell>
                      <TableCell>{timesheet.totalHours}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">No entries match this search. <span className="text-[#002147] cursor-pointer" onClick={openModal}>Create a new time entry?</span></TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {/* Day and Week Totals */}
            <div className="flex justify-between p-4 bg-gray-100">
              <div>Day Total:</div>
              <div>Week Total:</div>
            </div>
          </>
        )}
      </TableWrapper>

      {/* Modal for New Time Entry */}
      {showModal && (
        <Dialog open={showModal} onOpenChange={closeModal}>
          <DialogContent className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
            <h2 className="text-lg font-bold mb-4">New Time Entry</h2>
            <form onSubmit={handleSubmitNewEntry}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="client">Client</label>
                  <input type="text" id="client" className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label htmlFor="matter">Matter</label>
                  <input type="text" id="matter" className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label htmlFor="date">Date of Work</label>
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label htmlFor="startTime">Start Time</label>
                  <input type="time" id="startTime" className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label htmlFor="endTime">End Time</label>
                  <input type="time" id="endTime" className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label htmlFor="description">Private Description</label>
                  <textarea id="description" className="w-full border p-2 rounded"></textarea>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="bg-[#002147] text-white mr-2">Save</Button>
                <Button onClick={closeModal} className="bg-gray-400 text-white">Cancel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Timesheet;





















// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { NavLink } from "react-router-dom";
// import { authSelector } from "@/redux/auth/authSlice";
// import { getTimeSheet } from "@/redux/timesheet/timeSheetThunk";
// import { useSelector, useDispatch } from "react-redux";
// import { Badge } from "@/components/ui/badge";
// import Loader from "../components/loader";
// import TableWrapper from "@/components/Wrapper/TableWrapper";
// import { useNavigate } from "react-router-dom";
// import { timeSheetSelector } from "@/redux/timesheet/timeSheetSlice";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"

// const Timesheet = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { userInfo } = useSelector(authSelector);
//   const timeSheetData = useSelector(timeSheetSelector);
//   const isLoading = useSelector((state) => state.timeSheetData.loading);

//   useEffect(() => {
//     if (userInfo && userInfo.access && userInfo.access.token) {
//       const projectId = 6;
//       const date = new Date();
//       dispatch(getTimeSheet({ projectId, date, token: userInfo.access.token }));
//     }
//   }, [userInfo]);

//   return (
//     <TableWrapper heading={"Timesheets"}>
//       {isLoading ? (
//         <div className="flex justify-center items-center">
//           <Loader />
//         </div>
//       ) : (
//         <>
//           {timeSheetData &&
//           timeSheetData.timesheet &&
//           timeSheetData.timesheet.length > 0 ? (
//             <Table className="pt-8">
//               <TableHeader className="sticky top-0 bg-gray-200 ">
//                 <TableRow>
//                   <TableHead className="bg-gray-100">Project Manager</TableHead>
//                   <TableHead className="bg-gray-100">Project Name</TableHead>
//                   <TableHead className="bg-gray-100">
//                     Total Hours Requested
//                   </TableHead>
//                   <TableHead className="bg-gray-100">Overtime</TableHead>
//                   <TableHead className="bg-gray-100">
//                     Expense Requested
//                   </TableHead>
//                   <TableHead className="bg-gray-100">Status</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {timeSheetData.timesheet.map((timesheet, index) => (
//                   <TableRow
//                     key={index}
//                     onClick={() => {
//                       if (
//                         !timesheet?.approvalStatus ||
//                         timesheet.approvalStatus === "notsubmitted"
//                       )
//                         navigate(
//                           `/timesheetdetails/${timesheet.projectId}?date=${timesheet.weekStart}`
//                         );
//                     }}
//                     className="cursor-pointer"
//                   >
//                     <TableCell>{timesheet.projectManager}</TableCell>
//                     <TableCell>{timesheet.projectName}</TableCell>
//                     <TableCell className="text-[#9333EA]">
//                       <Badge
//                         className={
//                           "bg-opacity-100 bg-[#F3F1FEFF] text-[#927AF4FF] w-full sm:px-8 md:px-6 lg:px-4 xl:px-1 p-1 flex justify-center items-center rounded-2xl hover:bg-[#9333EA] hover:text-white"
//                         }
//                       >
//                         {" "}
//                         {`${timesheet.time} Hours`}
//                         <span className="pl-1 "></span>
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="text-[#9333EA]">
//                       <Badge
//                         className={
//                           "bg-opacity-100 bg-[#F3F1FEFF] text-[#927AF4FF] w-full sm:px-8 md:px-6 lg:px-4 xl:px-1 p-1 flex justify-center items-center rounded-2xl hover:bg-[#9333EA] hover:text-white"
//                         }
//                       >
//                         {" "}
//                         {timesheet.overTime > 0
//                           ? `${timesheet.overTime} Hours`
//                           : `0 Hours`}
//                         <span className="pl-1 "></span>
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       <Badge
//                         className={
//                           "bg-opacity-100 bg-[#F3F1FEFF] text-[#927AF4FF] w-full sm:w-[90%] md:w-[90%] lg:w-[80%] xl:w-[60%] max-w-[90%] p-1 flex justify-center items-center rounded-2xl hover:bg-[#9333EA] hover:text-white"
//                         }
//                       >
//                         £0
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="text-[#9333EA]">
//                       <Popover>
//                         <PopoverTrigger asChild>
//                           <Button
//                             variant="outline"
//                             className={`rounded-2xl p-1 h-auto px-4 border-0 hover:text-white ${
//                               !timesheet?.approvalStatus ||
//                               timesheet.approvalStatus === "notsubmitted"
//                                 ? "text-[#6DA5B8] bg-[#F2FAFD] hover:bg-[#6DA5B8]"
//                                 : timesheet.approvalStatus === "submitted"
//                                 ? "text-[#6DA5B8] bg-[#F2FAFD] hover:bg-[#6DA5B8]"
//                                 : timesheet.approvalStatus === "approved"
//                                 ? "text-green-700 bg-green-200 hover:bg-green-700"
//                                 : "text-red-700 bg-red-200 hover:bg-red-700"
//                             }`}
//                           >
//                             {!timesheet?.approvalStatus ||
//                             timesheet.approvalStatus === "notsubmitted"
//                               ? "Not submitted"
//                               : timesheet.approvalStatus === "submitted"
//                               ? "Pending"
//                               : timesheet.approvalStatus === "approved"
//                               ? "Approved"
//                               : "Rejected"}
//                           </Button>
//                         </PopoverTrigger>
//                         {!timesheet?.approvalStatus ||
//                         timesheet.approvalStatus === "notsubmitted" ||
//                         timesheet.approvalStatus === "submitted" ? (
//                           <></>
//                         ) : (
//                           <PopoverContent className="w-40">
//                             <div className="grid gap-4 place-items-center">
//                               <div className="space-y-2 text-center">
//                                 <h4 className="font-medium leading-none ">
//                                   Comments
//                                 </h4>
//                                 <p className="text-sm text-muted-foreground">
//                                   {timesheet?.comments
//                                     ? timesheet.comments
//                                     : " No comments"}
//                                 </p>
//                               </div>
//                             </div>
//                           </PopoverContent>
//                         )}
//                       </Popover>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           ) : (
//             <p>No timesheets available.</p>
//           )}
//         </>
//       )}
//       <div className="flex justify-center">
//         <NavLink className="flex justify-center mt-10" to={"/createtimesheet"}>
//           <Button className="">Time Sheet Request</Button>
//         </NavLink>
//       </div>
//     </TableWrapper>
//   );
// };

// export default Timesheet;
