import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import TableWrapper from "@/components/Wrapper/TableWrapper";
// import { getTimeSheetDetails } from "../../redux/timesheet/timeSheetThunk";
// import { timeSheetDetailsSelector } from "@/redux/timesheet/timeSheetSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { authSelector } from "@/redux/auth/authSlice";
import { projectSelector } from "../../redux/project/projectSlice";
import { getProjects } from "@/redux/project/projectThunk";
import { format } from "date-fns-v3";
import axiosIns from "@/api/axios";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import AppWrapper from "../Wrapper/AppWrapper";
import Loader from "@/components/loader";

const expenseSheetDetails = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const date = searchParams.get("date");
    // console.log(id);
    const dispatch = useDispatch();
    // const timeSheetData = useSelector(timeSheetDetailsSelector);
    // // console.log("details", timeSheetData);
    const { userInfo } = useSelector(authSelector);
    const { projects } = useSelector(projectSelector);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    // console.log("projects", projects);
  
    // const submitTimeSheet = async () => {
    //   const headers = {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${userInfo.access.token}`,
    //   };
  
    //   const body = {
    //     date: timeSheetData.timesheet[0].date,
    //     projectId: id,
    //     link: "/timesheet",
    //   };
  
    //   const { data } = await axiosIns.post(`/timesheet/submit`, body, {
    //     headers,
    //   });
    //   navigate("/timesheet");
    // };
  
    // useEffect(() => {
    //   setIsLoading(true);
    //   const projectId = id;
    //   dispatch(
    //     getTimeSheetDetails({ projectId, date, token: userInfo.access.token })
    //   )
    //     .then(() => {
    //       setIsLoading(false);
    //     })
    //     .catch((error) => {
    //       setIsLoading(false);
    //       console.error("Error fetching timesheet details:", error);
    //     });
    // }, []);
  
    // useEffect(() => {
    //   if (projects && projects.length === 0) {
    //     dispatch(getProjects(userInfo?.access?.token));
    //   }
    // }, [projects]);
  
    // const timesheets = timeSheetData?.timesheet;
  
    const getProjectName = (projectId) => {
      const project = projects.find((project) => project.id === projectId);
      return project ? project.projectname : "";
    };
    return (
      <TableWrapper>
        <Table className="">
          <TableHeader className="sticky top-0 bg-gray-200 ">
            <TableRow>
              <TableHead className="bg-gray-100">Date</TableHead>
              <TableHead className="bg-gray-100">Project Name</TableHead>
              <TableHead className="bg-gray-100">Total Hours Requested</TableHead>
              <TableHead className="bg-gray-100">Task</TableHead>
              <TableHead className="bg-gray-100">OverTime</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Loader />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
                <div>Notihng</div>
            //   timesheets &&
            //   timesheets.map((timesheet) => (
            //     <TableRow key={timesheet.id}>
            //       <TableCell>{format(timesheet.date, "dd/MM/yyyy")}</TableCell>
            //       <TableCell>{getProjectName(timesheet.projectId)}</TableCell>
            //       <TableCell className="text-[#9333EA]">
            //         <Badge
            //           className={
            //             "bg-opacity-100 bg-[#F3F1FEFF] text-[#927AF4FF] w-full sm:w-[90%] md:w-[90%] lg:w-[80%] xl:w-[60%] max-w-[90%] p-1 flex justify-center items-center rounded-2xl hover:bg-[#9333EA] hover:text-white"
            //           }
            //         >
            //           {" "}
            //           {timesheet.time || 0} <span className="pl-1 ">Hours</span>{" "}
            //         </Badge>
            //       </TableCell>
            //       <TableCell>{timesheet.task}</TableCell>
            //       <TableCell>
            //         <Badge
            //           className={
            //             "bg-opacity-100 bg-[#F3F1FEFF] text-[#927AF4FF] w-full sm:w-[90%] md:w-[90%] lg:w-[80%] xl:w-[60%] max-w-[90%] p-1 flex justify-center items-center rounded-2xl hover:bg-[#9333EA] hover:text-white"
            //           }
            //         >
            //           {timesheet.time > 37.5
            //             ? `${timesheet.time - 37.5} Hours`
            //             : `0 Hours`}
            //         </Badge>
            //       </TableCell>
            //     </TableRow>
            //   ))
                )}
          </TableBody>
          <TableFooter></TableFooter>
        </Table>
        <div className="flex justify-center pt-8">
          <Button className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 ">
            Submit TimeSheet
          </Button>
        </div>
      </TableWrapper>
    );
  };


export default expenseSheetDetails
