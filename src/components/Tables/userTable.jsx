import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  addUser,
  userSelector,
  deleteUser,
  setLoading,
} from "../../redux/User/userSlice";
import { getSubordinates, getUsers } from "@/redux/User/userThunk";
import { authSelector } from "@/redux/auth/authSlice";
import axiosIns from "@/api/axios";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ADMIN, DIRECTOR, OPERATIONAL_DIRECTOR, PROJECT_MANAGER } from "@/constants";

const UserTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(userSelector);
  const { userInfo } = useSelector(authSelector);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null); // Store the user ID to delete
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [selectedTeam, setSelectedTeam] = useState("all"); // Dropdown state for team selection

  console.log(user, "===useruseruser");
  

  const handleDelete = async () => {
    // Only proceed if a userId is selected
    if (!userIdToDelete) return;

    setIsDeleting(true);
    const temp = [...user];
    const index = temp.findIndex((item) => item.id === userIdToDelete);
    temp.splice(index, 1);

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.access.token}`,
      };
      dispatch(setLoading());
      await axiosIns.delete(`/user/${userIdToDelete}`, { headers });
      dispatch(deleteUser(temp));
      setIsDeleteModalOpen(false); // Close modal after deletion
      setUserIdToDelete(null); // Reset the ID
      setIsDeleting(false);
    } catch (error) {
      console.log(error, "=error");
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if ([PROJECT_MANAGER].includes(userInfo?.roleAccess)) {
      dispatch(getSubordinates({ token: userInfo?.access?.token, path: 'subordinates'}));
    }
    if (DIRECTOR == userInfo?.roleAccess) {
      dispatch(getSubordinates({ token: userInfo?.access?.token, path: 'subordinates-for-director'}));
    }
    if ([ADMIN, OPERATIONAL_DIRECTOR].includes(userInfo?.roleAccess)) {
      dispatch(getUsers(userInfo?.access?.token));
    }
  }, [dispatch, userInfo]);

  // Filter users based on search term and selected team
  const filteredUsers = user?.filter((userData) => {
    const matchesSearch = searchTerm?.length > 0 ? userData?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) : true;
    const matchesTeam = selectedTeam === "all" || userData.team === selectedTeam;
    return matchesSearch && matchesTeam;
  });

  // console.log(filteredUsers, "=acjnasjsacancsjac");
  

  const DeleteModal = () => (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${isDeleteModalOpen ? "" : "hidden"}`}>
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this user?</h2>
        <div className="flex justify-end space-x-4">
          <button
            disabled={isDeleting}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={handleDelete}
          >
            {isDeleting ? "Deleting": "Yes"}
          </button>
          <button
            disabled={isDeleting}
            className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
            onClick={() => {
              setIsDeleteModalOpen(false);
              setUserIdToDelete(null); // Reset the ID on cancel
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Search and filter section */}
      <div className="flex flex-wrap gap-4 mb-4 justify-end pt-2">
        {/* Search input */}
        <input
          type="text"
          placeholder="Search by Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-md h-9"
        />

        {/* Dropdown for Team */}
        <Select onValueChange={setSelectedTeam} defaultValue="all">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Teams" />
          </SelectTrigger>
          <SelectContent className="z-[9999]">
            <SelectGroup>
              <SelectItem value="all">All Teams</SelectItem> {/* "All" option */}
              {[...new Set(user?.map((userData) => userData.team))]?.map((team, index) => (
                <SelectItem key={index} value={team}>
                  {team}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {(userInfo?.roleAccess === ADMIN) && (
          <div>
            <Button className="bg-[#002147] hover:bg-[#011c3b]" onClick={() => navigate("/createuser")}>
              Create User
            </Button>
          </div>
        )}
      </div>

      <Table>
        <TableHeader className="sticky top-0 bg-gray-200 p-20">
          <TableRow>
            <TableHead>User Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Access</TableHead>
            <TableHead>Line Manager</TableHead>
            <TableHead>Blended Rate</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Company</TableHead>
            {[OPERATIONAL_DIRECTOR, ADMIN].includes(userInfo?.roleAccess) && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers?.map((userData, index) => {
            return (
              <TableRow key={userData.name + index}>
                <TableCell>{userData.id}</TableCell>
                <TableCell className="font-medium">{userData.name}</TableCell>
                <TableCell>{userData.team}</TableCell>
                <TableCell>{userData.roleAccess || userData.access}</TableCell>
                <TableCell>{userData.lineManagerName || userInfo?.name}</TableCell>
                <TableCell>{userData.blendedRate}</TableCell>
                <TableCell>{userData.emailId || userData.email}</TableCell>
                <TableCell>{userData.company_role}</TableCell>
                <TableCell>{userData.company_name}</TableCell>
                {[OPERATIONAL_DIRECTOR, ADMIN].includes(userInfo?.roleAccess) && (
                  <TableCell>
                    <div className="flex gap-2 items-center justify-center">
                      <div
                        className="p-2 cursor-pointer"
                        onClick={() => navigate(`/users/${userData.id}`)}
                      >
                        <Edit2 className="text-[#002147] hover:text-[#011c3b]" size={22} />
                      </div>
                      <Trash2
                        onClick={() => {
                          setUserIdToDelete(userData.id); // Set userId for deletion
                          setIsDeleteModalOpen(true);
                        }}
                      />
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter></TableFooter>
      </Table>

      <DeleteModal />
    </>
  );
};

export default UserTable;






























// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Edit2, Trash2 } from "lucide-react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   addUser,
//   userSelector,
//   deleteUser,
//   setLoading,
// } from "../../redux/User/userSlice";
// import { getSubordinates, getUsers } from "@/redux/User/userThunk";
// import { authSelector } from "@/redux/auth/authSlice";
// import axiosIns from "@/api/axios";
// import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { ADMIN, DIRECTOR, PROJECT_MANAGER } from "@/constants";

// const UserTable = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector(userSelector);
//   const { userInfo } = useSelector(authSelector);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState(""); // Search input state
//   const [selectedTeam, setSelectedTeam] = useState("all"); // Dropdown state for team selection

//   const navigate = useNavigate();

//   console.log(userInfo, "=ascnjasnscauserInfo");
  

//   const handleDelete = async (userId) => {
//     console.log(userId, "=anscnacjasnssansajns");
    
//     const temp = [...user];
//     const index = temp.findIndex((item) => item.id === userId);
//     temp.splice(index, 1);

//     try {
//       const headers = {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${userInfo.access.token}`,
//       };
//       dispatch(setLoading());
//       const { data } = await axiosIns.delete(`/user/${userId}`, { headers });
//       dispatch(deleteUser(temp));
//       setIsDeleteModalOpen(false);
//     } catch (error) {
//       console.log(error, "=error");
//     }
//   };

//   useEffect(() => {
//     if (userInfo?.roleAccess === DIRECTOR || userInfo?.roleAccess === PROJECT_MANAGER) {
//       dispatch(getSubordinates(userInfo?.access?.token));
//     }
//     if (userInfo?.roleAccess === ADMIN) {
//       dispatch(getUsers(userInfo?.access?.token));
//     }
//   }, [dispatch, userInfo]);

//   // Filter users based on search term and selected team
//   const filteredUsers = user?.filter((userData) => {
//     const matchesSearch = searchTerm?.length > 0 ? userData?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()): true;
//     const matchesTeam = selectedTeam === "all" || userData.team === selectedTeam;
//     return matchesSearch && matchesTeam;
//   });

//   const DeleteModal = ({ userData }) => (
//     <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${isDeleteModalOpen ? "" : "hidden"}`}>
//       <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
//         <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this user?</h2>
//         <div className="flex justify-end space-x-4">
//           <button
//             className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//             onClick={() => handleDelete(userData.id)}
//           >
//             Yes
//           </button>
//           <button
//             className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
//             onClick={() => setIsDeleteModalOpen(false)}
//           >
//             No
//           </button>
//         </div>
//       </div>
//     </div>
//   )

//   return (
//     <>
//       {/* Search and filter section */}
//       <div className="flex flex-wrap gap-4 mb-4 justify-end pt-2">
//         {/* Search input */}
//         <input
//           type="text"
//           placeholder="Search by Name"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border p-2 rounded-md h-9"
//         />

//         {/* Dropdown for Team */}
//         <Select onValueChange={setSelectedTeam} defaultValue="all">
//           <SelectTrigger className="w-[200px]">
//             <SelectValue placeholder="All Teams" />
//           </SelectTrigger>
//           <SelectContent className="z-[9999]">
//             <SelectGroup>
//               <SelectItem value="all">All Teams</SelectItem> {/* "All" option */}
//               {[...new Set(user?.map((userData) => userData.team))]?.map((team, index) => (
//                 <SelectItem key={index} value={team}>
//                   {team}
//                 </SelectItem>
//               ))}
//             </SelectGroup>
//           </SelectContent>
//         </Select>
//         {userInfo?.roleAccess === ADMIN && (
//           <div>
//             <Button className="bg-[#002147] hover:bg-[#011c3b]" onClick={() => navigate("/createuser")}>
//               Create User
//             </Button>
//           </div>
//         )}
//       </div>


//       <Table>
//         <TableHeader className="sticky top-0 bg-gray-200 p-20">
//           <TableRow>
//             <TableHead>User Id</TableHead>
//             <TableHead>Name</TableHead>
//             <TableHead>Team</TableHead>
//             <TableHead>Access</TableHead>
//             <TableHead>Line Manager</TableHead>
//             <TableHead>Blended Rate</TableHead>
//             <TableHead>Email</TableHead>
//             <TableHead>Role</TableHead>
//             <TableHead>Company</TableHead>
//             {userInfo?.roleAccess === ADMIN && <TableHead>Actions</TableHead>}
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {filteredUsers?.map((userData, index) => {
//             return (
//               <TableRow key={userData.name + index}>
//                 <TableCell>{userData.id}</TableCell>
//                 <TableCell className="font-medium">{userData.name}</TableCell>
//                 <TableCell>{userData.team}</TableCell>
//                 <TableCell>{userData.roleAccess || userData.access}</TableCell>
//                 <TableCell>{userData.lineManagerName}</TableCell>
//                 <TableCell>{userData.blendedRate}</TableCell>
//                 <TableCell>{userData.emailId || userData.email}</TableCell>
//                 <TableCell>{userData.company_role}</TableCell>
//                 <TableCell>{userData.company_name}</TableCell>
//                 {userInfo?.roleAccess === ADMIN && (
//                   <TableCell>
//                     <div className="flex gap-2 items-center justify-center">
//                       <div
//                         className="p-2 cursor-pointer"
//                         onClick={() => navigate(`/users/${userData.id}`)}
//                       >
//                         <Edit2 className="text-[#002147] hover:text-[#011c3b]" size={22} />
//                       </div>
//                       <Trash2 onClick={() => setIsDeleteModalOpen(true)} />
//                     </div>
//                     <DeleteModal userData={userData} />
//                   </TableCell>
//                 )}
//               </TableRow>
//             );
//           })}
//         </TableBody>
//         <TableFooter></TableFooter>
//       </Table>
//     </>
//   );
// };

// export default UserTable;