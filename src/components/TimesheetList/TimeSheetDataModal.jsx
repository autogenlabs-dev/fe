import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import './CustomModal.css'; // Add your modal-specific CSS here
import Loader from '../loader';
import axiosIns from '@/api/axios';
import { authSelector } from '@/redux/auth/authSlice';
import { useSelector } from 'react-redux';
import toastMessage from '@/lib/toastMessage';

const TimeSheetDataModal = ({ 
  data={}, againFetchingTimesheet=()=>{}, 
  getDateAfterOneWeek=()=>{}, getMondayOfWeek=()=>{}, 
  isDashboard=false,
}) => {
  const [isOpen, setIsOpen] = useState(false); // Modal open/close state
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default selected date is today
  const [inputData, setInputData] = useState({}); // Store input data for each date
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo } = useSelector(authSelector);

  const isUnsubmitted = data?.timesheets?.filter(sheet => sheet.approvalStatus === 'notsubmitted');

  console.log(data, "===datadata:abc, ", isUnsubmitted);
  
  // Get the next 7 days starting from the selected date
  const getWeekDays = (startDate) => {
    const weekStart = getMondayOfWeek(startDate);
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  };

  // Get timesheet data for the selected week
  const getTimeForDate = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const entry = data?.timesheets?.find(entry => format(new Date(entry.date), 'yyyy-MM-dd') === formattedDate);
    // console.log(date, "====daraaasaaaasss, ", formattedDate, "===faas, ", entry, "==== ", data?.timesheets);
    return entry ? entry.time : 0; // Return time if entry exists, otherwise 0
  };

  // Handle input change for each date
  const handleInputChange = (date, value) => {
    setInputData((prev) => ({
      ...prev,
      [format(date, 'yyyy-MM-dd')]: value,
    }));
  };

  // Submit function that gathers all input data
  const submitData = async () => {
    
    const weeklyTimesheets = data?.timesheets?.filter(
      (timeSheet) =>
        timeSheet.approvalStatus === "notsubmitted" && timeSheet.time > 0
    ).map(sheet => ({ ...sheet, weekStart: getMondayOfWeek(selectedDate) }));
    
    if(!weeklyTimesheets || weeklyTimesheets?.length === 0){
      return toastMessage("No Dta to submitted", 'info')
    }
    setIsLoading(true);
    console.log("weeklyTimesheets", weeklyTimesheets);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.access.token}`,
    };

    const body = {
      weeklyTimesheets,
      link: "/timesheetlist",
    };
    console.log(body, "===bodyBekoreSubm");
    try {
      await axiosIns.post(`/timesheet/submit/all`, body, { headers });
      // againFetchingTimesheet();
    } catch (error) {
      // toastMessage(error.message || "Rrror in submitting timesheet", "error");
    }
    toastMessage("Timesheet data successfully saved", "success");
    againFetchingTimesheet();
    setIsLoading(false);
    setIsOpen(false);
  };
  
  const saveData = async () => {
    const sheet = {
      projectId: data.projectId,
      id: data.id,
    }
    const inpDatas = Object.keys(inputData)
    if(inpDatas.length === 0){
      return toastMessage("No New Data to be added", 'info')
    }
    const dataToBeSend = inpDatas.map(date => ({ 
      ...sheet, 
      date: date, 
      time: inputData[date], 
    }));
    
    console.log('Submitted data: ', dataToBeSend);
    
    setIsSaveLoading(true);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.access.token}`,
    };
    
    const body = {
      timesheet: dataToBeSend,
    };
    
    try {
      await axiosIns.patch(`/timesheet/update`, body, { headers });
      toastMessage("Timesheet data successfully saved", "success");
    } catch (error) {
      toastMessage(error.message || "Rrror in submitting timesheet", "error");
    }
    
    againFetchingTimesheet();
    setIsSaveLoading(false);
    setIsOpen(false); // Close the modal on submit
  };

  // Extract week days from the selected date
  const weekDays = getWeekDays(selectedDate);

  // Handle date selection and convert it into a Date object
  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    const parsedDate = new Date(dateValue); // Convert string to Date
    setSelectedDate(parsedDate);
  };

  const ModalData = () => (
    <>
              <h3 className="text-lg font-semibold mb-4">Select a Date</h3>

              {/* Date Input Field */}
              <input
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')} // Set value as formatted date
                onChange={handleDateChange} // Handle date change
                className="border rounded-md p-1 w-full"
              />

              {/* Displaying selected week in a table */}
              <h3 className="mt-4 text-md font-semibold">Input for the Week</h3>
              <table className="table-auto w-full mt-2 border-collapse">
                <thead>
                  <tr>
                    {weekDays?.map((day, index) => (
                      <th key={index} className="border px-4 py-2">
                        {format(day, 'EEE, MMM d')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {weekDays?.map((day, index) => (
                      <td key={index} className="border px-4 py-2">
                      {console.log(getTimeForDate(day), "==getTimeForDate(day)")}
                        <input
                          type="number"
                          className="border rounded-md p-1 w-full no-arrows" // Apply no-arrows class
                          placeholder="0"
                          value={getTimeForDate(day) || inputData[format(day, 'yyyy-MM-dd')]}
                          onChange={(e) => handleInputChange(day, e.target.value)}
                        />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>

              {/* Submit button */}
              <div className='flex gap-3 justify-end'>
                <button disabled={isSaveLoading || Object.keys(inputData || {}).length === 0} onClick={saveData} className="mt-4 bg-main hover:bg-main/90 text-white px-4 py-2 rounded flex items-center gap-3 h-10">
                  Save
                  {isSaveLoading && <Loader />}
                </button>
                <button disabled={isLoading || isUnsubmitted?.length === 0} onClick={submitData} className="mt-4 bg-main hover:bg-main/90 text-white px-4 py-2 rounded flex items-center gap-3 h-10">
                  Submit
                  {isLoading && <Loader />}
                </button>
              </div>
            </>
  )

  if(isDashboard) return <ModalData />

  return (
    <div className="flex flex-col items-center justify-center">
      <button onClick={() => setIsOpen(true)} className="bg-main hover:bg-main/90 text-white px-4 py-2 rounded">
        Edit
      </button>
      {/* Custom Modal */}
      {isOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <button className="close-modal-btn" onClick={() => setIsOpen(false)}>X</button>
            <ModalData />
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSheetDataModal;






























// import React, { useState } from 'react';
// import { format, addDays } from 'date-fns';
// import './CustomModal.css'; // Add your modal-specific CSS here
// import Loader from '../loader';
// import axiosIns from '@/api/axios';
// import { authSelector } from '@/redux/auth/authSlice';
// import { useSelector } from 'react-redux';

// const TimeSheetDataModal = ({ data={}, againFetchingTimesheet=()=>{}, getDateAfterOneWeek=()=>{}, getMondayOfWeek=()=>{} }) => {
//   const [isOpen, setIsOpen] = useState(false); // Modal open/close state
//   const [selectedDate, setSelectedDate] = useState(new Date()); // Default selected date is today
//   const [inputData, setInputData] = useState({}); // Store input data for each date
//   const [isLoading, setIsLoading] = useState(false);
//   const { userInfo } = useSelector(authSelector);

//   console.log(data, "===datadata:abc");
  
//   // Get the next 7 days starting from the selected date
//   const getWeekDays = (startDate) => {
//     const weekStart = getMondayOfWeek(startDate);
//     // const weekEnd = getDateAfterOneWeek(weekStart);
//     return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
//   };

//   // Handle input change for each date
//   const handleInputChange = (date, value) => {
//     setInputData((prev) => ({
//       ...prev,
//       [format(date, 'yyyy-MM-dd')]: value,
//     }));
//   };

//   // Submit function that gathers all input data
//   const submitData = async () => {
//       const sheet = {
//           projectId: data.projectId,
//           id: data.id,
//     }
//     const dataToBeSend = Object.keys(inputData).map(date => ({ ...sheet, date: date, time: inputData[date], }));
//     console.log('Submitted data: ', dataToBeSend);
//     setIsLoading(true);
//     const headers = {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${userInfo.access.token}`,
//     };
//     const body = {
//       timesheet: dataToBeSend,
//     };
//     await axiosIns.patch(`/timesheet/update`, body, { headers });
//     againFetchingTimesheet();
//     setIsLoading(false);
//     setIsOpen(false); // Close the modal on submit
//   };

//   // Extract week days from the selected date
//   const weekDays = getWeekDays(selectedDate);

//   // Handle date selection and convert it into a Date object
//   const handleDateChange = (e) => {
//     const dateValue = e.target.value;
//     const parsedDate = new Date(dateValue); // Convert string to Date
//     setSelectedDate(parsedDate);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center">
//       <button onClick={() => setIsOpen(true)} className="bg-main hover:bg-main/90 text-white px-4 py-2 rounded">
//         Edit
//       </button>
//       {/* Custom Modal */}
//       {isOpen && (
//         <div className="custom-modal-overlay">
//           <div className="custom-modal-content">
//             <button className="close-modal-btn" onClick={() => setIsOpen(false)}>X</button>

//             <h3 className="text-lg font-semibold mb-4">Select a Date</h3>

//             {/* Date Input Field */}
//             <input
//               type="date"
//               value={format(selectedDate, 'yyyy-MM-dd')} // Set value as formatted date
//               onChange={handleDateChange} // Handle date change
//               className="border rounded-md p-1 w-full"
//             />

//             {/* Displaying selected week in a table */}
//             <h3 className="mt-4 text-md font-semibold">Input for the Week</h3>
//             <table className="table-auto w-full mt-2 border-collapse">
//               <thead>
//                 <tr>
//                   {weekDays?.map((day, index) => (
//                     <th key={index} className="border px-4 py-2">
//                       {format(day, 'EEE, MMM d')}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   {weekDays?.map((day, index) => (
//                     <td key={index} className="border px-4 py-2">
//                       <input
//                         type="number"
//                         className="border rounded-md p-1 w-full no-arrows" // Apply no-arrows class
//                         placeholder="0"
//                         value={inputData[format(day, 'yyyy-MM-dd')] || 0}
//                         onChange={(e) => handleInputChange(day, e.target.value)}
//                       />
//                     </td>
//                   ))}
//                 </tr>
//               </tbody>
//             </table>

//             {/* Submit button */}
//             <div className='flex justify-end'>
//                 <button disabled={isLoading} onClick={submitData} className="mt-4 bg-main hover:bg-main/90 text-white px-4 py-2 rounded flex items-center gap-3 h-10">
//                     Submit
//                     {isLoading && <Loader />}
//                 </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TimeSheetDataModal;
