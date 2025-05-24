import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getProjects, getMyProjects } from "@/redux/project/projectThunk";
import { useSelector, useDispatch } from "react-redux";
import { projectSelector } from "../../redux/project/projectSlice";
import { authSelector } from "@/redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/loader";
import axiosIns from "@/api/axios";
import toastMessage from "@/lib/toastMessage";
import { ADMIN, DIRECTOR, GENERAL, OPERATIONAL_DIRECTOR, PROJECT_MANAGER } from "@/constants";
import { put } from "@vercel/blob";

const CreateExpenseSheet = ({
  className = "mt-10 shadow-md py-8 px-5 rounded-md",
  isNavigate = "yes",
  isShowSubmit = false,
}) => {
  const dispatch = useDispatch();
  const [projectId, setProjectId] = useState(""); // Set initial state to empty
  const [month, setMonth] = useState(""); // New state for month picker
  const [year, setYear] = useState(new Date().getFullYear()); // Default to current year
  const [expense, setExpense] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState({});
  const { projects } = useSelector(projectSelector);
  const { userInfo } = useSelector(authSelector);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [lastSubmitted, setLastSubmitted] = useState(null);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // console.log(userInfo, "===userInfouserInfo");

  const handleAddImages = async (files) => {
    // const files = Array.from(event.target.files);
    // const file = files[0];
    const token = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN;
    const urls = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const { url } = await put(file.name, file, {
          access: "public",
          token: token,
        });
        
        urls.push(url);
      }

      return urls;
    } catch (error) {
      return [];
    }
  };
  
  const resetFields = () => {
    setProjectId("");
    setMonth("");
    setYear(new Date().getFullYear());
    setExpense("");
    setCategory("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    const validationErrors = {};
    if (!projectId) validationErrors.projectId = "Project is required";
    if (!month) validationErrors.date = "Month is required";
    if (!expense || expense <= 0) validationErrors.expense = "Expense must be greater than 0";
    if (!category) validationErrors.category = "Category is required";

    // Set errors if any
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    const fileUrl = await handleAddImages(file);

    // Clear error messages if all validations pass
    setError({});
    setLoading(true);

    const formData = {
      projectId: projectId,
      date: `${year}-${String(month).padStart(2, '0')}-01`,
      expense: Number(expense),
      category: category,
      imageUrls: fileUrl,
    };

    console.log(formData, "===fanjasnsanaja");
    

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo?.access?.token}`,
      };
      const data = await axiosIns.post(`/expensesheet/add-new`, formData, { headers });
      console.log(data, "=njcnajsncsa:setLastSubmitted");
      if(isShowSubmit){
        setLastSubmitted(data.data.expenseSheet);
      }
      setLoading(false);
      toastMessage("Expense successfully added", "success");
      if (isNavigate === "yes") {
        navigate("/expensesheet");
      }
    } catch (error) {
      toastMessage(error.message || "Something went wrong", "error");
      setLoading(false);
    }

    if(!isShowSubmit){
      // Reset form after submission
      resetFields()
    }
  };

  useEffect(() => {
    if (projects?.length === 0) {
      (userInfo?.roleAccess === DIRECTOR ||
        userInfo?.roleAccess === PROJECT_MANAGER ||
        userInfo?.roleAccess === GENERAL) &&
        dispatch(getMyProjects(userInfo?.access?.token));
      (userInfo?.roleAccess === ADMIN || userInfo?.roleAccess === OPERATIONAL_DIRECTOR) &&
        dispatch(getProjects(userInfo?.access?.token));
    }
  // }, [projects, dispatch, userInfo]);
  }, []);


  const handleSubmitExpenseSheet = async () => {
    if(lastSubmitted?.id){
      setLoading(true);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.access.token}`,
      };
  
      const body = {
        id: lastSubmitted?.id,
        link: "/expenseSheetlist",
      };
      try {
        await axiosIns.post(`/expenseSheet/submit/all`, body, { headers });
        toastMessage("Expense successfully submitted", "success");
        setLastSubmitted(null);
        resetFields();
      } catch (error) {
        toastMessage("Error: "+ error?.data?.message || error.message, "error");
      }
      
    }
    else {
      toastMessage("No Expensesheet saved till yet!", "info");
    }
  };


  return (
    <>
      <h2 className="font-bold text-xl pt-3 px-3">Expense Entry</h2>
      <div className={`flex justify-center items-center pb-2`}>
        <form className={`min-w-[500px] px-5 py-2 ${className}`} onSubmit={handleSubmit}>
          <div className="w-full">
            <span className="text-gray-700 dark:text-gray-400 flex">Projects</span>
            <select
              name="project"
              className="w-11/12 mt-1 text-sm focus:border-main/50 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
            >
              <option value="">Select Project</option>
              {projects?.map((project) => {
                if(project?.status == 'completed' || project?.status == 'rejected'){
                  return null
                }
                return (
                  <option key={project.id} value={project.id}>
                    {project.projectname}
                  </option>
                )
              })}
            </select>
            {error.projectId && <p className="text-red-500">{error.projectId}</p>}
          </div>

          {/* Month Picker */}
          <div className="flex text-sm mt-8">
            <div className="w-full">
              <span>Choose Month</span>
              <div className="flex space-x-4">
                <select
                  name="month"
                  className="w-[204px] mt-1 text-sm focus:border-main/50 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  required
                >
                  <option value="">Select Month</option>
                  {months.map((monthName, index) => (
                    <option key={index} value={index + 1}>
                      {monthName}
                    </option>
                  ))}
                </select>

                {/* Year Picker */}
                <select
                  name="year"
                  className="w-[204px] mt-1 text-sm focus:border-main/50 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                >
                  {/* Generate a range of years from current year to past 10 years */}
                  {[...Array(11)].map((_, i) => {
                    const currentYear = new Date().getFullYear();
                    return (
                      <option key={i} value={currentYear - i}>
                        {currentYear - i}
                      </option>
                    );
                  })}
                </select>
              </div>
              {error.date && <p className="text-red-500">{error.date}</p>}
            </div>
          </div>

          <label className="flex text-sm mt-8">
            <div className="w-full">
              <span className="text-gray-700 dark:text-gray-400">Total Expense</span>
              <input
                className="w-11/12 mt-1 h-10 text-sm focus:border-main/50 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
                placeholder="Enter Total Expense"
                type="number"
                value={expense}
                onChange={(e) => setExpense(e.target.value)}
                required
              />
              {error.expense && <p className="text-red-500">{error.expense}</p>}
            </div>
          </label>

          <label className="flex text-sm mt-8">
            <div className="w-full">
              <span className="text-gray-700 dark:text-gray-400">Categories</span>
              <select
                name="category"
                className="w-11/12 mt-1 text-sm focus:border-main/50 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>Please Select Category</option>
                <option value="Mileage">Mileage</option>
                <option value="Train Travel">Train Travel</option>
                <option value="Hire car">Hire car</option>
                <option value="Hire car fuel">Hire car fuel</option>
                <option value="Taxi">Taxi</option>
                <option value="Other travel">Other travel</option>
                <option value="Subsistence/ meals">Subsistence/ meals</option>
                <option value="Overnight accommodation">Overnight accommodation</option>
                <option value="Printing">Printing</option>
                <option value="Photocopying">Photocopying</option>
                <option value="IT consumables">IT consumables</option>
                <option value="Courier">Courier</option>
                <option value="Phone">Phone</option>
                <option value="Postage">Postage</option>
                <option value="Training">Training</option>
                <option value="Professional subscriptions">Professional subscriptions</option>
                <option value="Client entertaining">Client entertaining</option>
                <option value="Staff entertaining">Staff entertaining</option>
                <option value="Other/ sundry costs">Other/ sundry costs</option>
              </select>
              {error.category && <p className="text-red-500">{error.category}</p>}
            </div>
          </label>

          <label className="flex text-sm mt-8">
            <div className="w-full">
              <span className="text-gray-700 dark:text-gray-400">Upload receipts</span>
              <input
                className="w-11/12 mt-1 h-10 text-sm focus:border-main/50 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
                type="file"
                accept="image/*, application/pdf"
                onChange={(e) => setFile(e.target.files)}
                // required
              />
              {error.file && <p className="text-red-500">{error.file}</p>}
            </div>
          </label>

          <div className="flex justify-center">
            {loading ? (
              <Loader />
            ) : (
              <div className="flex gap-4">
                <Button type="submit" className="w-40 mt-6 bg-main hover:bg-main/90">
                  Save
                </Button>
                {isShowSubmit && <Button onClick={handleSubmitExpenseSheet} type="button" className="w-40 mt-6 bg-main hover:bg-main/90">
                  Submit
                </Button>}
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateExpenseSheet;
























// import React, { useState, useEffect } from "react";
// import { format } from "date-fns-v3";
// import { Calendar as CalendarIcon } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { getProjects, getMyProjects } from "@/redux/project/projectThunk";
// import { useSelector, useDispatch } from "react-redux";
// import { projectSelector } from "../../redux/project/projectSlice";
// import { authSelector } from "@/redux/auth/authSlice";
// import { useNavigate } from "react-router-dom";
// import Loader from "@/components/loader";
// import axiosIns from "@/api/axios";
// import toastMessage from "@/lib/toastMessage";

// const CreateExpenseSheet = ({
//   className = "mt-10 shadow-md py-8 px-5 rounded-md",
//   isNavigate = "yes",
// }) => {
//   const dispatch = useDispatch();
//   const [projectId, setProjectId] = useState(""); // Set initial state to empty
//   const [date, setDate] = useState("");
//   const [expense, setExpense] = useState("");
//   const [category, setCategory] = useState("");
//   const [error, setError] = useState({});
//   const { projects } = useSelector(projectSelector);
//   const { userInfo } = useSelector(authSelector);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation checks
//     const validationErrors = {};
//     if (!projectId) validationErrors.projectId = "Project is required";
//     if (!date) validationErrors.date = "Date is required";
//     if (!expense || expense <= 0)
//       validationErrors.expense = "Expense must be greater than 0";
//     if (!category) validationErrors.category = "Category is required";

//     // Set errors if any
//     if (Object.keys(validationErrors).length > 0) {
//       setError(validationErrors);
//       return;
//     }

//     // Clear error messages if all validations pass
//     setError({});
//     setLoading(true);

//     const formData = {
//       projectId: projectId,
//       date: date,
//       expense: Number(expense),
//       category: category,
//     };

//     try {
//       const headers = {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${userInfo?.access?.token}`,
//       };
//       await axiosIns.post(`/expensesheet/add-new`, formData, { headers });
//       setLoading(false);
//       toastMessage("Expense successfully added", "success");
//       if (isNavigate === "yes") {
//         navigate("/expensesheet");
//       }
//     } catch (error) {
//       toastMessage(error.message || "Something went wrong", "error");
//       setLoading(false);
//     }

//     // Reset form after submission
//     setProjectId("");
//     setDate("");
//     setExpense("");
//     setCategory("");
//   };

//   useEffect(() => {
//     if (projects?.length === 0) {
//       (userInfo?.roleAccess === "DIRECTOR" ||
//         userInfo?.roleAccess === "PROJECT_MANAGER" ||
//         userInfo?.roleAccess === "GENERAL") &&
//         dispatch(getMyProjects(userInfo?.access?.token));
//       userInfo?.roleAccess === "ADMIN" &&
//         dispatch(getProjects(userInfo?.access?.token));
//     }
//   }, [projects, dispatch, userInfo]);

//   return (
//     <div className={`flex justify-center items-center`}>
//       <form
//         className={`min-w-[500px] py-2 ${className}`}
//         onSubmit={handleSubmit}
//       >
//         <div className="w-full">
//           <span className="text-gray-700 dark:text-gray-400 flex">
//             Projects{" "}
//           </span>
//           <select
//             name="project"
//             className="w-11/12 mt-1 text-sm focus:border-main/50 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
//             value={projectId}
//             onChange={(e) => setProjectId(e.target.value)}
//             required
//           >
//             <option value="">Select Project</option>
//             {projects.map((project) => (
//               <option key={project.id} value={project.id}>
//                 {project.projectname}
//               </option>
//             ))}
//           </select>
//           {error.projectId && <p className="text-red-500">{error.projectId}</p>}
//         </div>

//         <div className="flex text-sm mt-8 ">
//           <div className="w-full">
//             <span>Choose Date</span>
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant={"outline"}
//                   className={cn(
//                     "w-11/12 justify-start text-left font-normal",
//                     !date && "text-muted-foreground"
//                   )}
//                 >
//                   <CalendarIcon className="mr-2 h-4 w-4" />
//                   {date ? format(new Date(date), "PPP") : <span>Pick a date</span>}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0 z-[9999]">
//                 <Calendar
//                   mode="single"
//                   selected={new Date(date)}
//                   onSelect={(d) => setDate(d.toISOString().slice(0, 10))}
//                   initialFocus
//                 />
//               </PopoverContent>
//             </Popover>
//             {error.date && <p className="text-red-500">{error.date}</p>}
//           </div>
//         </div>

//         <label className="flex text-sm mt-8">
//           <div className="w-full">
//             <span className="text-gray-700 dark:text-gray-400">Total Expense</span>
//             <input
//               className="w-11/12 mt-1 h-10 text-sm focus:border-main/50 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
//               placeholder="Enter Total Expense"
//               type="number"
//               value={expense}
//               onChange={(e) => setExpense(e.target.value)}
//               required
//             />
//             {error.expense && <p className="text-red-500">{error.expense}</p>}
//           </div>
//         </label>

//         <label className="flex text-sm mt-8">
//           <div className="w-full">
//             <span className="text-gray-700 dark:text-gray-400">Categories</span>
//             <select
//               name="category"
//               className="w-11/12 mt-1 text-sm focus:border-main/50 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               required
//             >
//               <option value="" disabled>Please Select Category</option>
//               <option value="Mileage">Mileage</option>
//               <option value="Train Travel">Train Travel</option>
//               <option value="Hire car">Hire car</option>
//               <option value="Hire car fuel">Hire car fuel</option>
//               <option value="Taxi">Taxi</option>
//               <option value="Other travel">Other travel</option>
//               <option value="Subsistence/ meals">Subsistence/ meals</option>
//               <option value="Overnight accommodation">
//                 Overnight accommodation
//               </option>
//               <option value="Printing">Printing</option>
//               <option value="Photocopying">Photocopying</option>
//               <option value="IT consumables">IT consumables</option>
//               <option value="Courier">Courier</option>
//               <option value="Phone">Phone</option>
//               <option value="Postage">Postage</option>
//               <option value="Training">Training</option>
//               <option value="Professional subscriptions">
//                 Professional subscriptions
//               </option>
//               <option value="Client entertaining">Client entertaining</option>
//               <option value="Staff entertaining">Staff entertaining</option>
//               <option value="Other/ sundry costs">Other/ sundry costs</option>
//             </select>
//             {error.category && <p className="text-red-500">{error.category}</p>}
//           </div>
//         </label>

//         <div className="flex justify-center">
//           {loading ? (
//             <Loader />
//           ) : (
//             <Button type="submit" className="w-40 mt-6 bg-main hover:bg-main/90">
//               Submit
//             </Button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateExpenseSheet;


































// import React, { useState, useEffect } from "react";
// import { format } from "date-fns-v3";
// import { Calendar as CalendarIcon } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { getProjects, getMyProjects } from "@/redux/project/projectThunk";
// import { useSelector, useDispatch } from "react-redux";
// import { projectSelector } from "../../redux/project/projectSlice";
// import { authSelector } from "@/redux/auth/authSlice";
// import { useNavigate } from "react-router-dom";
// import WrapperComponent from "@/components/Wrapper/TableWrapper";
// import { addNewTimeSheet } from "@/redux/timesheet/timeSheetThunk";
// import { ADMIN, DIRECTOR, PROJECT_MANAGER, GENERAL } from "@/constants";
// import Loader from "@/components/loader";
// import { addExpenseSheet } from "@/redux/expensesheet/expenseSheetSlice";
// import { addNewExpenseSheet } from "@/redux/expensesheet/expenseSheetThunk";
// import axiosIns from "@/api/axios";
// import toastMessage from "@/lib/toastMessage";

// const CreateExpenseSheet = ({ className="mt-10 shadow-md py-8 px-5 rounded-md", isNavigate="yes" }) => {
//   const dispatch = useDispatch();
//   const [projectId, setProjectId] = useState("");
//   const [date, setDate] = useState( new Date().toISOString().slice(0, 10));
//   const [expense, setExpense] = useState(0);
//   const [category, setCategory] = useState("");
//   const [error, setError] = useState("");
//   const { projects } = useSelector(projectSelector);
//   const { userInfo } = useSelector(authSelector);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (expense <= 0) {
//       setError("Expense must be greater than 0");
//       return;
//     }
//     setError('')
//     setLoading(true);

//     const formData = {
//       projectId: projectId,
//       date: date,
//       expense: Number(expense),
//       category: category,
//       //   link: "/timesheet",
//     };
//     console.log(formData, "====formDataaaaa", userInfo?.access?.token);
    
//     try {
//       // dispatch(addNewExpenseSheet({ token: userInfo?.access?.token, data: formData }));
//       const headers = {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${userInfo?.access?.token}`,
//       };
//       // console.log("body", body)
//       const { data } = await axiosIns.post(`/expensesheet/add-new`, formData, {
//         headers,
//       });
//       // addExpenseSheet({
//       //   token: userInfo?.access?.token,
//       //   formData,
//       // })
//       setLoading(false);
//       toastMessage("Expense successfully added", "success");
//       if(isNavigate == 'yes'){
//         navigate("/expensesheet");
//       }
//     } catch (error) {
//       setError(error.message);
//       toastMessage(error.message || "Something went wrong", "error");
//       setLoading(false);
//     }

//     setProjectId("");
//     setDate(new Date());
//     setExpense();
//     setCategory("");
//   };

//   useEffect(() => {
//     if (projects?.length === 0) {
//       (userInfo?.roleAccess === DIRECTOR ||
//         userInfo?.roleAccess === PROJECT_MANAGER ||
//         userInfo?.roleAccess === GENERAL) &&
//         dispatch(getMyProjects(userInfo?.access?.token));
//       userInfo?.roleAccess === ADMIN &&
//         dispatch(getProjects(userInfo?.access?.token));
//     }
//   }, []);

//   useEffect(() => {
//     if (projects?.length > 0) setProjectId(projects[0].id);
//   }, [projects]);

//   return (
//       <div className={`flex justify-center items-center`}>
//         <form
//           className={`min-w-[500px] ${className}`}
//           // className="px-4 py-3 pb-14 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 w-2/4 m-auto mt-10"
//           onSubmit={handleSubmit}
//         >
//           <div className="w-full">
//             <span className="text-gray-700 dark:text-gray-400 flex">
//               Projects{" "}
//             </span>
//             <select
//               id="team1"
//               name="project"
//               className="w-11/12 mt-1 text-sm focus:border-main/50 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
//               placeholder="Team"
//               value={projectId}
//               onChange={(e) => setProjectId(e.target.value)}
//               required
//             >
//               {projects.map((project) => (
//                 <option key={project.id} value={project.id}>
//                   {project.projectname}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex text-sm mt-8 ">
//             <div className="w-full">
//               <span>Choose Date</span>
//               <label className="text-gray-700 dark:text-gray-400 flex gap-10">
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant={"outline"}
//                       className={cn(
//                         "w-11/12 justify-start text-left font-normal",
//                         !date && "text-muted-foreground"
//                       )}
//                     >
//                       <CalendarIcon className="mr-2 h-4 w-4" />
//                       {date ? format(date, "PPP") : <span>Pick a date</span>}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0 z-[9999]">
//                     <Calendar
//                       mode="single"
//                       selected={date}
//                       onSelect={setDate}
//                       initialFocus
//                       className={""}
//                     />
//                   </PopoverContent>
//                 </Popover>
//               </label>
//             </div>
//           </div>

//           <label className="flex text-sm ">
//             <div className=" w-full mt-8">
//               <span className="text-gray-700 dark:text-gray-400 flex gap-10">
//                 Total Expense
//               </span>
//               <input
//                 className="w-11/12 mt-1 h-10 text-sm focus:border-main/50 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2 "
//                 placeholder="Enter Total Hours"
//                 type="number"
//                 value={expense}
//                 onChange={(e) => setExpense(e.target.value)}
//                 required
//               />
//             </div>
//           </label>
//           {error && <p className="text-red-500">{error}</p>}

//           <label className="flex text-sm ">
//             <div className=" w-full mt-8">
//               <span className="text-gray-700 dark:text-gray-400 flex gap-10">
//                 Categories
//               </span>
//               <select
//                 id="team1"
//                 name="project"
//                 className="w-11/12 mt-1 text-sm focus:border-main/50 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
//                 placeholder="Team"
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 required
//               >
//                 <option value="Mileage">Mileage</option>
//                 <option value="Train Travel">Train Travel</option>
//                 <option value="Hire car">Hire car</option>
//                 <option value="Hire car fuel">Hire car fuel</option>
//                 <option value="Taxi">Taxi</option>
//                 <option value="Other travel">Other travel</option>
//                 <option value="Subsistence/ meals">Subsistence/ meals</option>
//                 <option value="Overnight accommodation">
//                   Overnight accommodation
//                 </option>
//                 <option value="Printing">Printing</option>
//                 <option value="Photocopying">Photocopying</option>
//                 <option value="IT consumables">IT consumables</option>
//                 <option value="Courier">Courier</option>
//                 <option value="Phone">Phone</option>
//                 <option value="Postage">Postage</option>
//                 <option value="Training">Training</option>
//                 <option value="Professional subscriptions">
//                   Professional subscriptions
//                 </option>
//                 <option value="Client entertaining">Client entertaining</option>
//                 <option value="Staff entertaining">Staff entertaining</option>
//                 <option value="Other/ sundry costs">Other/ sundry costs</option>
//               </select>
//             </div>
//           </label>
//           <div className=" flex justify-center">
//             {loading ? (
//               <Loader />
//             ) : (
//               <Button type="submit" className="w-40 mt-6 bg-main hover:bg-main/90">
//                 Submit
//               </Button>
//             )}
//           </div>
//         </form>
//       </div>
//   );
// };

// export default CreateExpenseSheet;
