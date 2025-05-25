import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { authSelector } from "@/redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  eachDayOfInterval,
  endOfWeek,
  startOfWeek,
  format,
  addWeeks,
  subWeeks,
} from "date-fns-v3";
import axiosIns from "@/api/axios";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import BarChart from "../Charts/BarCharts";
import NewTimeEntry from "./NewTimeEntry";
import NewExpenseEntry from "./NewExpenseEntry";
import BulkTimeEntries from "./BulkTimeEntries";
// import logo from "@/assets/Logo_png.png";
import LogoImage from "../Layout/LogoImage";
import { getTimeSheet } from "@/redux/timesheet/timeSheetThunk";
import { timeSheetSelector } from "@/redux/timesheet/timeSheetSlice";
import TimeSheetDataModal from "./TimeSheetDataModal";
import Loader from "../loader";
import toastMessage from "@/lib/toastMessage";
// import { endOfWeek, startOfWeek } from "date-fns";
import { isToday } from "date-fns";
import { ADMIN, DIRECTOR, OPERATIONAL_DIRECTOR } from "@/constants";
import { Edit, Send } from "lucide-react"; // Add this import for the edit icon


const TimesheetList = () => {
  const dispatch = useDispatch()
  const [selectedWeek, setSelectedWeek] = useState({
    from: startOfWeek(new Date(), { weekStartsOn: 0 }), // Week starts on Sunday
    to: endOfWeek(new Date(), { weekStartsOn: 0 }),
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSheetList, setTimeSheetList] = useState({
    timesheet: [
      {
        projectId: 2,
        weekStart: "2024-09-08",
        time: 10,
        approvalStatus: "approved",
        projectName: "ABC",
        projectManager: "Rohit",
        cost: 1000,
        laborHours: 8,
        billableHours: 7,
        totalHours: 15,
        client: "Client A",
        matter: "Matter 1",
        privateDescription: "Private task",
      },
      // ... more timesheet data
    ],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [issFetching, setIsFetching] = useState(true);
  const [showTimeModal, setshowTimeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showBulkAddTime, setShowBulkAddTime] = useState(false);
  const [activeTab, setActiveTab] = useState("All Week");
  const [visibleColumns, setVisibleColumns] = useState([
    "Project Name",
    // "Date",
    "Approval Status",
    "Project Manager",
    // "Client",
    // "Matter",
    "Private Description",
    // "Cost",
    "Labor (hrs)",
    // "Billable (hrs)",
    "Total (hrs)",
  ]);
  const { userInfo } = useSelector(authSelector);
  const timeSheetData = useSelector(timeSheetSelector);
  const [timesheetFilterData, setTimeSheetFilterData] = useState([]);
  const timeSheetRef = useRef(timeSheetData);

  console.log(timesheetFilterData, "==timeSheetDatatimeSheetData", timeSheetData);
  console.log(userInfo, "===casjnjascnsaj");
  

  useEffect(()=>{
    setTimeSheetFilterData(timeSheetData);
    timeSheetRef.current = timeSheetData;
  }, [timeSheetData])


  // function getDateAfterOneWeek(inputDate) {
  //   // Convert the input to a Date object
  //   const date = new Date(inputDate);
  
  //   // Add 7 days to the date
  //   date.setDate(date.getDate() + 7);
  
  //   // Return the updated date
  //   return date;
  // }

  // function getMondayOfWeek(inputDate) {
  //   // Convert the input to a Date object
  //   const date = new Date(inputDate);
  
  //   // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  //   const dayOfWeek = date.getDay();
  
  //   // Calculate how many days to subtract to get to Monday (day 1)
  //   const daysToMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1); // Adjust if the day is Sunday (0), set to previous Monday
  
  //   // Set the date to the previous Monday
  //   date.setDate(date.getDate() - daysToMonday);
  
  //   // Return the Monday date
  //   return date;
  // }
  
  // const fetchingTimesheet = (newDate) => {
  //   if(!newDate) newDate = selectedDate
  //   const startDate = getMondayOfWeek(newDate);
  //   const endOfWeek = getDateAfterOneWeek(startDate);
  //   console.log(selectedDate, "===selectedDate+===selectedDate", startDate, " === end = ", endOfWeek);
  //   setIsFetching(true);
  //   dispatch(getTimeSheet({ 
  //     projectId: null, 
  //     date: startDate, 
  //     endOfWeek, token: userInfo.access?.token 
  //   })).unwrap().then(res => {
  //     setIsFetching(false);
  //   }).catch(err => {
  //     setIsFetching(false);
  //   })
  // }
  

  const isSameDate = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

function getDateAfterOneWeek(inputDate) {
  // Using date-fns to get the start and end of the week
  const date = new Date(inputDate);
  const startDate = startOfWeek(date, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(date, { weekStartsOn: 1 }); // Get the Sunday of the current week

  return endDate;
}

function getMondayOfWeek(inputDate) {
  const date = new Date(inputDate);
  return startOfWeek(date, { weekStartsOn: 1 }); // Ensure the week starts on Monday
}

const handleTabClick = (day) => {
  console.log("Selected day:", day);

  const key = day === "All Week" ? "All Week" : day.label;
  setActiveTab(key);

  if (day === "All Week") {
    // Show all data for the current week
    setTimeSheetFilterData(timeSheetRef.current);
  } else {
    // Filter data for the selected day
    const filterData = timeSheetRef.current?.filter((timesheet) => {
      // Convert both timesheet date and selected day to local date strings
      const timesheetDate = new Date(timesheet.date).toLocaleDateString('en-CA'); // Convert to local date in 'YYYY-MM-DD' format
      const selectedDay = new Date(day.value).toLocaleDateString('en-CA'); // Same format for comparison

      console.log(timesheet.date, "=== timesheet date;", timesheetDate);
      console.log(day.value, "=== selected day;", selectedDay);

      // Compare the dates without the time part
      return timesheetDate === selectedDay;
    });    setSelectedDate(new Date(day.value));
    console.log("TimesheetList: Setting selectedDate to:", new Date(day.value));
    setTimeSheetFilterData(filterData);
  }
};

const fetchingTimesheet = ({ newDate } = { }) => {
  console.log("calllllllllllllll");
  
  if (!newDate) newDate = selectedDate;
  
  const startDate = getMondayOfWeek(newDate);
  const endDate = getDateAfterOneWeek(startDate);
  
  console.log(selectedDate, "===selectedDate+===selectedDate", startDate, " === end = ", endDate);
  
  setIsFetching(true);

  dispatch(getTimeSheet({ 
    projectId: null, 
    date: startDate, 
    endOfWeek: endDate, 
    token: userInfo.access?.token 
  }))
    .unwrap()
    .then(res => {
      console.log(res, "==ascnsnajsnscascjncs");
      if(isSameDate(selectedDate, new Date())){
        handleTabClick("All Week");
      }
      else {
        handleTabClick({ value: selectedDate, label: activeTab });
      }
      setIsFetching(false);
    })
    .catch(err => {
      setIsFetching(false);
    });
};


  useEffect(()=>{
    console.log("acnancasnsancas:asa");
    // dispatch(getTimeSheet({ projectId: null, date: selectedDate, token: userInfo.access?.token }))
    fetchingTimesheet({ newDate: selectedDate });
  }, [])


  
  
  
  // const handleTabClick = (day) => {
  //   console.log("Selected day:", day);
    
  //   const key = day === "All Week" ? "All Week" : day.label;
  //   setActiveTab(key);
  
  //   if (day === "All Week") {
  //     // Show all data for the current week
  //     setTimeSheetFilterData(timeSheetData);
  //   } else {
      
  //     // Filter data for the selected day
  //     const filterData = timeSheetData?.filter((timesheet) => {
  //       // console.log(timesheet, "==timesheetttt1110001");
        
        
  //       const timesheetDate = new Date(timesheet.date).toISOString().split("T")[0]; // Get just the date part
  //       console.log(timesheet.date, "===ascjnancajnscjsans;;;, ", timesheetDate);
  //       const selectedDay = new Date(day.value).toISOString().split("T")[0]; // Get just the date part
  //       // const selectedDay = new Date(day.value);
  //       // selectedDay.setDate(selectedDay.getDate() - 1);
  //       // const formattedDate = selectedDay.toISOString().split("T")[0];
  //       // Compare dates ignoring the time part
  //       return timesheetDate === selectedDay;
  //     });
  
  //     setSelectedDate(new Date(day.value));
  //     setTimeSheetFilterData(filterData);
  //   }
  // };

  const handleColumnVisibilityChange = (column) => {
    setVisibleColumns((prevColumns) =>
      prevColumns.includes(column)
        ? prevColumns.filter((c) => c !== column)
        : [...prevColumns, column]
    );
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(new Date(newDate));
    setSelectedWeek({
      from: startOfWeek(new Date(newDate), { weekStartsOn: 0 }),
      to: endOfWeek(new Date(newDate), { weekStartsOn: 0 }),
    });
    // fetchingTimesheet(newDate)
    handleTabClick({ value: newDate, });
    setActiveTab(format(new Date(newDate), "EEE (M/d)"));
  };

  const handlePreviousWeek = () => {
    const newDate = subWeeks(selectedDate, 1);
    handleTabClick({ value: newDate, });
    handleDateChange(newDate);
  };

  const handleNextWeek = () => {
    const newDate = addWeeks(selectedDate, 1);
    handleDateChange(newDate);
  };

  const generateWeekDays = () => {
    return eachDayOfInterval({
      start: selectedWeek.from,
      end: selectedWeek.to,
    }).map((date) => ({
      label: `${format(date, "EEE")} (${format(date, "M/d")})`,
      value: date,
    }));
  };

  const dummyDataForCharts = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [3, 2, 5, 6, 4, 7, 1],
  };

  const handleModalNewTimeClose = (isFetch="") => {
    console.log(isFetch, "==acmakascjansnc:isFetchh");
    
    setshowTimeModal(false);
    if(isFetch == 'yes'){
      fetchingTimesheet({ newDate: selectedDate, isSetTab: true });
      setActiveTab("All Week");
      setSelectedDate(new Date());;
    }
  }
  
  const SubmitButtonInTable = ({ status, data }) => {
    const [isLoading1, setIsLoading1] = useState(false);
    const [showTimeModal1, setshowTimeModal1] = useState(false);
    // Track the current timesheet data for submission after save
    const [currentTimesheet, setCurrentTimesheet] = useState(data);
    
    // This function will be called when a timesheet is saved from the NewTimeEntry component
    const handleTimesheetSaved = (savedSheet) => {
      console.log("Received saved timesheet data:", savedSheet);
      
      // Directly capture the updated timesheet data
      if (savedSheet && savedSheet.updatedTimesheet) {
        console.log("Setting currentTimesheet to:", savedSheet.updatedTimesheet);
        setCurrentTimesheet(savedSheet.updatedTimesheet);
      }
    };
    
    const submitData = async () => {
      // Use the most up-to-date timesheet data
      const timesheetToSubmit = currentTimesheet;
      console.log("Submitting timesheet data:", timesheetToSubmit);
      
      // Ensure we have data to submit
      if (!timesheetToSubmit) {
        return toastMessage("You have not saved timesheet yet", "info");
      }
      
      // Prepare the timesheet with weekStart
      const weeklyTimesheet = {
        ...timesheetToSubmit,
        weekStart: getMondayOfWeek(timesheetToSubmit.date)
      };
      
      // Filter for valid submission status
      if (weeklyTimesheet.approvalStatus !== "notsubmitted" || weeklyTimesheet.time <= 0) {
        return toastMessage("No data to submit", 'info');
      }
      
      setIsLoading1(true);
      
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.access.token}`,
      };

      const body = {
        weeklyTimesheets: [weeklyTimesheet],
        link: "/timesheetlist",
      };
      
      console.log("Submitting with body:", body);
      
      try {
        await axiosIns.post(`/timesheet/submit/all`, body, { headers });
        fetchingTimesheet({ isSetTab: true });
        setIsLoading1(false);
        toastMessage("Timesheet data successfully submitted", "success");
        setshowTimeModal1(false);
      } catch (error) {
        console.error("Error submitting timesheet:", error);
        setIsLoading1(false);
        toastMessage("Error submitting timesheet", "error");
      }
    };

    // This function will be called ONLY when the X button or backdrop is clicked
    const handleModalClose = () => {
      setshowTimeModal1(false);
      // Refresh data without changing any other state
      fetchingTimesheet({});
    };
    
    // Update currentTimesheet when the passed data changes
    useEffect(() => {
      setCurrentTimesheet(data);
    }, [data]);
    
    return (
      <div className="flex items-center gap-2">
        {showTimeModal1 && (
          <div onClick={(e) => e.stopPropagation()}>
            <NewTimeEntry 
              getMondayOfWeek={getMondayOfWeek} 
              fetchingTimesheet={() => {}} // Don't refresh yet as we're keeping the modal open
              open={showTimeModal1} 
              close={handleModalClose} // Only called when X button is clicked
              type="tableBody" 
              dateOfWorkFromTimesheet={data.date}
              data={data}
              isEdit={true}
              onSave={handleTimesheetSaved} // Pass a callback to receive saved data
              preventAutoClose={true} // Add a prop to explicitly prevent auto-close on save
            />
          </div>
        )}
        
        {/* Edit button for the user's own timesheets */}
        {data.userId === userInfo?.id && (
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              // Initialize currentTimesheet with original data when opening
              setCurrentTimesheet(data);
              setshowTimeModal1(true);
            }}
            title="Edit time entry"
          >
            <Edit size={16} />
          </button>
        )}
        
        {/* Only show submit button for notsubmitted status */}
        {status === 'notsubmitted' && (
          <button 
            disabled={isLoading1} 
            className="bg-main hover:bg-main/90 text-white p-1.5 rounded flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              submitData();
            }}
            title="Submit time entry"
          >
            <Send size={16} />
            {isLoading1 && <Loader />}
          </button>
        )}
      </div>
    );
  }

  if (showBulkAddTime) return <BulkTimeEntries cancel={() => setShowBulkAddTime(false)} />;
  
  const total = timesheetFilterData?.filter(eachSheet => eachSheet.userId == userInfo.id)?.reduce((total, timesheet) => {
    return total + timesheet.time;
  }, 0)

  // const isShowSubmitBtn = userInfo?.roleAccess === ADMIN || 
  //                         userInfo?.roleAccess === OPERATIONAL_DIRECTOR ||
  //                         userInfo?.roleAccess === DIRECTOR
  

  return (
    <div className="px-8 py-6 bg-white min-h-screen">
      <LogoImage />
      {/* Header Section */}
      <div className="flex flex-col gap-2 md:gap-0 md:flex-row justify-between items-center mb-6 mt-3">
        <h1 className="text-2xl font-semibold">Time & Expenses</h1>
        <div className="flex gap-2">
          <NewTimeEntry 
            getMondayOfWeek={getMondayOfWeek} 
            fetchingTimesheet={()=> fetchingTimesheet({})} 
            open={showTimeModal} 
            close={handleModalNewTimeClose} 
            type="tableBody" 
            dateOfWorkFromTimesheet={selectedDate}
          >
            <Button
              className="bg-[#002147] hover:bg-[#002147] text-white"
              onClick={() => setshowTimeModal(true)}
            >
              Add Time
            </Button>
          </NewTimeEntry>
          {/* <NewExpenseEntry open={showExpenseModal} close={setShowExpenseModal}>
            <Button
              className="bg-[#002147] hover:bg-[#002147] text-white"
              onClick={() => setShowExpenseModal(true)}
            >
              Add Expense
            </Button>
          </NewExpenseEntry> */}
          {/* <Button
            className="bg-[#002147] hover:bg-[#002147] text-white"
            onClick={() => setShowBulkAddTime(true)}
          >
            Add Bulk Time
          </Button> */}
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col items-center md:flex-row  gap-4 mt-3">
        <div className="w-full md:w-1/2">
          <p className="uppercase mb-3">
            Showing all <b>entries</b> for the week of{" "}
            <b>{format(selectedWeek.from, "MMMM d, yyyy")}</b> for myself
          </p>
          <div className="flex items-center gap-4">
            <div className="w-1/2">
              <p>Date</p>
              <input
                type="date"
                className="border p-2 rounded w-full"
                value={format(selectedDate, "yyyy-MM-dd")}
                onChange={(e) => handleDateChange(e.target.value)}
              />
              <div className="flex gap-3 mt-1">
                <button
                  className="hover:underline text-[#002147] text-sm"
                  onClick={handlePreviousWeek}
                >
                  previous week
                </button>{" "}
                <span className="text-gray-400">|</span>
                <button
                  className="hover:underline text-[#002147] text-sm"
                  onClick={handleNextWeek}
                >
                  next week
                </button>
              </div>
            </div>
            {/* <div className="w-1/2">
              <p>Search</p>
              <div className="flex items-center justify-between border p-2 rounded">
                <input
                  type="text"
                  placeholder="Search"
                  className="outline-none"
                />
                <button className="mr-2 text-gray-600 hover:text-black">🔍</button>
              </div>
              <div className="flex gap-2 mt-1 justify-end">
                <button className="hover:underline text-[#002147] text-sm">
                  today
                </button>
                <span className="text-gray-400">|</span>
                <button className="hover:underline text-[#002147] text-sm">
                  clear
                </button>
                <span className="text-gray-400">|</span>
                <button className="hover:underline text-[#002147] text-sm">
                  advanced
                </button>
              </div>
            </div> */}
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="h-[220px] mr-4">
            <BarChart isAllWeek={activeTab === "All Week"} data={timesheetFilterData?.filter(eachSheet => eachSheet.userId == userInfo.id)} selectedDate={selectedDate} />
          </div>
        </div>
      </div>

      {/* Scrollable container for table and tabs */}
      {issFetching ? <Loader /> :
       <div className="w-full overflow-x-auto">
        <div className="flex justify-between border-b bg-gray-200 mt-5 pr-2 w-full min-w-[1000px]">
          <div className="flex gap-1">
            <button
              className={`flex w-[100px] p-2 text-center ${
                activeTab === "All Week" ? "bg-[#002147] text-white" : "bg-gray-200"
              }`}
              onClick={() => handleTabClick("All Week")}
            >
              All Week
            </button>
            {generateWeekDays().map((day, index) => (
              <button
                key={index}
                className={`flex w-[120px] p-2 text-center ${
                  activeTab === day.label ? "bg-[#002147] text-white" : "bg-gray-200"
                }`}
                onClick={() => handleTabClick(day)}
              >
                {day.label}
              </button>
            ))}
          </div>
          <Popover className="">
            <PopoverTrigger asChild>
              <button className="bg-gray-200">⚙️</button>
            </PopoverTrigger>
            <PopoverContent className="p-2 z-[999]">
              <div className="flex flex-col">
                  {/* "Date", */}
                  {/* "Client",
                  "Matter", */}
                  {/* "Billable (hrs)", */}
                  {/* "Cost", */}
                {[
                  "Project Name",
                  "Approval Status",
                  "Project Manager",
                  "Private Description",
                  "Labor (hrs)",
                  "Total (hrs)",
                ].map((column, index) => (
                  <label key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(column)}
                      onChange={() => handleColumnVisibilityChange(column)}
                    />
                    {column}
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="border shadow w-full min-w-[1000px]">
          <Table className="">
            <TableHeader className="bg-gray-100">
              <TableRow>
                {visibleColumns?.map((colName) => (
                  <TableHead key={colName} className="py-2">{colName}</TableHead>
                ))}
                <TableHead key={"Action"} className="py-2">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {/* timeSheetList?.timesheet */}
              {console.log(timesheetFilterData, "====timesheetFilterDatascnjas")}
              {timesheetFilterData?.length > 0 ? (
                timesheetFilterData?.filter(eachSheet => eachSheet.userId == userInfo.id)?.map((timesheet, index) => {
                  return(
                  <TableRow key={index}>
                      {/* <TableCell>{timesheet.project?.projectname || '-'}</TableCell> */}
                    {visibleColumns.includes("Project Name") && (
                      <TableCell>{timesheet?.project?.projectname || timesheet?.projectName || '-'}</TableCell>
                    )}
                      {/* <TableCell style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{timesheet.date ? format(new Date(timesheet.date), "yyyy-MM-dd"): '-'}</TableCell> */}
                    {/* {visibleColumns.includes("Date") && (
                      <TableCell style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{timesheet.weekStart ? format(new Date(timesheet.weekStart), "yyyy-MM-dd"): '-'}</TableCell>
                    )} */}
                    {visibleColumns.includes("Approval Status") && (
                      <TableCell>{timesheet?.approvalStatus}</TableCell>
                    )}
                    {/* <TableCell>{timesheet?.project?.project_manager}</TableCell> */}
                    {visibleColumns.includes("Project Manager") && (
                      <TableCell>{timesheet?.project?.manager?.name || timesheet?.projectManager}</TableCell>
                    )}
                    {/* {visibleColumns.includes("Client") && (
                      <TableCell>{timesheet.project?.client_name || "-"}</TableCell>
                    )}
                    {visibleColumns.includes("Matter") && (
                      <TableCell>{timesheet.matter || "-"}</TableCell>
                    )} */}
                    {visibleColumns.includes("Private Description") && (
                      <TableCell>{timesheet.privateDescription || "-"}</TableCell>
                    )}
                    {/* {visibleColumns.includes("Cost") && (
                      <TableCell>{`$${timesheet.cost || 0}`}</TableCell>
                    )} */}
                    {visibleColumns.includes("Labor (hrs)") && (
                      <TableCell>{timesheet.time || 0}</TableCell>
                    )}
                    {/* {visibleColumns.includes("Billable (hrs)") && (
                      <TableCell>{timesheet.billableHours || 0}</TableCell>
                    )} */}
                    {visibleColumns.includes("Total (hrs)") && (
                      <TableCell>{timesheet.time || 0}</TableCell>
                    )}
                    <TableCell>
                      <SubmitButtonInTable 
                        data={timesheet}
                        status={timesheet?.approvalStatus}
                      />
                    </TableCell>
                    {/* <TableCell>
                      <TimeSheetDataModal data={timesheet} 
                        getDateAfterOneWeek={getDateAfterOneWeek} 
                        getMondayOfWeek={getMondayOfWeek} 
                        againFetchingTimesheet={fetchingTimesheet} 
                      />
                    </TableCell> */}
                  </TableRow>
                )})
              ) : (
                <TableRow>
                  <TableCell colSpan={visibleColumns.length} className="text-center">
                    No entries match this search.
                  </TableCell>
                </TableRow>
              )}
              <TableRow className="bg-gray-100 border-t">
                <TableCell className="font-bold">Total</TableCell>
                <TableCell className="text-center"></TableCell>
                <TableCell className="text-center"></TableCell>
                <TableCell className="text-center"></TableCell>
                {/* <TableCell className="text-center">0</TableCell> */}
                <TableCell className="">
                  {total?.toFixed(2)}
                </TableCell>
                <TableCell className="">{total?.toFixed(2)}</TableCell>
                {/* <TableCell className="">0</TableCell> */}
                <TableCell className=""></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>}
    </div>
  );
};

export default TimesheetList;


