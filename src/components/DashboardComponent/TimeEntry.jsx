import { authSelector } from "@/redux/auth/authSlice";
import { projectSelector } from "@/redux/project/projectSlice";
import { getMyProjects, getProjects } from "@/redux/project/projectThunk";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TimeSheetDataModal from "../TimesheetList/TimeSheetDataModal";
import { getTimeSheet } from "@/redux/timesheet/timeSheetThunk";
import { timeSheetSelector } from "@/redux/timesheet/timeSheetSlice";


const TimeEntry = () => {
  const dispatch = useDispatch();
  const { projects } = useSelector(projectSelector);
  const { userInfo } = useSelector(authSelector);
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [error, setError] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const timeSheetData = useSelector(timeSheetSelector);
console.log(timeSheetData, "===timeSheetDatatimeSheetData");

  function getDateAfterOneWeek(inputDate) {
    // Convert the input to a Date object
    const date = new Date(inputDate);
  
    // Add 7 days to the date
    date.setDate(date.getDate() + 7);
  
    // Return the updated date
    return date;
  }

  function getMondayOfWeek(inputDate) {
    // Convert the input to a Date object
    const date = new Date(inputDate);
  
    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = date.getDay();
  
    // Calculate how many days to subtract to get to Monday (day 1)
    const daysToMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1); // Adjust if the day is Sunday (0), set to previous Monday
  
    // Set the date to the previous Monday
    date.setDate(date.getDate() - daysToMonday);
  
    // Return the Monday date
    return date;
  }

  const fetchingTimesheet = (newDate) => {
    if(!newDate) newDate = selectedDate
    const startDate = getMondayOfWeek(newDate);
    const endOfWeek = getDateAfterOneWeek(startDate);
    console.log(selectedDate, "===selectedDate+===selectedDate", startDate, " === end = ", endOfWeek);
    dispatch(getTimeSheet({ projectId: null, date: startDate, endOfWeek, token: userInfo.access?.token }))
  }
  
  useEffect(()=>{
    console.log("acnancasnsancas:asa");
    // dispatch(getTimeSheet({ projectId: null, date: selectedDate, token: userInfo.access?.token }))
    fetchingTimesheet(selectedDate);
  }, [])

  return (
    <div className="px-6">
      <div className="w-full">
        <span className="text-gray-700 dark:text-gray-400 flex">
          Projects{" "}
        </span>
        <select
          name="project"
          className="w-11/12 mt-1 text-sm focus:border-main/50 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          required
        >
          <option value="">Select Project</option>
          {timeSheetData?.map((project) => (
            <option key={project.projectId} value={project.projectId} className="text-black">
              {project.projectName}
            </option>
          ))}
        </select>
        {error?.projectId && <p className="text-red-500">{error?.projectId}</p>}
      </div>
      {!projectId && <div className="text-center min-h-[300px] flex justify-center items-center">Please select Project</div>}
      {projectId && 
        <TimeSheetDataModal 
          isDashboard={true}
          data={timeSheetData.find(proj => proj.projectId == projectId)} 
          againFetchingTimesheet={fetchingTimesheet}
          getDateAfterOneWeek={getDateAfterOneWeek}
          getMondayOfWeek={getMondayOfWeek}
        />}
    </div>
  )
}

export default TimeEntry















// import React, { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useSelector, useDispatch } from 'react-redux';
// import { authSelector } from '@/redux/auth/authSlice';
// import { Plus } from 'lucide-react';
// import { format } from 'date-fns'; // To format dates
// import { getClientsThunk } from '@/redux/client/clientThunk';
// import { projectSelector } from '@/redux/project/projectSlice';
// import { getMyProjects, getProjects } from '@/redux/project/projectThunk';
// import { userSelector } from '@/redux/User/userSlice';
// import { getUsers } from '@/redux/User/userThunk';
// import { ADMIN, DIRECTOR, GENERAL, OPERATIONAL_DIRECTOR, PROJECT_MANAGER } from '@/constants';
// import Loader from '../loader';
// import toastMessage from '@/lib/toastMessage';
// import { addNewTimeSheet } from "@/redux/timesheet/timeSheetThunk";

// const TimeEntry = () => {
//   const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
//   const { userInfo } = useSelector(authSelector);
//   const { projects } = useSelector(projectSelector);
//   const dispatch = useDispatch();
  
//   const initialDate = new Date(); // Set initial date to today's date
//   const formattedDate = format(initialDate, 'yyyy-MM-dd'); // Format date to 'yyyy-MM-dd'

//   const [timeSheetCreateLoading, setTimeSheetCreateLoading] = useState(false);
//   const [clients, setClients] = useState([]);
//   const { user } = useSelector(userSelector);

//   useEffect(() => {
//     setValue("dateOfWork", formattedDate); // Set default date value
//   }, [formattedDate, setValue]);

//   useEffect(() => {
//     dispatch(getClientsThunk({ token: userInfo?.access?.token }))
//       .unwrap()
//       .then((res) => {
//         setClients(res);
//       })
//       .catch(() => {
//         setClients([]);
//       });
//   }, [dispatch, userInfo]);

//   useEffect(() => {
//     if (projects.length === 0) {
//       if ([DIRECTOR, PROJECT_MANAGER, GENERAL].includes(userInfo?.roleAccess)) {
//         dispatch(getMyProjects(userInfo?.access?.token));
//       } else if ([ADMIN, OPERATIONAL_DIRECTOR].includes(userInfo?.roleAccess)) {
//         dispatch(getProjects(userInfo?.access?.token));
//       }
//     }
//     if (!user || user?.length === 0) {
//       dispatch(getUsers(userInfo?.access?.token));
//     }
//   }, [projects, user, userInfo, dispatch]);

//   const onSubmit = (data) => {
//     const proj = projects.find(pro => pro.id == data.matter);
//     const selectedUser = user.find(u => u.id == data.userId);
//     const userBlenRate = selectedUser?.blendedRate || '1';

//     if (!proj) return toastMessage("Please select a valid Matter (Project)", "error");

//     const cost = proj.multiplier * data.hoursOfWork * Number(userBlenRate)
//     if(proj.total_fee < cost){
//       return toastMessage("This Project does not have enough budget", "info");
//     }
    
//     const data1 = {
//       ...data,
//       projectId: data.matter,
//       time: data.hoursOfWork,
//       privateDescription : data.description,
//       cost: proj?.multiplier * data.hoursOfWork * Number(userBlenRate),
//     };

//     console.log(data1, "==Time Entry");

//     setTimeSheetCreateLoading(true);
    
//     // Dispatch time sheet creation action here...
//     dispatch(addNewTimeSheet({ newTimeSheet: data1, token: userInfo?.access?.token }))
//       .unwrap()
//       .then(res => {
//         console.log(res, "===res:timesheetlistcreat");
//         setTimeSheetCreateLoading(false);
//         toastMessage("Timesheet successfully added", "success");
//         handleClear();
//       })
//       .catch(err => {
//         console.log(err, "===err:timesheetlistcreat");
//         setTimeSheetCreateLoading(false);
//       });
//   };

//   const handleDateChange = (e) => {
//     const newDate = e.target.value;
//     setValue("dateOfWork", newDate);
//   };

//   const handleClear = () => {
//     setValue("client", "");
//     setValue("matter", "");
//     setValue("description", "");
//     setValue("hoursOfWork", "");
//     setValue("dateOfWork", formattedDate); // Reset date to today's date
//   };

//   const selectedUser = watch("userId");
//   const selectedClient = watch("client");
//   const selectedMatter = watch("matter");

//   return (
//     <div className="border border-gray-300 rounded-lg p-4 w-[48%] bg-white shadow-sm">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold">Time Entry</h2>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)}>
//         {/* Date and User */}
//         <div className="flex justify-between items-center mb-4">
//           <input
//             type="date"
//             id="dateOfWork"
//             onChange={handleDateChange}
//             className="w-1/2 border border-gray-300 rounded p-2"
//             {...register("dateOfWork", { required: "Date of work is required" })}
//           />
//           <select
//             value={selectedUser || ""}
//             className="w-1/2 border border-gray-300 rounded p-2 ml-2"
//             {...register("userId", { required: "User is required" })}
//           >
//             <option value="">Select User</option>
//             {user?.map(u => (
//               <option key={u?.id} value={u?.id}>{u?.name}</option>
//             ))}
//           </select>
//           {errors.userId && <p style={{ color: 'red', fontSize: '14px' }}>{errors.userId.message}</p>}
//         </div>

//         {/* Client Select */}
//         <div className="mb-4">
//           <select
//             value={selectedClient || ""}
//             className="w-full border border-gray-300 rounded p-2"
//             {...register("client", { required: "Client is required" })}
//           >
//             <option value="">Select Client</option>
//             {clients?.map(client => (
//               <option key={client?.id} value={client?.id}>{client?.clientName}</option>
//             ))}
//           </select>
//           {errors.client && <p style={{ color: 'red', fontSize: '14px' }}>{errors.client.message}</p>}
//         </div>

//         {/* Matter Selection */}
//         <div className="mb-4">
//           <select
//             value={selectedMatter || ""}
//             className="w-full border border-gray-300 rounded p-2"
//             {...register("matter", { required: "Matter is required" })}
//           >
//             <option value="">Select Matter</option>
//             {projects?.map(project => (
//               <option key={project?.id} value={project.id}>{project?.projectname}</option>
//             ))}
//           </select>
//           {errors.matter && <p style={{ color: 'red', fontSize: '14px' }}>{errors.matter.message}</p>}
//         </div>

//         {/* Description */}
//         <div className="mb-4">
//           <textarea
//             value={watch("description") || ""}
//             onChange={(e) => setValue("description", e.target.value)}
//             placeholder="Description"
//             className="w-full border border-gray-300 rounded p-2"
//             {...register("description")}
//           ></textarea>
//         </div>

//         {/* Hours of Work */}
//         <div className="flex items-center mb-4">
//           <input
//             type="number"
//             placeholder="Hour"
//             className="w-full border border-gray-300 rounded p-2"
//             {...register("hoursOfWork", { valueAsNumber: true, required: "Hours of work is required" })}
//           />
//           {errors.hoursOfWork && <p style={{ color: 'red', fontSize: '14px' }}>{errors.hoursOfWork.message}</p>}
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-between">
//           <button type="submit" className="flex items-center h-[42px] bg-[#002147] hover:bg-[#011c3b] text-white font-semibold py-2 px-4 rounded">
//             Save
//             {timeSheetCreateLoading && <Loader />} {/* Loader */}
//           </button>
//           <button
//             type="button"
//             onClick={handleClear}
//             className="flex items-center text-[#002147] font-semibold py-2 px-4 rounded"
//           >
//             Clear
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default TimeEntry;



























// import { authSelector } from '@/redux/auth/authSlice';
// import React, { useState } from 'react';
// import { useSelector } from 'react-redux';

// const TimeEntry = () => {
//   const [date, setDate] = useState('09/06/2024');
//   const [user, setUser] = useState('Alqama Shuja');
//   const [client, setClient] = useState('');
//   const [search1, setSearch1] = useState('');
//   const [search2, setSearch2] = useState('');
//   const [description, setDescription] = useState('');
//   const [hours, setHours] = useState(0);
//   const { userInfo } = useSelector(authSelector);

//   const handleClear = () => {
//     setClient('');
//     setSearch1('');
//     setSearch2('');
//     setDescription('');
//     setHours(0);
//   };

//   const handleSubmit = () => {
//     const data = {
//         date, user, client, search1, search2, description, hours
//     }
//     console.log(data, "===Expense Entry");
//   }

//   return (
//     <div className="border border-gray-300 rounded-lg p-4 w-[48%] bg-white shadow-sm">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold">Time Entry</h2>
//       </div>

//       {/* Date and User */}
//       <div className="flex justify-between items-center mb-4">
//         <input
//           type="text"
//           value={date}
//           className="w-1/2 border border-gray-300 rounded p-2"
//           readOnly
//         />
//         <select
//           value={user}
//           onChange={(e) => setUser(e.target.value)}
//           className="w-1/2 border border-gray-300 rounded p-2 ml-2"
//         >
//           <option>{userInfo?.name}</option>
//         </select>
//       </div>

//       {/* Client Select */}
//       <div className="mb-4">
//         <select
//           value={client}
//           onChange={(e) => setClient(e.target.value)}
//           className="w-full border border-gray-300 rounded p-2"
//         >
//           <option value="">Client</option>
//           <option value="client1">Client 1</option>
//           <option value="client2">Client 2</option>
//         </select>
//       </div>

//       {/* Search Select 1 */}
//       <div className="mb-4">
//         <select
//           value={search1}
//           onChange={(e) => setSearch1(e.target.value)}
//           className="w-full border border-gray-300 rounded p-2"
//         >
//           <option value="">Search</option>
//           <option value="search1">Search 1</option>
//           <option value="search2">Search 2</option>
//         </select>
//       </div>

//       {/* Search Select 2 */}
//       <div className="mb-4">
//         <select
//           value={search2}
//           onChange={(e) => setSearch2(e.target.value)}
//           className="w-full border border-gray-300 rounded p-2"
//         >
//           <option value="">Search</option>
//           <option value="search1">Search 1</option>
//           <option value="search2">Search 2</option>
//         </select>
//       </div>

//       {/* Description */}
//       <div className="mb-4">
//         <input
//           type="text"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Description"
//           className="w-full border border-gray-300 rounded p-2"
//         />
//       </div>

//       {/* Hours */}
//       <div className="flex items-center mb-4">
//         {/* <label className="w-1/3 text-gray-700">Hours:</label> */}
//         <input
//           type="number"
//           placeholder='Hour'
//           value={hours}
//           onChange={(e) => setHours(e.target.value)}
//           className="w-full border border-gray-300 rounded p-2"
//         />
//       </div>

//       {/* Buttons */}
//       <div className="flex justify-between">
//         <button onClick={handleSubmit} className="flex items-center bg-[#002147] hover:bg-[#011c3b] text-white font-semibold py-2 px-4 rounded">
//           <svg
//             className="w-5 h-5 mr-1"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M17 16l4-4m0 0l-4-4m4 4H3"
//             />
//           </svg>
//           Save
//         </button>
//         <button
//           onClick={handleClear}
//           className="flex items-center text-[#002147] font-semibold py-2 px-4 rounded"
//         >
//           <svg
//             className="w-5 h-5 mr-1"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//           Clear
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TimeEntry;
