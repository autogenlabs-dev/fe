import React, { useState, useEffect } from "react";
import Navbar from "@/Header/Navbar";
import Sidebar from "@/components/SideBar/Sidebar";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { userSelector } from "../../redux/User/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { ADMIN, DIRECTOR, GENERAL, OPERATIONAL_DIRECTOR, PROJECT_MANAGER } from "@/constants";
import { setLoading, editUser } from "../../redux/User/userSlice";
import { authSelector } from "@/redux/auth/authSlice";
import axiosIns from "@/api/axios";
import Loader from "../loader";
import { getUsers } from "@/redux/User/userThunk";
import { Eye, EyeOff } from "lucide-react"; // Import Lucide icons
import toastMessage from "@/lib/toastMessage";

const CreateUserForm = () => {
  const { id: userId } = useParams(); // Get userId from params for editing
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [team, setTeam] = useState("Design");
  const [access, setAccess] = useState(GENERAL);
  const [lineManager, setLinemanager] = useState({
    userName: "",
    userId: -1, // Default set to -1
  });
  const [blendRate, setBlendRate] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("citisense");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { user, loading: userLoading } = useSelector(userSelector);
  const { userInfo } = useSelector(authSelector);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user?.length === 0) {
      dispatch(getUsers(userInfo?.access?.token));
    }
  }, [dispatch, user, userInfo]);

  useEffect(() => {
    if (userId && user?.length > 0) {
      const editableUser = user.find((userData) => userData.id === +userId);
      
      if (editableUser) {
        const lineManagerTemp = user.find(
          (user) => user.id === +editableUser.lineManagers
        );
        setLinemanager({
          userName: lineManagerTemp?.name || "",
          userId: lineManagerTemp?.id || -1,
        });
        setName(editableUser.name);
        setTeam(editableUser.team);
        setAccess(editableUser.access);
        setBlendRate(editableUser.blendedRate);
        setEmail(editableUser.email);
        setRole(editableUser.company_role);
        setCompany(editableUser.company_name);
        setPassword("");
      }
    }
  }, [user, userId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const isValid = pattern.test(password);
    if (!isValid && password !== "" && !userId) {
      setError(
        "Password must be at least 8 characters & should be a combination of letters and numbers"
      );
      return;
    }
    if(access === GENERAL && lineManager.userId === -1) {
      setError("Select a line manager from the dropdown");
      return;
    }
    setError("");
    setIsLoading(true);

    const updatedUser = {
      name,
      team,
      access,
      lineManagers: lineManager?.userId?.toString(),
      blendedRate: blendRate,
      email,
      company_role: role,
      company_name: company,
    };

    console.log(updatedUser, "==updatedUserupdatedUser");
    

    if (userId) {
      const editableUser = user.find((userData) => userData.id === +userId);
      if (editableUser.password !== password) {
        updatedUser["password"] = password;
      }
    } else {
      updatedUser["password"] = password;
    }

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.access.token}`,
      };
      dispatch(setLoading());

      if (userId) {
        // If userId exists, update the user
        await axiosIns.patch(`/user/${userId}`, updatedUser, { headers });
        // dispatch(editUser(updatedUser));
      } else {
        // Else create new user logic goes here
        await axiosIns.post("/user", updatedUser, { headers });
      } 

      navigate("/users");
    } catch (error) {
      console.log(error, '==ascnsaajscnjanc');
      
      // setError(error.message);
      toastMessage(error.response?.data?.message || "Something went wrong", "error")
      setIsLoading(false);
    }
  };

  let lineManagers = [{ userName: "Select Line Manager", userId: -1 }];
  if (access === ADMIN) {
    lineManagers = [{ userName: "None", userId: -1 }];
  }
  else if (access === OPERATIONAL_DIRECTOR) {
    lineManagers = user
      ?.filter((u) => u.access === ADMIN)
      .map((u) => ({ userName: u.name, userId: u.id })) || [
      { userName: "Select Line Manager", userId: -1 },
    ];
  } 
  else if (access === DIRECTOR) {
    lineManagers = user
      ?.filter((u) => u.access === ADMIN || u.access === OPERATIONAL_DIRECTOR)
      .map((u) => ({ userName: u.name, userId: u.id })) || [
      { userName: "Select Line Manager", userId: -1 },
    ];
  } else if (access === PROJECT_MANAGER) {
    lineManagers = user
      ?.filter((u) => u.access === ADMIN || u.access === OPERATIONAL_DIRECTOR || u.access === DIRECTOR)
      .map((u) => ({ userName: u.name, userId: u.id })) || [
      { userName: "Select Line Manager", userId: -1 },
    ];
  } else if (access === GENERAL) {
    lineManagers = user
      ?.filter(
        (u) =>
          u.access === ADMIN ||
          u.access === DIRECTOR ||
          u.access === PROJECT_MANAGER ||
          u.access === OPERATIONAL_DIRECTOR
      )
      .map((u) => ({ userName: u.name, userId: u.id })) || [
      { userName: "Select Line Manager", userId: -1 },
    ];
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <div className="w-full">
        <div className="w-full flex justify-center">
          <div className="w-4/5">
            <h1 className="text-2xl font-semibold pt-5">
              {userId ? "Edit User" : "Create User"}
            </h1>
            <form
              className="px-4 py-3 pb-14 mb-8 bg-white rounded-lg dark:bg-gray-800 mt-2"
              onSubmit={submitHandler}
            >
              <label className="flex text-sm">
                <div className="w-1/2">
                  <span className="text-gray-700 dark:text-gray-400 flex gap-10">
                    Name
                  </span>
                  <input
                    className="w-11/12 mt-1 h-10 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
                    placeholder="Enter Name"
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    required
                    value={name || ""}
                  />
                </div>
                <div className="w-1/2">
                  <span className="text-gray-700 dark:text-gray-400 flex">
                    Team{" "}
                  </span>
                  <select
                    id="team1"
                    name="team"
                    className="w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
                    placeholder="Team"
                    onChange={(e) => setTeam(e.target.value)}
                    value={team}
                    required
                  >
                    <option>Design</option>
                    <option>Commercial</option>
                    <option>Admin</option>
                    <option>Monitoring</option>
                  </select>
                </div>
              </label>

              <label className="flex text-sm mt-8">
                <div className="w-1/2">
                  <span className="text-gray-700 dark:text-gray-400 flex gap-10">
                    Access
                  </span>
                  <select
                    id="access"
                    name="access"
                    className="w-11/12 mt-1 h-10 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
                    placeholder="access"
                    value={access}
                    onChange={(e) => setAccess(e.target.value)}
                    required
                  >
                    <option>{ADMIN}</option>
                    <option>{DIRECTOR}</option>
                    <option>{OPERATIONAL_DIRECTOR}</option>
                    <option>{PROJECT_MANAGER}</option>
                    <option>{GENERAL}</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <span className="text-gray-700 dark:text-gray-400 flex">
                    Line manager
                  </span>
                  <select
                    id="linemanager"
                    name="linemanager"
                    className="w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
                    placeholder="Team"
                    value={lineManager.userId}
                    onChange={(e) => {
                      const selectedIndex = e.target.options.selectedIndex;
                      const selectedLabel = e.target.options[selectedIndex].text;
                      setLinemanager({
                        userName: selectedLabel,
                        userId: +e.target.value,
                      });
                    }}
                    required
                  >
                    <option value={-1} disabled>
                      Select Line Manager
                    </option>
                    {lineManagers.map((manager, index) => (
                      <option key={index} value={manager.userId}>
                        {manager.userName}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <label className="flex text-sm mt-8">
                <div className="w-1/2">
                  <span className="text-gray-700 dark:text-gray-400 flex gap-10">
                    Blended Rate{" "}
                  </span>
                  <input
                    className="w-11/12 mt-1 h-10 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
                    placeholder="Blended Rate "
                    type="number"
                    onChange={(e) => setBlendRate(e.target.value)}
                    required
                    value={blendRate}
                  />
                </div>
                <div className="w-1/2">
                  <span className="text-gray-700 dark:text-gray-400 flex gap-10">
                    Email
                  </span>
                  <input
                    className="w-11/12 mt-1 h-10 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
                    placeholder="Enter Email"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    value={email}
                  />
                </div>
              </label>

              <label className="flex text-sm mt-8">
                <div className="w-1/2">
                  <span className="text-gray-700 dark:text-gray-400 flex gap-10">
                    Company Role
                  </span>
                  <input
                    className="w-11/12 mt-1 h-10 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
                    placeholder="Role"
                    type="text"
                    onChange={(e) => setRole(e.target.value)}
                    required
                    value={role}
                  />
                </div>
                <div className="w-1/2">
                  <span className="text-gray-700 dark:text-gray-400 flex">
                    Company Name
                  </span>
                  <select
                    id="company"
                    name="company"
                    className="w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
                    placeholder="Team"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                  >
                    <option>citisense</option>
                    <option>citisense</option>
                  </select>
                </div>
              </label>

              <label className="flex text-sm mt-8">
                <div className=" w-1/2">
                  <span className="text-gray-700 dark:text-gray-400 flex gap-10">
                    Password
                  </span>
                  <div className="relative">
                    <input
                      className="w-11/12 mt-1 h-10 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2 pr-10"
                      placeholder="Password"
                      type={passwordVisible ? "text" : "password"} // Toggle input type
                      onChange={handlePasswordChange}
                      value={password}
                      required={!userId}
                    />
                    <button
                      type="button"
                      className="absolute right-16 top-4 focus:outline-none"
                      onClick={togglePasswordVisibility}
                    >
                      {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </label>

              {error && <p className="text-red-500 text-sm pt-2">{error}</p>}
              <div className="flex justify-center gap-4 mt-8">
                <Button
                  disabled={isLoading}
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 text-black px-8"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button
                  disabled={isLoading}
                  type="submit"
                  className="px-8 bg-[#002147] hover:bg-[#011c3b]"
                >
                  {userId ? "Edit User" : "Create User"}
                  {isLoading && <Loader className="ml-3 h-5 w-5 text-white" />}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateUserForm;





























// import React, { useState, useEffect } from "react";
// import Navbar from "@/Header/Navbar";
// import Sidebar from "@/components/SideBar/Sidebar";
// import { Button } from "@/components/ui/button";
// import { useNavigate, useParams } from "react-router-dom";
// import { userSelector } from "../../redux/User/userSlice";
// import { useSelector, useDispatch } from "react-redux";
// import { ADMIN, DIRECTOR, GENERAL, OPERATIONAL_DIRECTOR, PROJECT_MANAGER } from "@/constants";
// import { setLoading, editUser } from "../../redux/User/userSlice";
// import { authSelector } from "@/redux/auth/authSlice";
// import axiosIns from "@/api/axios";
// import Loader from "../loader";
// import { getUsers } from "@/redux/User/userThunk";
// import { Eye, EyeOff, Edit2 } from "lucide-react"; // Import Lucide icons

// const CreateUserForm = () => {
//   const { id: userId } = useParams(); // Get userId from params for editing
//   const dispatch = useDispatch();
//   const [name, setName] = useState("");
//   const [team, setTeam] = useState("Design");
//   const [access, setAccess] = useState(GENERAL);
//   const [lineManager, setLinemanager] = useState({
//     userName: "",
//     userId: -2,
//   });
//   const [blendRate, setBlendRate] = useState("");
//   const [email, setEmail] = useState("");
//   // const [password, setPassword] = useState("");
//   const [role, setRole] = useState("");
//   const [company, setCompany] = useState("STT");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [editPassword, setEditPassword] = useState(false); // Toggle for password edit
//   const [password, setPassword] = useState("");
//   const [passwordVisible, setPasswordVisible] = useState(false); // Toggle for password visibility
//   // const [error, setError] = useState("");
//   const { user, loading: userLoading } = useSelector(userSelector);
//   const { userInfo } = useSelector(authSelector);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!user || user?.length === 0) {
//       dispatch(getUsers(userInfo?.access?.token));
//     }
//   }, [dispatch, user, userInfo]);

//   useEffect(() => {
//     if (userId && user?.length > 0) {
//       const editableUser = user.find((userData) => userData.id === +userId);
//       console.log(editableUser, "==skcnancjajcsnsj");
      
//       if (editableUser) {
//         const lineManagerTemp = user.find(
//           (user) => user.id === +editableUser.lineManagers
//         );
//         setLinemanager({
//           userName: lineManagerTemp?.name,
//           userId: lineManagerTemp?.id,
//         });
//         setName(editableUser.name);
//         setTeam(editableUser.team);
//         setAccess(editableUser.access);
//         setBlendRate(editableUser.blendedRate);
//         setEmail(editableUser.email);
//         setRole(editableUser.company_role);
//         setCompany(editableUser.company_name);
//         // setPassword(editableUser.password);
//         setEditPassword(false);
//       }
//     }
//   }, [user, userId]);

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
//     const isValid = pattern.test(password);
//     if (!isValid && password !== "" && !userId) {
//       setError(
//         "Password must be at least 8 characters & should be a combination of letters and numbers"
//       );
//       return;
//     }
//     if (lineManager.userId === -2) {
//       setError("Select a line manager from the dropdown");
//       return;
//     }
//     setError("");
//     setIsLoading(true);

//     const updatedUser = {
//       name,
//       team,
//       access,
//       lineManagers: lineManager?.userId?.toString(),
//       blendedRate: blendRate,
//       email,
//       company_role: role,
//       company_name: company,
//     };

//     if(userId){
//       const editableUser = user.find((userData) => userData.id === +userId);
//       if(editableUser.password !== password){
//         updatedUser["password"] = password;
//       }
//     }
//     else {
//       updatedUser["password"] = password;
//     }

//     // if (password === "**************" || password === "") {
//     //   delete updatedUser.password;
//     // }
// // console.log(updatedUser, "===acmaksascnas");

//     try {
//       const headers = {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${userInfo.access.token}`,
//       };
//       dispatch(setLoading());

//       if (userId) {
//         // If userId exists, update the user
//         await axiosIns.patch(`/user/${userId}`, updatedUser, { headers });
//         dispatch(editUser(updatedUser));
//       } else {
//         // Else create new user logic goes here
//         await axiosIns.post("/user", updatedUser, { headers });
//       }

//       navigate("/users");
//     } catch (error) {
//       setError(error.message);
//       setIsLoading(false);
//     }
//   };

// // const submitHandler = async (e) => {
// //   e.preventDefault();
// //   const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
// //   const isValid = pattern.test(password);
// //   if (!isValid && password !== "" && !userId) {
// //     setError(
// //       "Password must be at least 8 characters & should be a combination of letters and numbers"
// //     );
// //     return;
// //   }
// //   setError("");
// //   setIsLoading(true);

// //   // Updated object without the removed fields
// //   const updatedUser = {
// //     // firstname: name?.split(" ")[0],  // Assuming 'name' contains both first and last name
// //     // lastname: name?.split(" ")[1] || name?.split(" ")[0],  // In case there's no last name
// //     name,
// //     email,
// //     role: role === "admin" ? "admin" : "user", // Ensure role is either "user" or "admin"
// //   };

// //   if (password) {
// //     updatedUser["password"] = password;  // Add password only if it is present
// //   }

// //   try {
// //     const headers = {
// //       "Content-Type": "application/json",
// //       Authorization: `Bearer ${userInfo.access.token}`,
// //     };
// //     dispatch(setLoading());

// //     if (userId) {
// //       // If userId exists, update the user
// //       await axiosIns.patch(`/user/${userId}`, updatedUser, { headers });
// //       dispatch(editUser(updatedUser));
// //     } else {
// //       // Else create new user logic goes here
// //       await axiosIns.post("/user", updatedUser, { headers });
// //     }

// //     navigate("/users");
// //   } catch (error) {
// //     setError(error.message);
// //     setIsLoading(false);
// //   }
// // };



//   let lineManagers = [{ userName: "", userId: -2 }];
//   if (access === ADMIN) {
//     lineManagers = [{ userName: "None", userId: -1 }];
//   } else if (access === DIRECTOR) {
//     lineManagers = user
//       ?.filter((u) => u.access === ADMIN)
//       .map((u) => ({ userName: u.name, userId: u.id })) || [
//       { userName: "", userId: -2 },
//     ];
//   } else if (access === PROJECT_MANAGER) {
//     lineManagers = user
//       ?.filter((u) => u.access === ADMIN || u.access === DIRECTOR)
//       .map((u) => ({ userName: u.name, userId: u.id })) || [
//       { userName: "", userId: -2 },
//     ];
//   } else if (access === GENERAL) {
//     lineManagers = user
//       ?.filter(
//         (u) =>
//           u.access === ADMIN ||
//           u.access === DIRECTOR ||
//           u.access === PROJECT_MANAGER
//       )
//       .map((u) => ({ userName: u.name, userId: u.id })) || [
//       { userName: "", userId: -2 },
//     ];
//   }

//   const handlePasswordChange = (e) => {
//     const newPassword = e.target.value;
//     setPassword(newPassword);
//     // Add validation if needed
//   };

//   const togglePasswordVisibility = () => {
//     setPasswordVisible(!passwordVisible);
//   };

//   return (
//     <>
//       <div className="w-full">
//         <div className="w-full flex justify-center">
//           {/* {isLoading && (
//             <div className="absolute bg-white w-full h-full flex justify-center items-center z-50">
//               <Loader />
//             </div>
//           )} */}
//           <div className="w-4/5">
//             <h1 className="text-2xl font-semibold pt-5">
//               {userId ? "Edit User" : "Create User"}
//             </h1>
//             <form
//               className="px-4 py-3 pb-14 mb-8 bg-white rounded-lg dark:bg-gray-800 mt-2"
//               onSubmit={submitHandler}
//             >
//               <label className="flex text-sm">
//                 <div className="w-1/2">
//                   <span className="text-gray-700 dark:text-gray-400 flex gap-10">
//                     Name
//                   </span>
//                   <input
//                     className="w-11/12 mt-1 h-10 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
//                     placeholder="Enter Name"
//                     type="text"
//                     onChange={(e) => setName(e.target.value)}
//                     required
//                     value={name || ""}
//                   />
//                 </div>
//                 <div className="w-1/2">
//                   <span className="text-gray-700 dark:text-gray-400 flex">
//                     Team{" "}
//                   </span>
//                   <select
//                     id="team1"
//                     name="team"
//                     className="w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
//                     placeholder="Team"
//                     onChange={(e) => setTeam(e.target.value)}
//                     value={team}
//                     required
//                   >
//                     <option>Design</option>
//                     <option>Commercial</option>
//                     <option>Admin</option>
//                     <option>Monitoring</option>
//                   </select>
//                 </div>
//               </label>

//               <label className="flex text-sm mt-8">
//                 <div className="w-1/2">
//                   <span className="text-gray-700 dark:text-gray-400 flex gap-10">
//                     Access
//                   </span>
//                   <select
//                     id="access"
//                     name="access"
//                     className="w-11/12 mt-1 h-10 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
//                     placeholder="access"
//                     value={access}
//                     onChange={(e) => setAccess(e.target.value)}
//                     required
//                   >
//                     <option>{ADMIN}</option>
//                     <option>{DIRECTOR}</option>
//                     <option>{OPERATIONAL_DIRECTOR}</option>
//                     <option>{PROJECT_MANAGER}</option>
//                     <option>{GENERAL}</option>
//                   </select>
//                 </div>
//                 <div className="w-1/2">
//   <span className="text-gray-700 dark:text-gray-400 flex">
//     Line manager
//   </span>
//   <select
//     id="linemanager"
//     name="linemanager"
//     className="w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
//     placeholder="Team"
//     value={lineManager.userId} // The value controls which option is selected
//     onChange={(e) => {
//       const selectedIndex = e.target.options.selectedIndex;
//       const selectedLabel = e.target.options[selectedIndex].text;
//       setLinemanager({
//         userName: selectedLabel,
//         userId: +e.target.value,
//       });
//     }}
//     required
//   >
//     <option value={-1} disabled>
//       Select Line Manager
//     </option>
//     {lineManagers.map((manager, index) => (
//       <option key={index} value={manager.userId}>
//         {manager.userName}
//       </option>
//     ))}
//   </select>
// </div>

//               </label>

//               <label className="flex text-sm mt-8">
//                 <div className="w-1/2">
//                   <span className="text-gray-700 dark:text-gray-400 flex gap-10">
//                     Blended Rate{" "}
//                   </span>
//                   <input
//                     className="w-11/12 mt-1 h-10 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
//                     placeholder="Blended Rate "
//                     type="number"
//                     onChange={(e) => setBlendRate(e.target.value)}
//                     required
//                     value={blendRate}
//                   />
//                 </div>
//                 <div className="w-1/2">
//                   <span className="text-gray-700 dark:text-gray-400 flex gap-10">
//                     Email
//                   </span>
//                   <input
//                     className="w-11/12 mt-1 h-10 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
//                     placeholder="Enter Email"
//                     type="email"
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     value={email}
//                   />
//                 </div>
//               </label>

//               <label className="flex text-sm mt-8">
//                 <div className="w-1/2">
//                   <span className="text-gray-700 dark:text-gray-400 flex gap-10">
//                     Company Role
//                   </span>
//                   <input
//                     className="w-11/12 mt-1 h-10 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
//                     placeholder="Role"
//                     type="text"
//                     onChange={(e) => setRole(e.target.value)}
//                     required
//                     value={role}
//                   />
//                 </div>
//                 <div className="w-1/2">
//                   <span className="text-gray-700 dark:text-gray-400 flex">
//                     Company Name
//                   </span>
//                   <select
//                     id="company"
//                     name="company"
//                     className="w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
//                     placeholder="Team"
//                     value={company}
//                     onChange={(e) => setCompany(e.target.value)}
//                     required
//                   >
//                     <option>STH</option>
//                     <option>TSS</option>
//                   </select>
//                 </div>
//               </label>

//               <label className="flex text-sm mt-8">
//                 <div className=" w-1/2">
//                   <span className="text-gray-700 dark:text-gray-400 flex gap-10">
//                     Password
//                   </span>
//                   <div className="relative">
//                     <input
//                       className="w-11/12 mt-1 h-10 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2 pr-10"
//                       placeholder="Password"
//                       type={passwordVisible ? "text" : "password"} // Toggle input type
//                       onChange={handlePasswordChange}
//                       value={password}
//                       required={!userId}
//                     />
//                     <button
//                       type="button"
//                       className="absolute right-16 top-4 focus:outline-none"
//                       onClick={togglePasswordVisibility}
//                     >
//                       {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
//                     </button>
//                   </div>
//                 </div>
                
//                 {/* <div className=" w-1/2">
//                   <span className="text-gray-700 dark:text-gray-400 flex">
//                     Company Role
//                   </span>
//                   <input
//                     className=" w-11/12 mt-1 h-10 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
//                     placeholder="Role"
//                     type="text"
//                     onChange={(e) => setRole(e.target.value)}
//                     required
//                     value={role}
//                   />
//                 </div> */}
//               </label>

//               {error && <p className="text-red-500 text-sm pt-2">{error}</p>}
//               <div className="flex justify-center gap-4 mt-8">
//                 <Button disabled={isLoading} type="button" className="bg-gray-300 hover:bg-gray-400 text-black px-8" onClick={()=>navigate(-1)}>Cancel</Button>
//                 <Button disabled={isLoading} type="submit" className="px-8 bg-[#002147] hover:bg-[#011c3b]">
//                   {userId ? "Edit User" : "Create User"}
//                   {isLoading && <Loader className="ml-3 h-5 w-5 text-white" />}
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CreateUserForm;





































// import Navbar from "@/Header/Navbar";
// import Sidebar from "@/components/SideBar/Sidebar";
// import { Button } from "@/components/ui/button";
// import { NavLink, Navigate } from "react-router-dom";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { addUser, userSelector } from "../../redux/User/userSlice";
// import { useSelector, useDispatch } from "react-redux";
// import { ADMIN, DIRECTOR, GENERAL, OPERATIONAL_DIRECTOR, PROJECT_MANAGER } from "@/constants";
// import { addNewUser } from "@/redux/User/userThunk";
// import { authSelector } from "@/redux/auth/authSlice";
// import { getUsers } from "@/redux/User/userThunk";
// import { Eye, EyeOff } from "lucide-react"; // Import Lucide icons

// const CreateUserForm = ({ abc }) => {
//   const dispatch = useDispatch();
//   const [name, setName] = useState("");
//   const [team, setTeam] = useState("Design");
//   const [access, setAccess] = useState(GENERAL);
//   const [lineManager, setLinemanager] = useState({
//     userName: "",
//     userId: "-2",
//   });
//   const [blendRate, setBlendRate] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("");
//   const [company, setCompany] = useState("STT");
//   const [error, setError] = useState("");
//   const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
//   const { user } = useSelector(userSelector);
//   const { userInfo } = useSelector(authSelector);

//   const navigate = useNavigate();

//   const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

//   const handlePasswordChange = (e) => {
//     const newPassword = e.target.value;
//     setPassword(newPassword);
//     const isValid = pattern.test(newPassword);
//     if (!isValid) {
//       setError(
//         "Password must be at least 8 characters & should be a combination of letters and numbers"
//       );
//     } else {
//       setError("");
//     }
//   };

//   const handlePasswordFocus = () => {
//     if (!pattern.test(password)) {
//       setError(
//         "Password must be at least 8 characters & should be a combination of letters and numbers"
//       );
//     } else {
//       setError("");
//     }
//   };

//   const handlePasswordBlur = () => {
//     if (password && pattern.test(password)) {
//       setError("");
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setPasswordVisible(!passwordVisible);
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();

//     if (lineManager.userId === "-2") {
//       setError("Select a line manager from the dropdown");
//       return;
//     }
//     if (!pattern.test(password)) {
//       setError(
//         "Password must be at least 8 characters & should be a combination of letters and numbers"
//       );
//       return;
//     } else {
//       setError("");
//     }

//     const newUser = {
//       name,
//       team,
//       access,
//       lineManagers: lineManager.userId.toString(),
//       blendedRate: blendRate,
//       email,
//       password,
//       company_role: role,
//       company_name: company,
//       userId: "001",
//     };

//     try {
//       const result = await dispatch(
//         addNewUser({ token: userInfo?.access?.token, newUser })
//       ).unwrap();
//       navigate("/users");
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   let lineManagers = [
//     {
//       userName: "",
//       userId: "-2",
//     },
//   ];
//   if (access === ADMIN) {
//     lineManagers = [{ userName: "None", userId: "-1" }];
//   } else if (access === DIRECTOR) {
//     lineManagers = user
//       ?.filter((u) => u.access === ADMIN)
//       .map((u) => ({ userName: u.name, userId: u.id })) || [
//       {
//         userName: "",
//         userId: "-2",
//       },
//     ];
//   } else if (access === PROJECT_MANAGER) {
//     lineManagers = user
//       ?.filter((u) => u.access === ADMIN || u.access === DIRECTOR)
//       .map((u) => ({ userName: u.name, userId: u.id })) || [
//       {
//         userName: "",
//         userId: "-2",
//       },
//     ];
//   } else if (access === GENERAL) {
//     lineManagers = user
//       ?.filter(
//         (u) =>
//           u.access === ADMIN ||
//           u.access === DIRECTOR ||
//           u.access === PROJECT_MANAGER
//       )
//       .map((u) => ({ userName: u.name, userId: u.id })) || [
//       {
//         userName: "",
//         userId: "-2",
//       },
//     ];
//   }

//   useEffect(() => {
//     if (!user || user?.length === 0) {
//       dispatch(getUsers(userInfo?.access?.token));
//     }
//   }, [user]);

//   useEffect(() => {
//     setLinemanager(lineManagers[0]);
//   }, [access, user]);

//   return (
//     <>
//       <div className="flex  w-full ">
//         <div className="w-full">
//           <div className="w-full  h-screen flex justify-center ">
//             <div className="w-4/5">
//               <h1 className="text-2xl font-semibold pt-5">Create User</h1>
//               <form
//                 className="px-4 py-3 pb-14  mb-8 bg-white rounded-lg dark:bg-gray-800 mt-2"
//                 onSubmit={submitHandler}
//                 id="myForm"
//               >
//                 <label className="flex text-sm ">
//                   <div className=" w-1/2">
//                     <span className="text-gray-700 dark:text-gray-400 flex gap-10">
//                       Name
//                     </span>
//                     <input
//                       className="w-11/12 mt-1  h-10 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2 "
//                       placeholder="Enter Name"
//                       type="text"
//                       onChange={(e) => setName(e.target.value)}
//                       required
//                     />
//                   </div>

//                   <div className=" w-1/2">
//                     <span className="text-gray-700 dark:text-gray-400 flex gap-10">
//                       Access
//                     </span>
//                     <select
//                       id="access"
//                       name="access"
//                       className="w-11/12 mt-1 h-10 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
//                       placeholder="access"
//                       value={access}
//                       onChange={(e) => setAccess(e.target.value)}
//                       required
//                     >
//                       <option>{ADMIN}</option>
//                       <option>{DIRECTOR}</option>
//                       <option>{OPERATIONAL_DIRECTOR}</option>
//                       <option>{PROJECT_MANAGER}</option>
//                       <option>{GENERAL}</option>
//                     </select>
//                   </div>
//                 </label>

//                 {access !== ADMIN && (
//                   <label className="flex text-sm mt-8">
//                     <div className=" w-1/2">
//                       <span className="text-gray-700 dark:text-gray-400 flex">
//                         Team{" "}
//                       </span>
//                       <select
//                         id="team1"
//                         name="team"
//                         className="w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
//                         placeholder="Team"
//                         onChange={(e) => setTeam(e.target.value)}
//                         value={team}
//                         required
//                       >
//                         <option>Design</option>
//                         <option>Commercial</option>
//                         <option>Admin</option>
//                         <option>Monitoring</option>
//                       </select>
//                     </div>

//                     <div className=" w-1/2">
//                       <span className="text-gray-700 dark:text-gray-400 flex">
//                         Line manager
//                       </span>
//                       <select
//                         id="linemanager"
//                         name="linemanager"
//                         className="w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
//                         placeholder="Team"
//                         value={lineManager.userId}
//                         onChange={(e) => {
//                           const selectedIndex = e.target.options.selectedIndex;
//                           const selectedLabel =
//                             e.target.options[selectedIndex].text;
//                           setLinemanager({
//                             userName: selectedLabel,
//                             userId: +e.target.value,
//                           });
//                         }}
//                         required
//                       >
//                         {lineManagers.map((manager, index) => (
//                           <option key={index} value={manager.userId}>
//                             {manager.userName}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </label>
//                 )}
//                 <label className="flex text-sm mt-8">
//                   <div className=" w-1/2">
//                     <span className="text-gray-700 dark:text-gray-400 flex gap-10">
//                       Blended Rate{" "}
//                     </span>
//                     <input
//                       className="w-11/12 mt-1 h-10 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2 "
//                       placeholder="Blended Rate "
//                       type="number"
//                       onChange={(e) => setBlendRate(e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div className=" w-1/2">
//                     <span className="text-gray-700 dark:text-gray-400 flex gap-10">
//                       Email
//                     </span>
//                     <input
//                       className="w-11/12 mt-1 h-10 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2 "
//                       placeholder="Enter Email"
//                       type="email"
//                       onChange={(e) => setEmail(e.target.value)}
//                       required
//                       value={email}
//                     />
//                   </div>
//                 </label>

//                 <label className="flex text-sm mt-8">
//                   <div className=" w-1/2">
//                     <span className="text-gray-700 dark:text-gray-400 flex gap-10">
//                       Password
//                     </span>
//                     <div className="relative">
//                       <input
//                         className="w-11/12 mt-1 h-10 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2 pr-10"
//                         placeholder="Password"
//                         type={passwordVisible ? "text" : "password"}
//                         onChange={handlePasswordChange}
//                         onFocus={handlePasswordFocus}
//                         onBlur={handlePasswordBlur}
//                         required
//                         value={password}
//                       />
//                       <button
//                         type="button"
//                         className="absolute right-16 top-4 focus:outline-none"
//                         onClick={togglePasswordVisibility}
//                       >
//                         {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
//                       </button>
//                     </div>
//                   </div>
//                   <div className=" w-1/2">
//                     <span className="text-gray-700 dark:text-gray-400 flex">
//                       Company Role
//                     </span>
//                     <input
//                       className=" w-11/12 mt-1 h-10 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
//                       placeholder="Role"
//                       type="text"
//                       onChange={(e) => setRole(e.target.value)}
//                       required
//                       value={role}
//                     />
//                   </div>
//                 </label>
//                 <label className="flex text-sm mt-8">
//                   <div className=" w-1/2 ">
//                     <span className="text-gray-700 dark:text-gray-400 flex">
//                       Company Name
//                     </span>
//                     <select
//                       id="company"
//                       name="company"
//                       className="w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
//                       placeholder="Team"
//                       value={company}
//                       onChange={(e) => setCompany(e.target.value)}
//                       required
//                     >
//                       <option>STH</option>
//                       <option>TSS</option>
//                     </select>
//                   </div>
//                 </label>
//                 {error && <p className="text-red-500 text-sm pt-2">{error}</p>}
//                 <div className=" flex justify-end">
//                   <Button type="submit" className="flex justify-end">
//                     Create User
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CreateUserForm;
