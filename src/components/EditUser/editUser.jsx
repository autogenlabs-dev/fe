import React, { useState, useEffect } from "react";
import Navbar from "@/Header/Navbar";
import Sidebar from "@/components/SideBar/Sidebar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { userSelector } from "../../redux/User/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { ADMIN, DIRECTOR, GENERAL, OPERATIONAL_DIRECTOR, PROJECT_MANAGER } from "@/constants";
import { setLoading, editUser } from "../../redux/User/userSlice";
import { authSelector } from "@/redux/auth/authSlice";
import { useParams } from "react-router-dom";
import axiosIns from "@/api/axios";
import Loader from "../loader";
import { getUsers } from "@/redux/User/userThunk";
import { Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const EditUserForm = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [team, setTeam] = useState("Design");
  const [access, setAccess] = useState(GENERAL);
  const [lineManager, setLinemanager] = useState({
    userName: "",
    userId: -2,
  });
  const [blendRate, setBlendRate] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("STT");
  const { user, loading: userLoading } = useSelector(userSelector);
  const { userInfo } = useSelector(authSelector);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  let lineManagers = [{ userName: "", userId: -2 }];
  if (access === ADMIN || userInfo?.roleAccess === OPERATIONAL_DIRECTOR) {
    lineManagers = [{ userName: "None", userId: -1 }];
  } else if (access === DIRECTOR) {
    lineManagers = user
      ?.filter((u) => (u.access === ADMIN || u.access === OPERATIONAL_DIRECTOR))
      .map((u) => ({ userName: u.name, userId: u.id })) || [
      { userName: "", userId: -2 },
    ];
  } else if (access === PROJECT_MANAGER) {
    lineManagers = user
      ?.filter((u) => u.access === ADMIN || u.access === OPERATIONAL_DIRECTOR || u.access === DIRECTOR)
      .map((u) => ({ userName: u.name, userId: u.id })) || [
      { userName: "", userId: -2 },
    ];
  } else if (access === GENERAL) {
    lineManagers = user
      ?.filter(
        (u) =>
          u.access === ADMIN ||
          u.access === OPERATIONAL_DIRECTOR ||
          u.access === DIRECTOR ||
          u.access === PROJECT_MANAGER
      )
      .map((u) => ({ userName: u.name, userId: u.id })) || [
      { userName: "", userId: -2 },
    ];
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const isValid = pattern.test(password);
    if (!isValid && password !== "" && password !== "**************") {
      setError(
        "Password must be at least 8 characters & should be a combination of letters and numbers"
      );
      return;
    }
    if (lineManager.userId === -2) {
      setError("Select a line manager from the dropdown");
      return;
    }
    setError("");
    setIsLoading(true);

    const updatedUser = {
      name,
      team,
      access,
      lineManagers: lineManager.userId.toString(),
      blendedRate: blendRate,
      email,
      company_role: role,
      company_name: company,
      password,
    };

    if (password === "**************" || password === "") {
      delete updatedUser.password;
    }

    const temp = [...user];

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.access.token}`,
      };
      dispatch(setLoading());
      await axiosIns.patch(`/user/${id}`, updatedUser, {
        headers,
      });
      const index = user.findIndex((userData) => userData.id === +id);
      temp[index] = updatedUser;
      dispatch(editUser(temp));
      navigate("/users");
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      // return thunkAPI.rejectWithValue(error.response.data);
    }
  };

  useEffect(() => {
    if (!user || user?.length === 0) {
      dispatch(getUsers(userInfo?.access?.token));
    }
  }, []);

  useEffect(() => {
    if (user && user.length > 0) {
      const editableUser = user.find((userData) => userData.id === +id);
      if (editableUser) {
        const lineManagerTemp = user.find(
          (user) => user.id === +editableUser.lineManagers
        );
        setLinemanager({
          userName: lineManagerTemp?.name,
          userId: lineManagerTemp?.id,
        });
        setName(editableUser.name);
        setTeam(editableUser.team);
        setAccess(editableUser.access);
        setBlendRate(editableUser.blendedRate);
        setEmail(editableUser.email);
        setRole(editableUser.company_role);
        setCompany(editableUser.company_name);
      }
    }
  }, [user, id]);

  useEffect(() => {
    if (isFirstTime) {
      setLinemanager(lineManagers[0]);
    } else {
      setIsFirstTime(true);
    }
  }, [access]);

  return (
    <>
      <div className="flex w-full">
        <Sidebar />
        <div className="w-full">
          <Navbar />
          <div className="w-full flex justify-center">
            {isLoading && (
              <div className="absolute bg-white w-full h-full flex justify-center items-center z-50">
                <Loader />
              </div>
            )}
            <div className="w-4/5">
              <h1 className="text-2xl font-semibold pt-5">Edit User</h1>
              <form
                className="px-4 py-3 pb-14 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 mt-2"
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
                      <option>{OPERATIONAL_DIRECTOR}</option>
                      <option>{DIRECTOR}</option>
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
                        const selectedLabel =
                          e.target.options[selectedIndex].text;
                        setLinemanager({
                          userName: selectedLabel,
                          userId: +e.target.value,
                        });
                      }}
                      required
                    >
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
                      <option>STH</option>
                      <option>TSS</option>
                    </select>
                  </div>
                </label>

                {editPassword ? (
                  <label className="flex text-sm mt-8">
                    <div className="w-1/2">
                      <span className="text-gray-700 dark:text-gray-400 flex gap-10">
                        Password
                      </span>
                      <input
                        className="w-11/12 mt-1 h-10 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
                        placeholder="Password"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        value={password}
                      />
                    </div>
                  </label>
                ) : (
                  <div className="flex items-center mt-8 justify-between w-[46%] ">
                    <p> Password</p>

                    <p className=" mt-2"> **************</p>

                    <div
                      className="text-[#002147] underline cursor-pointer"
                      onClick={() => setEditPassword(true)}
                    >
                      <Edit2 size={18} />
                    </div>
                  </div>
                )}

                {error && <p className="text-red-500 text-sm pt-2">{error}</p>}
                <div className="flex justify-end">
                <Button type="submit" className="flex justify-end">
                    Edit User
                  </Button>
                  {/* <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex justify-end mt-6">
                        Edit User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>
                          <p className="leading-6">
                            Are you sure you want to edit this user?
                          </p>
                        </DialogTitle>
                      </DialogHeader>
                      <DialogFooter className="pt-10">
                        <DialogClose asChild>
                          <Button
                            type="button"
                            className="text-white bg-[green] hover:bg-[green]"
                            onClick={submitHandler}
                          >
                            Yes
                          </Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            type="button"
                            className="text-[black] bg-[#E2E8F0] hover:bg-[#E2E8F0]"
                          >
                            No
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditUserForm;
