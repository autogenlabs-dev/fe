import React, { useState, useEffect } from "react";
import { format } from "date-fns-v3";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getProjects, getMyProjects } from "@/redux/project/projectThunk";
import { useSelector, useDispatch } from "react-redux";
import { projectSelector } from "../../redux/project/projectSlice";
import { authSelector } from "@/redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import WrapperComponent from "@/components/Wrapper/TableWrapper";
import { timeSheetSelector } from "@/redux/timesheet/timeSheetSlice";
import { addNewTimeSheet } from "@/redux/timesheet/timeSheetThunk";
import { ADMIN, DIRECTOR, PROJECT_MANAGER, GENERAL, OPERATIONAL_DIRECTOR } from "@/constants";
import Loader from "@/components/loader";

const CreateSheetRequest = () => {
  const dispatch = useDispatch();
  const [projectId, setProjectId] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(0);
  const [task, setTask] = useState("");
  const [error, setError] = useState("");
  const { projects } = useSelector(projectSelector);
  const { userInfo } = useSelector(authSelector);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // // console.log("projects", projects);
    // // console.log("projects", projectId);

    const selectedProject = projects.find(
      (proj) => proj.id === Number(projectId)
    );
    const formData = {
      date: date,
      time: Number(time), // convert time to a number
      // time: "20-02-2024",
      task,
      projectId: selectedProject.id,
      link: "/timesheet",
    };
    // // console.log("formdata", formData);
    try {
      const result = await dispatch(
        addNewTimeSheet({
          token: userInfo?.access?.token,
          newTimeSheet: formData,
        })
      ).unwrap();
    } catch (error) {
      setError(error.message);
    }

    setProjectId("");
    setDate(new Date());
    setTime();
    setTask("");

    navigate("/timesheet");
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
  }, []);

  useEffect(() => {
    if (projects?.length > 0) setProjectId(projects[0].id);
  }, [projects]);

  return (
    <WrapperComponent>
      <form
        className="px-4 py-3 pb-14 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 w-2/4 m-auto mt-10"
        onSubmit={handleSubmit}
      >
        <div className="w-full">
          <span className="text-gray-700 dark:text-gray-400 flex">
            Projects{" "}
          </span>
          <select
            id="team1"
            name="project"
            className="w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
            placeholder="Team"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
          >
            {projects?.map((project) => (
              <option key={project.id} value={project.id}>
                {project.projectname}
              </option>
            ))}
          </select>
        </div>

        <div className="flex text-sm mt-8 ">
          <div className="w-full">
            <span>Choose Date</span>
            <label className="text-gray-700 dark:text-gray-400 flex gap-10">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-11/12 justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </label>
          </div>
        </div>

        <label className="flex text-sm ">
          <div className=" w-full mt-8">
            <span className="text-gray-700 dark:text-gray-400 flex gap-10">
              Total Hours
            </span>
            <input
              className="w-11/12 mt-1 h-10 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2 "
              placeholder="Enter Total Hours"
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
        </label>

        <label className="flex text-sm ">
          <div className=" w-full mt-8">
            <span className="text-gray-700 dark:text-gray-400 flex gap-10">
              Task
            </span>
            <input
              className="w-11/12 mt-1 h-10 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2 "
              placeholder="Enter Your Task"
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              required
            />
          </div>
        </label>
        <div className=" flex justify-center">
          {loading ? (
            <Loader />
          ) : (
            <Button type="submit" className="w-40 mt-6">
              Submit
            </Button>
          )}
        </div>
      </form>
    </WrapperComponent>
  );
};

export default CreateSheetRequest;
