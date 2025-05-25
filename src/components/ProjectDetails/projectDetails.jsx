import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { projectSelector } from "../../redux/project/projectSlice";
import { getProjects } from "@/redux/project/projectThunk";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "@/redux/auth/authSlice";
import { Button } from "@/components/ui/button";
import axiosIns from "@/api/axios";
import { MultiSelect } from "@/components/ui/multi-select";
import Loader from "../loader";
import { ADMIN, DIRECTOR, PROJECT_MANAGER, GENERAL, OPERATIONAL_DIRECTOR } from "@/constants";
import { ArrowLeft, DeleteIcon, Trash2 } from "lucide-react";

const ProjectDetails = () => {
  const { projects } = useSelector(projectSelector);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [alreadyAddedMember, setAlreadyAddedMember] = useState([]);
  const [subordinates, setSubordinates] = useState([]);
  const { userInfo } = useSelector(authSelector);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTimeSheet, setLoadingTimeSheet] = useState(false);
  const [timeSheet, setTimeSheet] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // const getCurrentProjectMember = async () => {
  //   console.log(id);
  //   const headers = {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${userInfo.access.token}`,
  //   };
  //   const { data } = await axiosIns.get(`/project/members/${id}`, {
  //     headers,
  //   });

  //   console.log(data, '==canajsncjasnasncnsnsjn');
  //   const memIds = data.members?.map(mem => mem.memberId);
  //   setSelected(memIds);
  // }

  const getTimesheetByProjId = async (projId) => {
    try {
      setLoadingTimeSheet(true);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo?.access?.token}`,
      };
      const { data } = await axiosIns.get(`/timesheet/project/${projId}`, {
        headers,
      });
      // console.log(data, " =ckancasnscanjsjsacn");
      setTimeSheet(data.data);
      setLoadingTimeSheet(false);
    } catch (error) {
      setLoadingTimeSheet(false);
    }
  }

  useEffect(() => {
    if (projects && projects.length > 0 && id) {
      const project = projects.find((project) => project.id === +id);
      getTimesheetByProjId(project.id);
      setSelectedProject(project);
    } else {
      dispatch(getProjects(userInfo?.access?.token));
    }
  }, [projects, id]);


  const handleSubmit = async () => {
    if (selected.length === 0) {
      return;
    }

    // console.log(selected, "===ac=scsasnselectedselected");


    try {
      setLoading(true);
      const body = {
        members: selected,
        projectId: selectedProject?.id,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.access.token}`,
      };
      await axiosIns.post(`/project/members`, body, {
        headers,
      });
      setSelected([]);
      if (userInfo?.roleAccess === ADMIN || userInfo?.roleAccess === OPERATIONAL_DIRECTOR) {
        await fetchSubordinates(`/user/available/${id}`);
      } else if (
        userInfo?.roleAccess === DIRECTOR ||
        userInfo?.roleAccess === PROJECT_MANAGER
      ) {
        await fetchSubordinates(`/user/subordinates/available/${id}`);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching subordinates:", error);
    }
  };

  const fetchSubordinates = async (url) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.access.token}`,
      };
      const { data } = await axiosIns.get(`${url}`, {
        headers,
      });

      console.log(data, "=====subancjacjsjncjancjsa");

      setSubordinates(data.users);
      setAlreadyAddedMember(data.members.filter(mem => mem != null));
      setSelected(data?.members?.filter(mem => mem != null)?.map(mem => mem?.id));
    } catch (error) {
      console.error("Error fetching subordinates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (userInfo?.roleAccess === ADMIN || userInfo?.roleAccess === OPERATIONAL_DIRECTOR) {
      fetchSubordinates(`/user/available/${id}`);
    } else if (
      userInfo?.roleAccess === DIRECTOR ||
      userInfo?.roleAccess === PROJECT_MANAGER
    ) {
      fetchSubordinates(`/user/subordinates/available/${id}`);
    }
    // getCurrentProjectMember();
  }, []);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo?.access?.token}`,
      };
      const { data } = await axiosIns.delete(`/timesheet/delete-dir-admin/${deleteId}`, {
        headers,
      });
      
      const updatedSheet = timeSheet.filter(sh => sh.id != deleteId);
      setTimeSheet(updatedSheet);
      
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.log(error);
    }
  }

  const options = subordinates?.map((user) => ({
    id: user.id,
    name: user.name,
  }));

  console.log(options, '==subordinates');

  const DeleteModal = ({ isOpen, onClose, onDelete, isDeleting }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]">
        <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
          <h2 className="text-lg font-semibold">Are you sure you want to delete?</h2>
          <div className="mt-4 flex gap-6 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              disabled={isDeleting}
              onClick={onDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              {isDeleting ? "Deleting": "Delete"}
            </button>
          </div>
        </div>
      </div>
    );  };

  return (
    <div className="w-full max-w-screen-lg mx-auto py-10">
      {/* Header */}
      {/* <h1 className="text-4xl font-bold text-center mb-10">Project Details</h1> */}
      <DeleteModal 
        isOpen={showDeleteModal} 
        isDeleting={isDeleting}
        onClose={()=>setShowDeleteModal(false)} 
        onDelete={handleDelete} 
      />
      {/* Project Overview Section */}
      <div className="bg-white shadow-lg rounded-lg p-8 mb-10">
        <div className="flex items-center gap-4 mb-6 border-b pb-4">
          <ArrowLeft className="text-main hover:text-main/90 cursor-pointer" onClick={() => navigate(-1)} />
          <h2 className="text-2xl font-semibold">Project Overview</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500 text-sm font-semibold">Project Name</p>
            <p className="text-lg mt-1">{selectedProject?.projectname || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Labour Budget</p>
            <p className="text-lg mt-1">{selectedProject?.labour_budget || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Total Fee</p>
            <p className="text-lg mt-1">{selectedProject?.total_fee || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Expense Budget</p>
            <p className="text-lg mt-1">{selectedProject?.budget_level || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Multiplier</p>
            <p className="text-lg mt-1">{selectedProject?.multiplier || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Chargeable Project</p>
            <p className="text-lg mt-1">{selectedProject?.chargeable_project ? "Yes" : "No"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Client</p>
            <p className="text-lg mt-1">{selectedProject?.client_name || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Project Manager</p>
            <p className="text-lg mt-1">{selectedProject?.project_manager_name || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Project Director</p>
            <p className="text-lg mt-1">{selectedProject?.director || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Organization</p>
            <p className="text-lg mt-1">{selectedProject?.organization || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Company</p>
            <p className="text-lg mt-1">{selectedProject?.company || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Work Type</p>
            <p className="text-lg mt-1">{selectedProject?.work_type || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">PO NO</p>
            <p className="text-lg mt-1">{selectedProject?.po_number || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Client Contact Name</p>
            <p className="text-lg mt-1">{selectedProject?.client_name || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Client Contact Title</p>
            <p className="text-lg mt-1">{selectedProject?.client_title || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Client Contact Phone</p>
            <p className="text-lg mt-1">{selectedProject?.client_phone || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Client Contact Email</p>
            <p className="text-lg mt-1">{selectedProject?.client_contact_email || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Team Management Section */}
      {userInfo?.roleAccess !== GENERAL && (
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-4">Manage Team Members</h2>
          <div className="flex justify-center items-center flex-col">
            {loading ? (
              <Loader />
            ) : (
              <>
                {options.length > 0 ? (
                  <>
                    <MultiSelect
                      options={[...options, ...alreadyAddedMember]}
                      selected={selected}
                      onChange={setSelected}
                      className="w-full max-w-md"
                      placeholder="Select Team Members"
                    />
                    {selected.length > 0 && (
                      <div className="mt-6 text-center">
                        <Button
                          className="bg-main text-white hover:bg-main/90 px-6 py-2 rounded-lg"
                          onClick={handleSubmit}
                        >
                          Add Members
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 text-center">No more team members to add</p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {userInfo?.roleAccess !== GENERAL && (
        <div className="bg-white shadow-lg rounded-lg p-8 mt-3">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-4">TimeSheet</h2>
          <div className="flex justify-center items-center flex-col">
            {loadingTimeSheet ? (
              <Loader />
            ) : !loadingTimeSheet && timeSheet.length === 0 ?
              (<p>No TimeSheet Found. </p>)
            :(
            <div className="w-full overflow-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="border border-gray-300 px-4 py-2">User</th>
                    <th className="border border-gray-300 px-4 py-2">Role</th>
                    <th className="border border-gray-300 px-4 py-2">Time (Hours)</th>
                    <th className="border border-gray-300 px-4 py-2">Date</th>
                    <th className="border border-gray-300 px-4 py-2">Description</th>
                    <th className="border border-gray-300 px-4 py-2">Approval Status</th>
                    <th className="border border-gray-300 px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {timeSheet?.map((entry, index) => (
                    <tr
                      key={entry.id}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="border border-gray-300 px-4 py-2">{entry.user?.name || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-2">{entry.user?.access || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-2">{entry.time}</td>
                      <td className="border border-gray-300 px-4 py-2">{new Date(entry.date).toLocaleDateString()}</td>
                      <td className="border border-gray-300 px-4 py-2">{entry.privateDescription}</td>
                      <td className="border border-gray-300 px-4 py-2">{entry.approvalStatus}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Trash2 className="text-red-600 hover:text-red-800" onClick={()=>{setDeleteId(entry.id); setShowDeleteModal(true)}} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;





























// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { projectSelector } from "../../redux/project/projectSlice";
// import { getProjects } from "@/redux/project/projectThunk";
// import { useDispatch, useSelector } from "react-redux";
// import { authSelector } from "@/redux/auth/authSlice";
// import { Button } from "@/components/ui/button";
// import axiosIns from "@/api/axios";
// import { MultiSelect } from "@/components/ui/multi-select";
// import Loader from "../loader";
// import { ADMIN, DIRECTOR, PROJECT_MANAGER, GENERAL } from "@/constants";

// const ProjectDetails = () => {
//   const { projects } = useSelector(projectSelector);
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [subordinates, setSubordinates] = useState([]);
//   const { userInfo } = useSelector(authSelector);
//   const [selected, setSelected] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (projects && projects.length > 0) {
//       const project = projects.find((project) => project.id === +id);
//       setSelectedProject(project);
//     } else {
//       dispatch(getProjects(userInfo?.access?.token));
//     }
//   }, [projects, id]);

//   const handleSubmit = async () => {
//     if (selected.length === 0) {
//       return;
//     }

//     try {
//       setLoading(true);
//       const body = {
//         members: selected,
//         projectId: selectedProject.id,
//       };
//       const headers = {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${userInfo.access.token}`,
//       };
//       await axiosIns.post(`/project/members`, body, {
//         headers,
//       });
//       setSelected([]);
//       if (userInfo?.roleAccess === ADMIN) {
//         await fetchSubordinates(`/user/available/${id}`);
//       } else if (
//         userInfo?.roleAccess === DIRECTOR ||
//         userInfo?.roleAccess === PROJECT_MANAGER
//       ) {
//         await fetchSubordinates(`/user/subordinates/available/${id}`);
//       }
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching subordinates:", error);
//     }
//   };

//   const fetchSubordinates = async (url) => {
//     try {
//       const headers = {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${userInfo.access.token}`,
//       };
//       const { data } = await axiosIns.get(`${url}`, {
//         headers,
//       });
//       setSubordinates(data.users);
//     } catch (error) {
//       console.error("Error fetching subordinates:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     setLoading(true);
//     if (userInfo?.roleAccess === ADMIN) {
//       fetchSubordinates(`/user/available/${id}`);
//     } else if (
//       userInfo?.roleAccess === DIRECTOR ||
//       userInfo?.roleAccess === PROJECT_MANAGER
//     ) {
//       fetchSubordinates(`/user/subordinates/available/${id}`);
//     }
//   }, []);

//   const options = subordinates.map((user) => ({
//     id: user.id,
//     name: user.name,
//   }));

//   return (
//     <div className="flex flex-col w-full items-center">
//       <div className="p-10 w-full max-w-7xl">
//         <h2 className="text-3xl font-bold text-center mb-8">Project Details</h2>

//         {/* Project Information Section */}
//         <div className="bg-white shadow-md rounded-lg p-6 mb-10">
//           <h3 className="text-2xl font-semibold mb-4">General Information</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
//             <div>
//               <label className="font-medium">Project Name</label>
//               <p className="pt-2">{selectedProject?.projectname}</p>
//             </div>
//             <div>
//               <label className="font-medium">Labour Budget</label>
//               <p className="pt-2">{selectedProject?.labour_budget}</p>
//             </div>
//             <div>
//               <label className="font-medium">Total Fee</label>
//               <p className="pt-2">{selectedProject?.total_fee}</p>
//             </div>
//             <div>
//               <label className="font-medium">Expense Budget</label>
//               <p className="pt-2">{selectedProject?.budget_level}</p>
//             </div>
//             <div>
//               <label className="font-medium">Multiplier</label>
//               <p className="pt-2">{selectedProject?.multiplier}</p>
//             </div>
//             <div>
//               <label className="font-medium">Chargeable Project</label>
//               <p className="pt-2">{selectedProject?.chargeable_project ? "Yes" : "No"}</p>
//             </div>
//             <div>
//               <label className="font-medium">Client</label>
//               <p className="pt-2">{selectedProject?.client_name}</p>
//             </div>
//             <div>
//               <label className="font-medium">Project Manager</label>
//               <p className="pt-2">{selectedProject?.project_manager_name}</p>
//             </div>
//             <div>
//               <label className="font-medium">Project Director</label>
//               <p className="pt-2">{selectedProject?.director}</p>
//             </div>
//             <div>
//               <label className="font-medium">Organization</label>
//               <p className="pt-2">{selectedProject?.organization}</p>
//             </div>
//             <div>
//               <label className="font-medium">Company</label>
//               <p className="pt-2">{selectedProject?.company}</p>
//             </div>
//             <div>
//               <label className="font-medium">Work Type</label>
//               <p className="pt-2">{selectedProject?.work_type}</p>
//             </div>
//             <div>
//               <label className="font-medium">PO NO</label>
//               <p className="pt-2">{selectedProject?.po_number}</p>
//             </div>
//             <div>
//               <label className="font-medium">Client Contact Name</label>
//               <p className="pt-2">{selectedProject?.client_name}</p>
//             </div>
//             <div>
//               <label className="font-medium">Client Contact Title</label>
//               <p className="pt-2">{selectedProject?.client_title}</p>
//             </div>
//             <div>
//               <label className="font-medium">Client Contact Phone</label>
//               <p className="pt-2">{selectedProject?.client_phone}</p>
//             </div>
//             <div>
//               <label className="font-medium">Client Contact Email</label>
//               <p className="pt-2">{selectedProject?.client_contact_email}</p>
//             </div>
//           </div>
//         </div>

//         {/* Team Management Section */}
//         {userInfo?.roleAccess !== GENERAL && (
//           <div className="bg-white shadow-md rounded-lg p-6">
//             <h3 className="text-2xl font-semibold mb-4">Manage Team Members</h3>
//             <div className="flex flex-col justify-center items-center">
//               {loading ? (
//                 <Loader />
//               ) : (
//                 <>
//                   {options.length > 0 ? (
//                     <>
//                       <MultiSelect
//                         options={options}
//                         selected={selected}
//                         onChange={setSelected}
//                         className="w-[360px] z-[99999]"
//                         placeholder="Add Team Members"
//                       />
//                       {selected.length > 0 && (
//                         <div className="mt-6">
//                           <Button className="bg-main hover:bg-main/90" onClick={handleSubmit}>
//                             Add Members
//                           </Button>
//                         </div>
//                       )}
//                     </>
//                   ) : (
//                     <p>No more team members to add</p>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProjectDetails;































// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { projectSelector } from "../../redux/project/projectSlice";
// import { getProjects } from "@/redux/project/projectThunk";
// import { useDispatch, useSelector } from "react-redux";
// import { authSelector } from "@/redux/auth/authSlice";
// import Navbar from "@/Header/Navbar";
// import Sidebar from "@/components/SideBar/Sidebar";
// import { Button } from "@/components/ui/button";
// import axiosIns from "@/api/axios";
// import { MultiSelect } from "@/components/ui/multi-select";
// import { ADMIN, DIRECTOR, PROJECT_MANAGER, GENERAL } from "@/constants";
// import Loader from "../loader";

// const ProjectDetails = () => {
//   const { projects } = useSelector(projectSelector);
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [subordinates, setSubordinates] = useState([]);
//   const { userInfo } = useSelector(authSelector);
//   const [selected, setSelected] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (projects && projects.length > 0) {
//       const project = projects.find((project) => project.id === +id);
//       setSelectedProject(project);
//     } else {
//       dispatch(getProjects(userInfo?.access?.token));
//     }
//   }, [projects, id]);

//   // console.log("selectedProject", selectedProject);

//   const handleSubmit = async () => {
//     if (selected.length === 0) {
//       return;
//     }

//     try {
//       setLoading(true);
//       const body = {
//         members: selected,
//         projectId: selectedProject.id,
//       };
//       const headers = {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${userInfo.access.token}`,
//       };
//       await axiosIns.post(`/project/members`, body, {
//         headers,
//       });
//       setSelected([]);
//       if (userInfo?.roleAccess === ADMIN) {
//         await fetchSubordinates(`/user/available/${id}`);
//       } else if (
//         userInfo?.roleAccess === DIRECTOR ||
//         userInfo?.roleAccess === PROJECT_MANAGER
//       ) {
//         await fetchSubordinates(`/user/subordinates/available/${id}`);
//       }
//       setLoading(false);

//     } catch (error) {
//       console.error("Error fetching subordinates:", error);
//     }
//   };

//   const fetchSubordinates = async (url) => {
//     try {
//       const headers = {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${userInfo.access.token}`,
//       };
//       const { data } = await axiosIns.get(`${url}`, {
//         headers,
//       });
//       // console.log("subordinates", data.users);
//       setSubordinates(data.users);
//     } catch (error) {
//       console.error("Error fetching subordinates:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     setLoading(true);
//     if (userInfo?.roleAccess === ADMIN) {
//       fetchSubordinates(`/user/available/${id}`);
//     } else if (
//       userInfo?.roleAccess === DIRECTOR ||
//       userInfo?.roleAccess === PROJECT_MANAGER
//     ) {
//       fetchSubordinates(`/user/subordinates/available/${id}`);
//     }
//   }, []);

//   const options = subordinates.map((user) => ({
//     id: user.id,
//     name: user.name,
//   }));

//   // // console.log("options", options);

//   // // console.log("selected", selected);

//   return (
//     <>
//       <div className="flex flex-col w-full items-center">
//         {/* <h1 className="text-center text-2xl font-semibold my-10">Project Details</h1> */}
//         <div className="p-10 w-[75%]">
//           <div className="flex gap-10 text-xl font-semibold">
//             <div className="w-1/2">
//               <label className="">Project Name </label>
//               <p className="text-lg pt-4 font-normal">
//                 {selectedProject?.projectname}
//               </p>
//             </div>
//             {/* <div className="w-1/2">
//               <label className="">Project Code </label>
//               <p className="text-lg pt-4 font-normal">
//                 {selectedProject?.projectcode}
//               </p>
//             </div> */}
//           </div>
//           <div className="flex gap-10 text-xl font-semibold pt-6">
//             <div className="w-1/2">
//               <label className="">Labour Budget</label>
//               <p className="text-lg pt-4 font-normal">
//                 {selectedProject?.labour_budget}
//               </p>
//             </div>
//             <div className="w-1/2">
//               <label className="">Total Fee</label>
//               <p className="text-lg pt-4 font-normal">
//                 {selectedProject?.total_fee}
//               </p>
//             </div>
//           </div>
//           <div className="flex gap-10 text-xl font-semibold pt-6">
//             <div className="w-1/2">
//               <label className="">Expense Budget</label>
//               <p className="text-lg pt-4 font-normal">
//                 {selectedProject?.budget_level}
//               </p>
//             </div>
//             <div className="w-1/2">
//               <label className="">Multiplier</label>
//               <p className="text-lg pt-4 font-normal">
//                 {selectedProject?.multiplier}
//               </p>
//             </div>
//           </div>
//           <div className="flex gap-10 text-xl font-semibold pt-6">
//             <div className="w-1/2">
//               <label className="">Chargeable Project</label>
//               <p className="text-lg pt-4 font-normal">
//                 {selectedProject?.chargeable_project ? "Yes" : "No"}
//               </p>
//             </div>
//             <div className="w-1/2">
//               <label className="">Client</label>
//               <p className="text-lg pt-4 font-normal">
//                 {selectedProject?.client_name}
//               </p>
//             </div>
//           </div>
//           <div className="flex gap-10 text-xl font-semibold pt-6">
//             <div className="w-1/2">
//               <label className="">Project Manager</label>
//               <p className="text-lg pt-4 font-normal">
//                 {selectedProject?.project_manager_name}
//               </p>
//             </div>
//             <div className="w-1/2">
//               <label className="">Project Director</label>
//               <p className="text-lg pt-4 font-normal">
//                 {selectedProject?.director}
//               </p>
//             </div>
//           </div>
//           <div className="flex gap-10 text-xl font-semibold pt-6">
//             <div className="w-1/2">
//               <label className="">Organization</label>
//               <p className="text-lg pt-4 font-normal">
//                 {selectedProject?.organization}
//               </p>
//             </div>
//             <div className="w-1/2">
//               <label className="">Company</label>
//               <p className="text-lg pt-4 font-normal">
//                 {selectedProject?.company}
//               </p>
//             </div>
//           </div>
//           <div className="flex gap-10 text-xl font-semibold pt-6">
//             <div className="w-1/2">
//               <label className="">Work Type</label>
//               <p className="text-lg pt-4 font-normal">
//                 {selectedProject?.work_type}
//               </p>
//             </div>
//             <div className="w-1/2">
//               <label className="">PO NO</label>
//               <p className="text-lg pt-4 font-normal">
//                 {selectedProject?.po_number}
//               </p>
//             </div>
//           </div>
//           <div className="flex gap-10 text-xl font-semibold pt-6">
//             <div className="w-1/2">
//               <label className="">Client Contact Name</label>
//               <p className="text-lg pt-4 font-normal">
//                 {selectedProject?.client_name}
//               </p>
//             </div>
//             <div className="w-1/2">
//               <label className="">Client Contact Title</label>
//               <p className="text-lg pt-4 font-normal">
//                 {selectedProject?.client_title}
//               </p>
//             </div>
//           </div>
//           <div className="flex gap-10 text-xl font-semibold pt-6">
//             <div className="w-1/2">
//               <label className="">Client Contact phone</label>
//               <p className="text-lg pt-4 font-normal">
//                 {selectedProject?.client_phone}
//               </p>
//             </div>
//             <div className="w-1/2">
//               <label className="">Client Contact email</label>
//               <p className="text-lg pt-4 font-normal">
//                 {selectedProject?.client_contact_email}
//               </p>
//             </div>
//           </div>
//         </div>
//         {userInfo?.roleAccess !== GENERAL && (
//           <div className="flex justify-center items-center flex-col mt-10 gap-4">
//             <legend className="text-lg font-medium">Add Team Members</legend>
//             {loading ? (
//               <Loader />
//             ) : (
//               <div className="mb-10">
//                 {options.length > 0 ? (
//                   <>
//                     <MultiSelect
//                       options={options}
//                       selected={selected}
//                       onChange={setSelected}
//                       className="w-[360px] z-[99999]"
//                       placeholder={"Add Team Members"}
//                     />
//                     {selected.length > 0 && (
//                       <div className="flex justify-center mt-4">
//                         <Button className="bg-main hover:bg-main/90" onClick={handleSubmit}>Add Members</Button>
//                       </div>
//                     )}
//                   </>
//                 ) : (
//                   <p>No more team members to add</p>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default ProjectDetails;
