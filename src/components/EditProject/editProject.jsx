import Navbar from "@/Header/Navbar";
import Sidebar from "@/components/SideBar/Sidebar";
import { Button } from "@/components/ui/button";
import { NavLink, Navigate } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { addUser, userSelector } from "../../redux/User/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { ADMIN, DIRECTOR, GENERAL, PROJECT_MANAGER } from "@/constants";
import { addNewUser } from "@/redux/User/userThunk";
import { setLoading, editProject } from "../../redux/project/projectSlice";
import { authSelector } from "@/redux/auth/authSlice";
import { useParams } from "react-router-dom";
import axiosIns from "@/api/axios";
import Loader from "../loader";
import { projectSelector } from "@/redux/project/projectSlice";
import { getUsers } from "@/redux/User/userThunk";
import AppWrapper from "../Wrapper/AppWrapper";
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

const EditProjectForm = () => {
  const [projectName, setProjectName] = useState("ABC");
  const [projectNameError, setProjectNameError] = useState("");
  const [totalFee, setTotalFee] = useState("2000");
  const [labourBudget, setLabourBudget] = useState("200");
  const [expenseBudget, setExpenseBudget] = useState("200");
  const [multiplier, setMultiplier] = useState("2");
  const [chargeableProject, setChargeableProject] = useState("Yes");
  const [clientNo, setClientNo] = useState("21312");
  const [projectManager, setProjectManager] = useState();
  const [projectDirector, setProjectDirector] = useState();
  const [defaultPM, setDeafultPM] = useState({id: -1, name: "None"});
  const [budgetLevel, setBudgetLevel] = useState("Project Charge");
  const [company, setCompany] = useState("TSS");
  const [organisation, setOrganisation] = useState("Surveys");
  const [workType, setWorkType] = useState("Consultancy");
  const [clientName, setClientName] = useState("ABC");
  const [clientTitle, setClientTitle] = useState("ABC");
  const [clientPhone, setClientPhone] = useState(123);
  const [clientEmail, setClientEmail] = useState("a@gmail.com");
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectFinishDate, setProjectFinishDate] = useState("");
  const [workLocation, setWorkLocation] = useState("ABC");
  const [poNo, setPoNo] = useState("1230");
  const dispatch = useDispatch();
  const { projects } = useSelector(projectSelector);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector(authSelector);
  const { user } = useSelector(userSelector);
  const [budgetError, setBudgetError] = useState("");

  useEffect(() => {
    if (!user) dispatch(getUsers(userInfo?.access?.token));
  }, []);

  useEffect(() => {
    if (user && projects && projects.length > 0) {
      // console.log("user", user);
      const project = projects.find((project) => project.id === +id);


      const pm = user.find((user) =>  user.id === +project.project_manager);
      if(pm) setDeafultPM({id: pm.id, name: pm.name});
      // console.log("pm", pm);
      // setProjectDirector(userList[0].name);
    }
  }, [user, projects]);

  useEffect(() => {
    const totalFeeValue = parseFloat(totalFee);
    const labourBudgetValue = parseFloat(labourBudget);
    const expenseBudgetValue = parseFloat(expenseBudget);
    const totalBudget = labourBudgetValue + expenseBudgetValue;

    if (totalBudget > totalFeeValue) {
      setBudgetError("Total budget cannot exceed total fee.");
    } else {
      setBudgetError("");
    }
  }, [labourBudget, expenseBudget, totalFee]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (budgetError) {
      return;
    }
    setIsLoading(true);
    const formattedStartDate = new Date(projectStartDate)
      .toISOString()
      .slice(0, 10);
    const formattedFinishDate = new Date(projectFinishDate)
      .toISOString()
      .slice(0, 10);

      // console.log("projectDirector", projectDirector);

    const projectData = {
      projectname: projectName,
      total_fee: totalFee,
      labour_budget: labourBudget,
      budget: expenseBudget,
      multiplier: multiplier,
      chargeable_project: chargeableProject === "Yes",
      client_number: clientNo,
      project_manager: projectManager,
      director: projectDirector,
      budget_level: budgetLevel,
      company: company,
      organization: organisation,
      work_type: workType,
      client_name: clientName,
      client_title: clientTitle,
      client_phone: clientPhone,
      client_contact_email: clientEmail,
      start_date: formattedStartDate,
      finish_date: formattedFinishDate,
      work_location: workLocation,
      po_number: poNo,
    };

    const temp = [...projects];
    const index = temp.findIndex((item) => item.id === +id);
    // console.log("projectData", projectData);

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.access.token}`,
      };
      dispatch(setLoading());
      const { data } = await axiosIns.patch(`/project/${id}`, projectData, {
        headers,
      });
      const index = projects.findIndex((project) => project.id === +id);
      temp[index] = projectData;
      // dispatch(editProject(temp));
      navigate("/projects");
    } catch (error) {
      setIsLoading(false);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  };
  // console.log("projectManager", projectManager);


  useEffect(() => {
    if (projects && projects.length > 0) {
      const project = projects.find((project) => project.id === +id);
      // console.log("project", project);
      if (project) {
        setProjectName(project.projectname);
        setTotalFee(project.total_fee);
        setLabourBudget(project.labour_budget);
        setExpenseBudget(project.budget);
        setMultiplier(project.multiplier);
        setChargeableProject(project.chargeable_project ? "Yes" : "No");
        setClientNo(project.client_number);
        setProjectManager(project.project_manager);
        setProjectDirector(project.director);
        setBudgetLevel(project.budget_level);
        setCompany(project.company);
        setOrganisation(project.organization);
        setWorkType(project.work_type);
        setClientName(project.client_name);
        setClientTitle(project.client_title);
        setClientPhone(project.client_phone);
        setClientEmail(project.client_contact_email);
        setProjectStartDate(
          project.start_date
            ? new Date(project.start_date).toISOString().split("T")[0]
            : ""
        );
        setProjectFinishDate(
          project.finish_date
            ? new Date(project.finish_date).toISOString().split("T")[0]
            : ""
        );
        setWorkLocation(project.work_location);
        setPoNo(project.po_number);
      }
    }
  }, [projects, id]);

  // console.log("projectName", projectName);

  return (
    <>
      {/* <AppWrapper> */}
        <div className="w-full">
          {isLoading && (
            <div className="absolute bg-white w-full h-full flex justify-center items-center z-50">
              <Loader />
            </div>
          )}
          <form className="w-full flex justify-center overflow-auto" onSubmit={submitHandler}>
            <div className="w-4/5 h-full overflow-auto">
              <h1 className="text-2xl font-semibold pt-5">Edit Project</h1>
              <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 mt-2 overflow-auto h-[70dvh]">
                <label className="flex text-sm ">
                  <div className=" w-1/2">
                    <span className="text-gray-700 dark:text-gray-400 flex gap-10">
                      Project Name
                    </span>
                    <input
                      className="w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2 "
                      placeholder="Enter Project Name"
                      type="text"
                      onChange={(e) => setProjectName(e.target.value)}
                      value={projectName}
                      required
                    />
                    {projectNameError && (
                      <p className="text-red-500 text-sm mt-2">
                        {projectNameError}
                      </p>
                    )}
                  </div>
                  <div className=" w-1/2">
                    <span className="text-gray-700 dark:text-gray-400 flex">
                      {" "}
                      Total Fee
                    </span>
                    <input
                      className=" w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
                      placeholder="Total Fee"
                      type="number"
                      onChange={(e) => setTotalFee(e.target.value)}
                      value={totalFee}
                      required
                    />
                  </div>
                </label>

                <label className="flex text-sm mt-8">
                  <div className=" w-1/2">
                    <span className="text-gray-700 dark:text-gray-400 flex gap-10">
                      Labour Budget
                    </span>
                    <input
                      className="w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2 "
                      placeholder="Labour Budget"
                      type="number"
                      onChange={(e) => setLabourBudget(e.target.value)}
                      value={labourBudget}
                      required
                    />
                    {budgetError && (
                      <p className="text-red-500 text-sm mt-2  ">
                        Labour & Expense budget cannot exceed total fee.
                      </p>
                    )}
                  </div>
                  <div className=" w-1/2">
                    <span className="text-gray-700 dark:text-gray-400 flex">
                      {" "}
                      Expense Budget
                    </span>
                    <input
                      className=" w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
                      placeholder="Expense Budget"
                      type="text"
                      onChange={(e) => setExpenseBudget(e.target.value)}
                      value={expenseBudget}
                      required
                    />
                  </div>
                </label>

                <label className="flex text-sm mt-8">
                  <div className=" w-1/2">
                    <span className="text-gray-700 dark:text-gray-400 flex gap-10">
                      Multiplier
                    </span>
                    <input
                      className="w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2 "
                      placeholder="Multiplier"
                      type="number"
                      onChange={(e) => setMultiplier(e.target.value)}
                      value={multiplier}
                      required
                    />
                  </div>
                  <div className=" w-1/2">
                    <span className="text-gray-700 dark:text-gray-400 flex gap-10">
                      Chargeable Project
                    </span>
                    <div className="mt-2">
                      <label className="inline-flex items-center text-gray-600 dark:text-gray-400">
                        <input
                          type="radio"
                          className="text-purple-600 form-radio focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                          name="accountType"
                          onChange={() => setChargeableProject("Yes")}
                          checked={chargeableProject === "Yes"}
                          required
                        />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center ml-6 text-gray-600 dark:text-gray-400">
                        <input
                          type="radio"
                          className="text-purple-600 form-radio focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                          name="accountType"
                          onChange={() => setChargeableProject("No")}
                          checked={chargeableProject === "No"}
                          required
                        />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>
                </label>

                <label className="flex text-sm mt-8">
                  <div className=" w-1/2">
                    <span className="text-gray-700 dark:text-gray-400 flex gap-10">
                      Client No
                    </span>
                    <input
                      className="w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2 "
                      placeholder="Client Reference No"
                      type="number"
                      onChange={(e) => setClientNo(e.target.value)}
                      value={clientNo}
                      required
                    />
                  </div>
                  <div className=" w-1/2">
                    <span className="text-gray-700 dark:text-gray-400 flex">
                      Project Manager
                    </span>
                    <select
                      id="projectDirector"
                      name="projectDirector"
                      className="w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2 "
                      placeholder="Project Director"
                      type="text"
                      onChange={(e) => setProjectManager(e.target.value)}
                      value={projectManager}
                      required
                    >
                      <option value={defaultPM.id}>{defaultPM.name}</option>
                      {user &&
                        user.filter((user) => user.access === PROJECT_MANAGER)
                          .length === 0 && <option value="">None</option>}
                      {user &&
                        user
                          .filter((user) => user.access === PROJECT_MANAGER && user.id !== defaultPM.id)
                          .map((pm) => (
                            <option key={pm.id} value={pm.id}>
                              {pm.name}
                            </option>
                          ))}
                    </select>
                  </div>
                </label>

                <label className="flex text-sm mt-8">
                  <div className=" w-1/2">
                    <span className="text-gray-700 dark:text-gray-400 flex gap-10">
                      Project Director
                    </span>
                    <select
                      id="projectDirector"
                      name="projectDirector"
                      className="w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2 "
                      placeholder="Project Director"
                      type="text"
                      onChange={(e) => setProjectDirector(e.target.value)}
                      value={projectDirector}
                    >
                      {user &&
                        user.filter((user) => user.access === DIRECTOR)
                          .length === 0 && <option value="">None</option>}
                      {user &&
                        user
                          .filter((user) => user.access === DIRECTOR)
                          .map((director) => (
                            <option key={director.id} value={director.name}>
                              {director.name}
                            </option>
                          ))}
                    </select>
                  </div>
                  <div className=" w-1/2">
                    <span className="text-gray-700 dark:text-gray-400 flex">
                      Budget Level
                    </span>
                    <select
                      id="budgetLevel"
                      name="budgetLevel"
                      className="w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2 "
                      placeholder="Company"
                      value={budgetLevel}
                      onChange={(e) => setBudgetLevel(e.target.value)}
                      required
                    >
                      <option>Project Charge</option>
                      <option>Time Charge</option>
                    </select>
                  </div>
                </label>

                <label className="flex text-sm mt-8">
                  <div className=" w-1/2">
                    <span className="text-gray-700 dark:text-gray-400 flex gap-10">
                      Company
                    </span>
                    <select
                      id="company"
                      name="company"
                      className="w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2 "
                      placeholder="Company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                    >
                      <option>STH</option>
                      <option>TSS</option>
                    </select>
                  </div>
                  <div className=" w-1/2">
                    <span className="text-gray-700 dark:text-gray-400 flex">
                      Service Area
                    </span>

                    <select
                      id="organization"
                      name="organization"
                      className=" w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
                      placeholder="Service Area"
                      onChange={(e) => setOrganisation(e.target.value)}
                      value={organisation}
                      required
                    >
                      <option>Surveys</option>
                      <option>Design</option>
                      <option>Engagement</option>
                      <option>Monitoring</option>
                      <option>TP</option>
                    </select>
                  </div>
                </label>

                <label className="flex text-sm mt-8">
                  <div className=" w-1/2">
                    <span className="text-gray-700 dark:text-gray-400 flex gap-10">
                      Work Type
                    </span>
                    <select
                      id="workType"
                      name="workType"
                      className="w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2 "
                      placeholder="Work Type"
                      value={workType}
                      onChange={(e) => setWorkType(e.target.value)}
                      required
                    >
                      <option>Consultancy</option>
                      <option>Technology and Monitoring</option>
                    </select>
                  </div>
                  <div className=" w-1/2">
                    <span className="text-gray-700 dark:text-gray-400 flex">
                      Client Name
                    </span>
                    <input
                      className=" w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
                      placeholder="Client Name "
                      type="text"
                      onChange={(e) => setClientName(e.target.value)}
                      value={clientName}
                      required
                    />
                  </div>
                </label>

                <label className="flex text-sm mt-8">
                  <div className=" w-1/2">
                    <span className="text-gray-700 dark:text-gray-400 flex gap-10">
                      Client Title
                    </span>
                    <input
                      className="w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2 "
                      placeholder="Client Title"
                      type="text"
                      onChange={(e) => setClientTitle(e.target.value)}
                      value={clientTitle}
                      required
                    />
                  </div>
                  <div className=" w-1/2">
                    <span className="text-gray-700 dark:text-gray-400 flex">
                      Client Phone
                    </span>
                    <input
                      className=" w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
                      placeholder="Phone"
                      type="number"
                      onChange={(e) => setClientPhone(e.target.value)}
                      value={clientPhone}
                      required
                    />
                  </div>
                </label>
                <label className="flex text-sm mt-8">
                  <div className=" w-1/2">
                    <span className="text-gray-700 dark:text-gray-400 flex gap-10">
                      Client Email
                    </span>
                    <input
                      className="w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2 "
                      placeholder="Client Email"
                      type="email"
                      onChange={(e) => setClientEmail(e.target.value)}
                      value={clientEmail}
                      required
                    />
                  </div>
                  <div className=" w-1/2">
                    <span className="text-gray-700 dark:text-gray-400 flex">
                      Project Start date
                    </span>
                    <input
                      className=" w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
                      placeholder="Project Start date"
                      type="date"
                      onChange={(e) => setProjectStartDate(e.target.value)}
                      value={projectStartDate}
                      required
                    />
                  </div>
                </label>

                <label className="flex text-sm mt-8">
                  <div className=" w-1/2">
                    <span className="text-gray-700 dark:text-gray-400 flex gap-10">
                      Project Finish date
                    </span>
                    <input
                      className="w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2 "
                      placeholder="Client Email"
                      type="date"
                      onChange={(e) => setProjectFinishDate(e.target.value)}
                      value={projectFinishDate}
                      required
                    />
                  </div>

                  <div className=" w-1/2">
                    <span className="text-gray-700 dark:text-gray-400 flex">
                      Work Location
                    </span>
                    <input
                      className=" w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
                      placeholder="Work Location"
                      type="Location"
                      onChange={(e) => setWorkLocation(e.target.value)}
                      value={workLocation}
                      required
                    />
                  </div>
                </label>

                <label className="flex text-sm mt-8">
                  <div className=" w-1/2">
                    <span className="text-gray-700 dark:text-gray-400 flex gap-10">
                      PO Number
                    </span>
                    <input
                      className="w-11/12 mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2 "
                      placeholder="PO Number"
                      type="number"
                      onChange={(e) => setPoNo(e.target.value)}
                      value={poNo}
                      required
                    />
                  </div>
                </label>
              </div>
              <div className=" flex justify-end">
                <Button type="submit" className="flex justify-end">
                  Edit Project
                </Button>
                {/* <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex justify-end">Edit Project</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        <p className="leading-6">
                          Are you sure you want to edit this project?
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
            </div>
          </form>
        </div>
      {/* </AppWrapper> */}
    </>
  );
};

export default EditProjectForm;
