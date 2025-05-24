import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "@/redux/auth/authSlice";
import { Plus } from "lucide-react";
import { format, isValid } from "date-fns"; // To format dates and check validity
import { getClientsThunk } from "@/redux/client/clientThunk";
import { projectSelector } from "@/redux/project/projectSlice";
import { getMyProjects, getProjects } from "@/redux/project/projectThunk";
import { ADMIN, DIRECTOR, GENERAL, OPERATIONAL_DIRECTOR, PROJECT_MANAGER } from "@/constants";
import { userSelector } from "@/redux/User/userSlice";
import { getUsers } from "@/redux/User/userThunk";
import { addNewTimeSheet } from "@/redux/timesheet/timeSheetThunk";
import Loader from "../loader";
import toastMessage from "@/lib/toastMessage";
import axiosIns from "@/api/axios";

const NewTimeEntry = ({ 
  data = {}, 
  open, 
  close, 
  children, 
  dateOfWorkFromTimesheet, 
  fetchingTimesheet=()=>{}, 
  isDashboard = false, 
  isEdit = false,
  onSave = null, // New prop: callback when save completes
  preventAutoClose = false // New prop: explicitly prevent auto-close
}) => {
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm();
  const { userInfo } = useSelector(authSelector);
  const { projects } = useSelector(projectSelector);
  const dispatch = useDispatch();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [clients, setClients] = useState([]);
  const [timeSheetCreateLoading, setTimeSheetCreateLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentlySavedSheet, setCurrentlySavedSheet] = useState([]);
  
  // Use ref to track if the form has been initialized
  const formInitialized = useRef(false);

  const { user } = useSelector(userSelector);
  const isUser = userInfo?.roleAccess === GENERAL;
  const isProjManager = userInfo?.roleAccess === PROJECT_MANAGER;

  const initialDate = isValid(new Date(dateOfWorkFromTimesheet)) ? new Date(dateOfWorkFromTimesheet) : new Date();
  const formattedDate = format(initialDate, 'yyyy-MM-dd');

  function getMondayOfWeek(inputDate) {
    const date = new Date(inputDate);
    const dayOfWeek = date.getDay();
    const daysToMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
    date.setDate(date.getDate() - daysToMonday);
    return date;
  }

  // Prefill form with data only once
  useEffect(() => {
    // Only initialize form values once to prevent infinite updates
    if (!formInitialized.current) {
      if (Object.keys(data).length > 0) {
        setValue("matter", data.projectId || data.matter || "");
        setValue("activity", data.activity || "");
        setValue("privateDescription", data.privateDescription || "");
        setValue("hoursOfWork", data.time || 0);
        setValue("dateOfWork", data.date ? format(new Date(data.date), 'yyyy-MM-dd') : formattedDate);
      } else {
        setValue("dateOfWork", formattedDate);
      }
      formInitialized.current = true;
    }
  }, []);

  // Separate useEffect to handle the edit mode initialization - only run once
  useEffect(() => {
    if (isEdit && Object.keys(data).length > 0 && currentlySavedSheet.length === 0) {
      setCurrentlySavedSheet([data]);
    }
  }, [isEdit, data]);

  useEffect(() => {
    dispatch(getClientsThunk({ token: userInfo?.access?.token }))
      .unwrap()
      .then((res) => setClients(res))
      .catch(() => setClients([]));
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (!projects || projects.length === 0) {
      if ([DIRECTOR, PROJECT_MANAGER, GENERAL, OPERATIONAL_DIRECTOR].includes(userInfo?.roleAccess)) {
        dispatch(getMyProjects(userInfo?.access?.token));
      } else if ([ADMIN, OPERATIONAL_DIRECTOR].includes(userInfo?.roleAccess)) {
        dispatch(getProjects(userInfo?.access?.token));
      }
    }
    if (!user || user?.length === 0) {
      dispatch(getUsers(userInfo?.access?.token));
    }
  }, []);

  const submitData = async () => {
    console.log("Submit data called with currentlySavedSheet:", currentlySavedSheet);

    if (!currentlySavedSheet || currentlySavedSheet.length === 0) {
      return toastMessage("You have not saved timesheet yet", "info")
    }
    
    // Take only the first item from currentlySavedSheet for submission
    const sheetToSubmit = currentlySavedSheet[0]; 
    
    // IMPORTANT FIX: Only check time, not approval status
    if (!sheetToSubmit || sheetToSubmit.time <= 0) {
      return toastMessage("Hours must be greater than 0", 'info')
    }
    
    setIsLoading(true);
    
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.access.token}`,
    };

    const weeklyTimesheet = {
      ...sheetToSubmit,
      weekStart: getMondayOfWeek(sheetToSubmit.date)
    };

    const body = {
      weeklyTimesheets: [weeklyTimesheet],
      link: "/timesheetlist",
    };
    
    console.log("Submitting with body:", body);
    
    try {
      await axiosIns.post(`/timesheet/submit/all`, body, { headers });
      fetchingTimesheet({ isSetTab: true });
      setCurrentlySavedSheet([]);
      setIsLoading(false);
      toastMessage("Timesheet data successfully submitted", "success");
      
      // Close the modal after successful submission
      if (typeof close === 'function') {
        close("yes");
      }
    } catch (error) {
      console.error("Error submitting timesheet:", error);
      setIsLoading(false);
      toastMessage(error?.response?.data?.message || "Error submitting timesheet", "error");
    }
  };

  const saveData = async (formData) => {
    const proj = projects?.find(pro => pro.id == formData.matter);
    const sheet = {
      ...data,
      projectId: proj?.id || formData.matter,
      dateOfWork: formData.dateOfWork,
      date: formData.dateOfWork,
      activity: formData.activity,
      privateDescription: formData.privateDescription,
      time: formData.hoursOfWork,
    };

    setIsSaveLoading(true);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo?.access?.token}`,
    };

    try {
      let res = null;
      if(isEdit || (data && Object.keys(data).length > 0 && data.id)) {
        const body = { timesheet: sheet };
        res = await axiosIns.patch(`/timesheet/update/${data.id}`, body, { headers });
        
        console.log("Edit save response:", res.data);
        // Ensure we have the updated timesheet data
        const updatedSheet = res.data?.updatedTimesheet;
        setCurrentlySavedSheet([updatedSheet]);
        
        // If onSave callback is provided, call it with the updated timesheet
        if (onSave && typeof onSave === 'function') {
          console.log("Calling onSave with data:", res.data);
          onSave(res.data);
        }
      }
      else {
        const body = { timesheet: [sheet] };
        res = await axiosIns.patch(`/timesheet/update`, body, { headers });
        console.log("Create save response:", res.data);
        setCurrentlySavedSheet(res.data?.updatedTimesheet || []);
        
        // If onSave callback is provided, call it with the response data
        if (onSave && typeof onSave === 'function') {
          console.log("Calling onSave with data:", res.data);
          onSave(res.data);
        }
      }
      
      toastMessage("Timesheet data successfully saved", "success");
      
      // Only close if not in edit mode AND not explicitly prevented
      if (!isEdit && !preventAutoClose && isUser && !isDashboard) {
        close("yes");
      }
    } catch (error) {
      console.error("Error saving timesheet:", error);
      toastMessage(error.message || "Error in saving timesheet", "error");
    }

    setIsSaveLoading(false);
    fetchingTimesheet();
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setValue("dateOfWork", newDate); // Directly update form value
  };

  const FormInputs = () => {
    const isShowToProjManager = isProjManager && currentlySavedSheet?.length > 0 && userInfo.id != currentlySavedSheet[0]?.userId
    const isShowToAdminOrDirector = [ADMIN, DIRECTOR, OPERATIONAL_DIRECTOR].includes(userInfo?.roleAccess);
    return (
      <div className={!isDashboard ? "bg-white p-6 rounded-lg shadow-md max-w-2xl w-full max-h-[85vh] overflow-y-auto relative" : "p-6"}>
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">{isEdit ? "Edit Time Entry" : "New Time Entry"}</h2>
          {!isDashboard && <button onClick={() => close()} className="text-gray-500 hover:text-black">✕</button>}
        </div>
        <form onSubmit={handleSubmit(saveData)} className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {/* Matter (Project) Selection */}
            <div className="w-full md:flex-[0_0_30%]">
              <label htmlFor="matter" className="block mb-1 font-semibold">Project:</label>
              <div className="flex items-center gap-2">
                <select
                  id="matter"
                  className="w-full border p-2 rounded"
                  {...register("matter", { required: "Project is required" })}
                  value={watch("matter") || ""}
                >
                  <option value="">Select Project</option>
                  {projects?.map((project) => {
                    if (project?.status == 'completed' || project?.status == 'rejected') {
                      return null
                    }
                    return (
                      <option key={project?.id} value={project.id}>{project?.projectname}</option>
                    )
                  })}
                </select>
              </div>
              {errors?.matter && <p style={{ color: 'red', fontSize: '14px' }}>{errors?.matter?.message}</p>}
            </div>

            {/* Activity Selection */}
            {/* <div className="w-full md:flex-[0_0_30%]">
              <label htmlFor="activity" className="block mb-1 font-semibold">Activity:</label>
              <select
                id="activity"
                className="w-full border p-2 rounded"
                {...register("activity", { required: "Activity is required" })}
                value={watch("activity") || ""}
              >
                <option value="" disabled>Select Activity</option>
                <option value="Consulting">Consulting</option>
                <option value="Documentation">Documentation</option>
                <option value="Meeting">Meeting</option>
                <option value="Other">Other</option>
              </select>
              {errors.activity && <p style={{ color: 'red', fontSize: '14px' }}>{errors.activity.message}</p>}
            </div> */}
            <div className="w-full md:flex-[0_0_30%]">
              <label htmlFor="activity" className="block mb-1 font-semibold">Activity:</label>
              <select
                id="activity"
                className="w-full border p-2 rounded"
                {...register("activity", { required: "Activity is required" })} // Register the field properly
                defaultValue={data.activity ?? ""} // Use defaultValue instead of value
              >
                <option value="" disabled>Select Activity</option>
                <option value="Consulting">Consulting</option>
                <option value="Documentation">Documentation</option>
                <option value="Meeting">Meeting</option>
                <option value="Other">Other</option>
              </select>
              {errors.activity && <p style={{ color: 'red', fontSize: '14px' }}>{errors.activity.message}</p>}
            </div>

            {/* Private Description */}
            <div className="w-full md:flex-[0_0_100%]">
              <label htmlFor="privateDescription" className="block mb-1 font-semibold">Private Description:</label>
              <textarea id="privateDescription" className="w-full border p-2 rounded" {...register("privateDescription")}></textarea>
            </div>

            {/* Date of Work */}
            <div className="w-full md:flex-[0_0_30%]">
              <label htmlFor="dateOfWork" className="block mb-1 font-semibold">Date of Work:</label>
              <input
                type="date"
                id="dateOfWork"
                value={watch("dateOfWork")} // This ensures that the input updates dynamically
                onChange={handleDateChange} // Update the form value on change
                className="w-full border p-2 rounded"
                {...register("dateOfWork", { required: "Date of work is required" })}
              />
              {errors.dateOfWork && <p style={{ color: 'red', fontSize: '14px' }}>{errors.dateOfWork.message}</p>}
            </div>

            {/* Hours of Work */}
            {/* <div className="w-full md:flex-[0_0_30%]">
              <label htmlFor="hoursOfWork" className="block mb-1 font-semibold">Hour Of Work:</label>
              <input
                type="number"
                id="hoursOfWork"
                min="1"
                step="1"
                className="w-full border p-2 rounded"
                {...register("hoursOfWork", { valueAsNumber: true, required: "Hours of work is required" })}
                placeholder="Enter hours"
              />
              {errors.hoursOfWork && <p style={{ color: 'red', fontSize: '14px' }}>{errors.hoursOfWork.message}</p>}
            </div> */}
            <div className="w-full md:flex-[0_0_30%]">
              <label htmlFor="hoursOfWork" className="block mb-1 font-semibold">Hours of Work:</label>
              <input
                type="number"
                id="hoursOfWork"
                min="0.1" // Minimum value allowed (optional)
                step="any"
                // step="0.1" // Allows decimal steps
                className="w-full border p-2 rounded"
                {...register("hoursOfWork", {
                  valueAsNumber: true, // Ensures the value is parsed as a number
                  required: "Hours of work is required",
                  validate: value => value > 0 || "Hours of work must be greater than 0" // Optional validation
                })}
                placeholder="Enter hours (e.g., 1.5)"
              />
              {errors.hoursOfWork && <p style={{ color: 'red', fontSize: '14px' }}>{errors.hoursOfWork.message}</p>}
            </div>

          </div>

          <div className="flex gap-2 mt-4 flex-wrap justify-center w-full">
            <button type="submit" disabled={isSaveLoading} className="mt-4 bg-main hover:bg-main/90 text-white px-4 py-2 rounded flex items-center gap-3 h-10">
              {isEdit ? "Save Changes" : "Save"}
              {isSaveLoading && <Loader />}
            </button>
            <button
              disabled={isLoading || !currentlySavedSheet || currentlySavedSheet.length === 0}
              onClick={submitData} type="button" className="mt-4 bg-main hover:bg-main/90 text-white px-4 py-2 rounded flex items-center gap-3 h-10"
            >
              Submit
              {isLoading && <Loader />}
            </button>
          </div>
        </form>
      </div>
    )
  }

  if (isDashboard) return <FormInputs />

  return (
    <>
      {children}
      <div className={`fixed inset-0 bg-gray-200/80 flex items-center justify-center z-[9999] ${!open ? "hidden" : ""}`} onClick={() => close()}></div>
      <div className={`fixed inset-0 top-10 flex items-center justify-center z-[99999] ${!open ? "hidden" : ""}`}>
        <FormInputs />
      </div>
    </>
  );
};

export default NewTimeEntry;
