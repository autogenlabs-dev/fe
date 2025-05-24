import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import {
  projectSelector,
  setLoading,
  deleteProject,
} from "../../redux/project/projectSlice";
import {
  getMyProjects,
  getProjects,
  updateProjectStatus,
} from "@/redux/project/projectThunk";
import { authSelector } from "@/redux/auth/authSlice";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ADMIN, DIRECTOR, PROJECT_MANAGER, GENERAL, OPERATIONAL_DIRECTOR } from "@/constants";
import { format } from "date-fns-v3";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "../ui/badge";
import axiosIns from "@/api/axios";
import { Edit2, Trash2 } from "lucide-react";
import LogoImage from "../Layout/LogoImage";

// Custom Modal Component
const CustomModal = ({ isOpen, onClose, onDelete, projectId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-6">Are you sure you want to delete this project?</p>
        <div className="flex justify-end gap-4">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            onClick={() => onDelete(projectId)}
          >
            Yes, Delete
          </button>
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export function ProjectTable() {
  const dispatch = useDispatch();
  const { projects } = useSelector(projectSelector);
  const { userInfo } = useSelector(authSelector);
  const navigate = useNavigate();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);

  const [searchTerm, setSearchTerm] = useState(""); // for client name search
  const [selectedProject, setSelectedProject] = useState("all"); // default to "all"
  const [selectedManager, setSelectedManager] = useState("all"); // default to "all"
console.log(projects, "==projectsprojects");

  useEffect(() => {
    if ([DIRECTOR, PROJECT_MANAGER, GENERAL].includes(userInfo?.roleAccess)) {
      dispatch(getMyProjects(userInfo?.access?.token));
    }
    if ([ADMIN, OPERATIONAL_DIRECTOR].includes(userInfo?.roleAccess)) {
      dispatch(getProjects(userInfo?.access?.token));
    }
  }, [dispatch, userInfo]);

  const filteredProjects = projects?.filter((project) => {
    const matchesClientName =
      searchTerm?.length > 0
        ? project.client_name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
        : true;

    const matchesProjectName =
      selectedProject === "all" || project.id === selectedProject;

    const matchesManager =
      selectedManager === "all" || project?.project_manager_name === selectedManager;

    return matchesClientName && matchesProjectName && matchesManager;
  });

  console.log(filteredProjects, "===filteredProjectsfilteredProjects");
  

  const handleDelete = async (projectId) => {
    const temp = [...projects];
    const index = temp?.findIndex((item) => item.id === projectId);
    if ([ADMIN, OPERATIONAL_DIRECTOR].includes(userInfo?.roleAccess)) {
      temp.splice(index, 1);
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.access?.token}`,
        };
        dispatch(setLoading());
        await axiosIns.delete(`/project/${projectId}`, { headers });
        dispatch(deleteProject(temp));
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    } else {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.access.token}`,
      };
      dispatch(setLoading());
      const body = {};
      await axiosIns.patch(`/project/delete/${projectId}`, body, { headers });
      const updatedProject = { ...temp[index], delete_pending: true };
      temp[index] = updatedProject;
      dispatch(deleteProject(temp));
    }
    setIsModalOpen(false);
  };

  const openModal = (projectId) => {
    setCurrentProjectId(projectId); // Set the correct projectId using closures
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProjectId(null);
  };

  const handleValueChange = (status, projectId) => {
    dispatch(updateProjectStatus({ token: userInfo?.access?.token, projectId, status }));
  };

  return (
    <div className="px-4 pt-4">
      <div className="flex justify-between">
        <LogoImage />
        <div className="w-full flex flex-wrap gap-4 mb-4 justify-end">
          <input
            type="text"
            placeholder="Search by Client Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-md h-9"
          />

          {/* Dropdown for Project Name (use ID for filtering, but display name) */}
          <Select onValueChange={(value) => setSelectedProject(value)} defaultValue="all">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent className="z-[9999]">
              <SelectGroup>
                <SelectItem value="all">All Projects</SelectItem>
                {projects?.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.projectname}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Dropdown for Project Manager */}
          <Select onValueChange={setSelectedManager} defaultValue="all">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Project Managers" />
            </SelectTrigger>
            <SelectContent className="z-[9999]">
              <SelectGroup>
                <SelectItem value="all">All Project Managers</SelectItem>
                {[...new Set(projects?.map((project) => project.project_manager_name))]?.map(
                  (manager, index) => (
                    <SelectItem key={index} value={manager}>
                      {manager}
                    </SelectItem>
                  )
                )}
              </SelectGroup>
            </SelectContent>
          </Select>

          {userInfo?.roleAccess !== GENERAL && (
            <div className="flex justify-end mb-4">
              <Button className="bg-[#002147] hover:bg-[#011c3b]" onClick={() => navigate("/createproject?nb=projects")}>
                Create Project
              </Button>
            </div>
          )}
        </div>
      </div>

      <Table className="pt-8">
        <TableHeader className="sticky top-0 bg-gray-200 h-20">
          <TableRow>
            <TableHead>Project Name</TableHead>
            {userInfo?.roleAccess !== GENERAL && <TableHead>Client Name</TableHead>}
            <TableHead>Project Manager</TableHead>
            <TableHead>Project Director</TableHead>
            {userInfo?.roleAccess !== GENERAL && <TableHead>Budget Level</TableHead>}
            <TableHead>Company</TableHead>
            <TableHead>Project Start date</TableHead>
            <TableHead>Project Finish date</TableHead>
            {userInfo?.roleAccess !== GENERAL && (
              <>
                <TableHead>Multiplier</TableHead>
                <TableHead>Total Budget</TableHead>
                <TableHead>Labour Budget</TableHead>
                <TableHead>Expense Budget</TableHead>
                <TableHead>Labour Effort</TableHead>
                <TableHead>Expense Effort</TableHead>
{/*                 <TableHead>Labour Budget Varience</TableHead> */}
                <TableHead>Labour Expense Varience</TableHead>
                <TableHead>Total Budget Varience</TableHead>
                <TableHead>Completed Percentage %</TableHead>
                <TableHead>Project Status</TableHead>
                <TableHead>Average Hourly Rate</TableHead>
                <TableHead>Actions</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProjects?.map((data, index) => (
            <TableRow 
              onClick={() => {
                if (userInfo?.roleAccess !== GENERAL) navigate(`/projectdetails/${data?.id}`);
              }}
              key={index} className="cursor-pointer h-20">
              <TableCell>{data?.projectname}</TableCell>
              {userInfo?.roleAccess !== GENERAL && <TableCell>{data?.client_name}</TableCell>}
              <TableCell>{data?.project_manager_name}</TableCell>
              <TableCell>{data?.directors?.name || data?.director}</TableCell>
              {userInfo?.roleAccess !== GENERAL && <TableCell>{data?.budget_level}</TableCell>}
              <TableCell>{data?.company}</TableCell>
              <TableCell>{format(new Date(data?.start_date), "dd/MM/yyyy")}</TableCell>
              <TableCell>{format(new Date(data?.finish_date), "dd/MM/yyyy")}</TableCell>
              
              {userInfo?.roleAccess !== GENERAL && (
                <>
                  <TableCell>{data?.multiplier}</TableCell>
                  <TableCell>£{data?.total_fee}</TableCell>
                  <TableCell>£{data?.labour_budget}</TableCell>
                  <TableCell>£{data?.budget}</TableCell>
                  <TableCell>
                    {data?.labour_effort ? `£${data?.labour_effort}` : "£0"}
                  </TableCell>
                  <TableCell>
                    {data?.expense_effort ? `£${data?.expense_effort}` : "£0"}
                  </TableCell>
{/*                   <TableCell className={data?.labour_budget_varience < 0 ? "text-red-500" : ""}>
                    {data?.labour_budget_varience ? `£${data?.labour_budget_varience}` : "£0"}
                  </TableCell> */}
                  <TableCell className={data?.expense_varience < 0 ? "text-red-500" : ""}>
                    {data?.expense_varience ? `£${data?.expense_varience}` : "£0"}
                  </TableCell>
                  <TableCell className={data?.budget_varience < 0 ? "text-red-500" : ""}>
                    {data?.budget_varience ? `£${data?.budget_varience}` : "£0"}
                  </TableCell>
                  <TableCell>{data?.percentage ? `${data?.percentage.toFixed(2)}%` : "0%"}</TableCell>
                  <TableCell>
                    {data?.status === "pending" ? (
                      <Badge className="bg-opacity-100 bg-[#F3F1FEFF] text-[#927AF4FF] w-full p-1 flex justify-center items-center rounded-2xl hover:bg-[#9333EA] hover:text-white">
                        {`Pending`}
                      </Badge>
                    ) : (
                      <Select
                        defaultValue={`${data?.status}`}
                        onValueChange={(value) => handleValueChange(value, data?.id)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent className="z-[999]">
                          <SelectGroup>
                            <SelectItem value="inprogress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell>{data?.avg_rate_multiplier ? `£${data?.avg_rate_multiplier}` : "£0"}</TableCell>
                </>
              )}
              {(userInfo?.roleAccess === ADMIN || userInfo?.roleAccess === OPERATIONAL_DIRECTOR ||
                (userInfo?.roleAccess === DIRECTOR && data?.isOwner) ||
                (userInfo?.roleAccess === PROJECT_MANAGER && data?.isOwner)) && (
                <TableCell>
                  <div className="flex gap-2 items-center justify-center">
                    <div
                      className="p-2 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${data?.id}`);
                      }}
                    >
                      <Edit2 className="text-primary " size={22} />
                    </div>
                    {data?.delete_pending ? (
                      <Badge className="bg-opacity-100 bg-[#F3F1FEFF] text-[#927AF4FF] w-full p-1 flex justify-center items-center rounded-2xl hover:bg-[#9333EA] hover:text-white">
                        {`Delete Pending`}
                      </Badge>
                    ) : (
                      <div
                        className="p-2 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(data?.id); // Open custom modal with project ID
                        }}
                      >
                        <Trash2 className="text-primary " size={22} />
                      </div>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow></TableRow>
        </TableFooter>
      </Table>

      {/* Render Custom Modal */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onDelete={handleDelete}
        projectId={currentProjectId} // Pass the correct project ID
      />
    </div>
  );
}



























// import { useState, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useDispatch, useSelector } from "react-redux";
// import { projectSelector, setLoading, deleteProject } from "../../redux/project/projectSlice";
// import { getMyProjects, getProjects, updateProjectStatus } from "@/redux/project/projectThunk";
// import { authSelector } from "@/redux/auth/authSlice";
// import { Button } from "@/components/ui/button";
// import { useNavigate } from "react-router-dom";
// import { ADMIN, DIRECTOR, PROJECT_MANAGER, GENERAL } from "@/constants";
// import { format } from "date-fns-v3";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Badge } from "../ui/badge";
// import axiosIns from "@/api/axios";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogClose,
// } from "@/components/ui/dialog";
// import { Edit2, Trash2 } from "lucide-react";
// // import logo from "@/assets/Logo_png.png";
// import LogoImage from "../Layout/LogoImage";

// export function ProjectTable() {
//   const dispatch = useDispatch();
//   const { projects } = useSelector(projectSelector);
//   const { userInfo } = useSelector(authSelector);
//   const navigate = useNavigate();

//   // Set initial values to "all"
//   const [searchTerm, setSearchTerm] = useState(""); // for client name search
//   const [selectedProject, setSelectedProject] = useState("all"); // default to "all"
//   const [selectedManager, setSelectedManager] = useState("all"); // default to "all"

//   useEffect(() => {
//     if (userInfo?.roleAccess === DIRECTOR || userInfo?.roleAccess === PROJECT_MANAGER || userInfo?.roleAccess === GENERAL) {
//       dispatch(getMyProjects(userInfo?.access?.token));
//     }
//     if (userInfo?.roleAccess === ADMIN) {
//       dispatch(getProjects(userInfo?.access?.token));
//     }
//   }, [dispatch, userInfo]);

//   const filteredProjects = projects?.filter((project) => {
//     const matchesClientName = searchTerm?.length > 0 ? project.client_name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) : true;
  
//     // Check if "All" is selected or if the project matches the selected project
//     const matchesProjectName = selectedProject === "all" || project.id === selectedProject;
  
//     // Check if "All" is selected or if the project manager matches the selected manager
//     const matchesManager = selectedManager === "all" || project?.project_manager_name === selectedManager;
  
//     return matchesClientName && matchesProjectName && matchesManager;
//   });
  

//   console.log(filteredProjects, "acapcam:filteredProjects");
  

  // const handleValueChange = (status, projectId) => {
  //   dispatch(updateProjectStatus({ token: userInfo?.access?.token, projectId, status }));
  // };

//   const handleDelete = async (projectId) => {
//     const temp = [...projects];
//     const index = temp?.findIndex((item) => item.id === projectId);
//     if (userInfo?.roleAccess === ADMIN) {
//       temp.splice(index, 1);
//       try {
//         const headers = {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${userInfo.access.token}`,
//         };
//         dispatch(setLoading());
//         await axiosIns.delete(`/project/${projectId}`, { headers });
//         dispatch(deleteProject(temp));
//       } catch (error) {
//         console.error("Error deleting project:", error);
//       }
//     } else {
//       const headers = {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${userInfo.access.token}`,
//       };
//       dispatch(setLoading());
//       const body = {};
//       await axiosIns.patch(`/project/${projectId}`, body, { headers });
//       const updatedProject = { ...temp[index], delete_pending: true };
//       temp[index] = updatedProject;
//       dispatch(deleteProject(temp));
//     }
//   };

//   return (
//     <div className="px-4 pt-4">
//       <div className="flex justify-between">
//         <LogoImage />
//         <div className="w-full flex flex-wrap gap-4 mb-4 justify-end">
//           <input
//             type="text"
//             placeholder="Search by Client Name"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="border p-2 rounded-md h-9"
//           />

//           {/* Dropdown for Project Name (use ID for filtering, but display name) */}
//           <Select onValueChange={(value) => setSelectedProject(value)} defaultValue="all">
//             <SelectTrigger className="w-[200px]">
//               <SelectValue placeholder="All Projects" />
//             </SelectTrigger>
//             <SelectContent className="z-[9999]">
//               <SelectGroup>
//                 <SelectItem value="all">All Projects</SelectItem> {/* "All" option */}
//                 {projects?.map((project) => (
//                   <SelectItem key={project.id} value={project.id}>
//                     {project.projectname}
//                   </SelectItem>
//                 ))}
//               </SelectGroup>
//             </SelectContent>
//           </Select>

//           {/* Dropdown for Project Manager */}
//           <Select onValueChange={setSelectedManager} defaultValue="all">
//             <SelectTrigger className="w-[200px]">
//               <SelectValue placeholder="All Project Managers" />
//             </SelectTrigger>
//             <SelectContent className="z-[9999]">
//               <SelectGroup>
//                 <SelectItem value="all">All Project Managers</SelectItem> {/* "All" option */}
//                 {[...new Set(projects?.map((project) => project.project_manager_name))]?.map((manager, index) => (
//                   <SelectItem key={index} value={manager}>
//                     {manager}
//                   </SelectItem>
//                 ))}
//               </SelectGroup>
//             </SelectContent>
//           </Select>

//           {userInfo?.roleAccess !== GENERAL && (
//             <div className="flex justify-end mb-4">
//               <Button className="bg-[#002147] hover:bg-[#011c3b]" onClick={() => navigate("/createproject?nb=projects")}>
//                 Create Project
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>

//       <Table className="pt-8">
//         <TableHeader className="sticky top-0 bg-gray-200 h-20">
//           <TableRow>
//             <TableHead>Project Name</TableHead>
//             {userInfo?.roleAccess !== GENERAL && <TableHead>Client Name</TableHead>}
//             <TableHead>Project Manager</TableHead>
//             <TableHead>Project Director</TableHead>
//             {userInfo?.roleAccess !== GENERAL && <TableHead>Budget Level</TableHead>}
//             <TableHead>Company</TableHead>
//             <TableHead>Project Start date</TableHead>
//             <TableHead>Project Finish date</TableHead>
//             {userInfo?.roleAccess !== GENERAL && (
//               <>
//                 <TableHead>Multiplier</TableHead>
//                 <TableHead>Total Budget</TableHead>
//                 <TableHead>Labour Budget</TableHead>
//                 <TableHead>Expense Budget</TableHead>
//                 <TableHead>Labour Effort</TableHead>
//                 <TableHead>Expense Effort</TableHead>
//                 <TableHead>Labour Budget Varience</TableHead>
//                 <TableHead>Labour Expense Varience</TableHead>
//                 <TableHead>Total Budget Varience</TableHead>
//                 <TableHead>Completed Percentage %</TableHead>
//                 <TableHead>Project Status</TableHead>
//                 <TableHead>Average Hourly Rate</TableHead>
//                 <TableHead>Actions</TableHead>
//               </>
//             )}
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {filteredProjects?.map((data, index) => (
//             <TableRow
//               key={index}
//               onClick={() => {
//                 if (userInfo?.roleAccess !== GENERAL) navigate(`/projectdetails/${data?.id}`);
//               }}
//               className="cursor-pointer h-20"
//             >
//               <TableCell>{data?.projectname}</TableCell>
//               {userInfo?.roleAccess !== GENERAL && <TableCell>{data?.client_name}</TableCell>}
//               <TableCell>{data?.project_manager_name}</TableCell>
//               <TableCell>{data?.director}</TableCell>
//               {userInfo?.roleAccess !== GENERAL && <TableCell>{data?.budget_level}</TableCell>}
//               <TableCell>{data?.company}</TableCell>
//               <TableCell>{format(new Date(data?.start_date), "dd/MM/yyyy")}</TableCell>
//               <TableCell>{format(new Date(data?.finish_date), "dd/MM/yyyy")}</TableCell>
              
//               {userInfo?.roleAccess !== GENERAL && (
//                 <>
//                   <TableCell>{data?.multiplier}</TableCell>
//                   <TableCell>£{data?.total_fee}</TableCell>
//                   <TableCell>£{data?.labour_budget}</TableCell>
//                   <TableCell>£{data?.budget}</TableCell>
//                   <TableCell>
//                     {data?.labour_effort ? `£${data?.labour_effort}` : "£0"}
//                   </TableCell>
//                   <TableCell>
//                     {data?.expense_effort ? `£${data?.expense_effort}` : "£0"}
//                   </TableCell>
//                   <TableCell
//                     className={
//                       data?.labour_budget_varience < 0 ? "text-red-500" : ""
//                     }
//                   >
//                     {data?.labour_budget_varience ? `£${data?.labour_budget_varience}` : "£0"}
//                   </TableCell>
//                   <TableCell
//                     className={
//                       data?.labour_expense_varience < 0 ? "text-red-500" : ""
//                     }
//                   >
//                     {data?.labour_expense_varience ? `£${data?.labour_expense_varience}` : "£0"}
//                   </TableCell>
//                   <TableCell
//                     className={data?.budget_varience < 0 ? "text-red-500" : ""}
//                   >
//                     {data?.budget_varience ? `£${data?.budget_varience}` : "£0"}
//                   </TableCell>
//                   <TableCell>
//                     {data?.percentage ? `${data?.percentage}%` : "0%"}
//                   </TableCell>
//                   <TableCell>
//                     {data?.status === "pending" ? (
//                       <Badge
//                         className={
//                           "bg-opacity-100 bg-[#F3F1FEFF] text-[#927AF4FF] w-full p-1 flex justify-center items-center rounded-2xl hover:bg-[#9333EA] hover:text-white"
//                         }
//                       >
//                         {`Pending`}
//                       </Badge>
//                     ) : (
//                       <Select
//                         defaultValue={`${data?.status}`}
//                         onValueChange={(value) => handleValueChange(value, data?.id)}
//                       >
//                         <SelectTrigger className="w-[140px]">
//                           <SelectValue placeholder="Select Status" />
//                         </SelectTrigger>
//                         <SelectContent className="z-[999]">
//                           <SelectGroup>
//                             <SelectItem value="inprogress">In Progress</SelectItem>
//                             <SelectItem value="completed">Completed</SelectItem>
//                             <SelectItem value="rejected">Rejected</SelectItem>
//                           </SelectGroup>
//                         </SelectContent>
//                       </Select>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     {data?.avg_rate_multiplier ? `£${data?.avg_rate_multiplier}` : "£0"}
//                   </TableCell>
//                 </>
//               )}
//               {(userInfo?.roleAccess === ADMIN ||
//                 (userInfo?.roleAccess === DIRECTOR && data?.isOwner) ||
//                 (userInfo?.roleAccess === PROJECT_MANAGER && data?.isOwner)) && (
//                 <TableCell>
//                   <div className="flex gap-2 items-center justify-center">
//                     <div
//                       className="p-2 cursor-pointer"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         navigate(`/projects/${data?.id}`);
//                       }}
//                     >
//                       <Edit2 className="text-primary " size={22} />
//                     </div>
//                     {data?.delete_pending ? (
//                       <Badge
//                         className={
//                           "bg-opacity-100 bg-[#F3F1FEFF] text-[#927AF4FF] w-full p-1 flex justify-center items-center rounded-2xl hover:bg-[#9333EA] hover:text-white"
//                         }
//                       >
//                         {`Delete Pending`}
//                       </Badge>
//                     ) : (
//                       <Dialog>
//                         <DialogTrigger asChild>
//                           <div
//                             className="p-2 cursor-pointer"
//                             onClick={(e) => e.stopPropagation()}
//                           >
//                             <Trash2 className="text-primary " size={22} />
//                           </div>
//                         </DialogTrigger>
//                         <DialogContent className="sm:max-w-[425px]">
//                           <DialogHeader>
//                             <DialogTitle>
//                               Are you sure you want to delete this project?
//                             </DialogTitle>
//                           </DialogHeader>
//                           <DialogFooter className="pt-10">
//                             <DialogClose asChild>
//                               <Button
//                                 type="button"
//                                 className="text-white bg-[red] hover:bg-[red]"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleDelete(data?.id);
//                                 }}
//                               >
//                                 Yes
//                               </Button>
//                             </DialogClose>
//                             <DialogClose asChild>
//                               <Button
//                                 type="button"
//                                 className="text-[black] bg-[#E2E8F0] hover:bg-[#E2E8F0]"
//                                 onClick={(e) => e.stopPropagation()}
//                               >
//                                 No
//                               </Button>
//                             </DialogClose>
//                           </DialogFooter>
//                         </DialogContent>
//                       </Dialog>
//                     )}
//                   </div>
//                 </TableCell>
//               )}
//             </TableRow>
//           ))}
//         </TableBody>

//         <TableFooter>
//           <TableRow></TableRow>
//         </TableFooter>
//       </Table>
//     </div>
//   );
// }
