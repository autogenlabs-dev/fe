import Navbar from "@/Header/Navbar";
import Sidebar from "@/components/SideBar/Sidebar";
import { useEffect, useState } from "react";
import { authSelector } from "@/redux/auth/authSlice";
import { projectSelector } from "../../redux/project/projectSlice";
import { addNewProject, getMyProjects, getProjects, updateExistingProject } from "../../redux/project/projectThunk";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import WrapperComponent from "@/components/Wrapper/TableWrapper";
import AppWrapper from "../Wrapper/AppWrapper";
import { userSelector } from "../../redux/User/userSlice";
import { getUsers } from "@/redux/User/userThunk";
import { ADMIN, DIRECTOR, GENERAL, OPERATIONAL_DIRECTOR, PROJECT_MANAGER } from "@/constants";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { getClientsThunk } from "@/redux/client/clientThunk";

const CreateOrEditProject = () => {
  const [projectName, setProjectName] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [projectNameError, setProjectNameError] = useState("");
  const [totalFee, setTotalFee] = useState("2000");
  const [labourBudget, setLabourBudget] = useState("200");
  const [expenseBudget, setExpenseBudget] = useState("200");
  const [multiplier, setMultiplier] = useState("2");
  const [chargeableProject, setChargeableProject] = useState("Yes");
  const [clientNo, setClientNo] = useState("21312");
  const [projectDirector, setProjectDirector] = useState();
  const [budgetLevel, setBudgetLevel] = useState("Project Charge");
  const [company, setCompany] = useState("TSS");
  const [organisation, setOrganisation] = useState("Surveys");
  const [workType, setWorkType] = useState("Consultancy");
  const [clientName, setClientName] = useState("ABC");
  const [clientTitle, setClientTitle] = useState("ABC");
  const [clientPhone, setClientPhone] = useState(123);
  const [clientEmail, setClientEmail] = useState("a@gmail.com");
  const [clientInfo, setClientInfo] = useState({});               // client info
  const [clientId, setClientId] = useState("");               // client id
  const [isCreating, setIsCreating] = useState(false);               // client id
  const [projectStartDate, setProjectStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [projectFinishDate, setProjectFinishDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [workLocation, setWorkLocation] = useState("ABC");
  const [poNo, setPoNo] = useState("1230");
  const [budgetError, setBudgetError] = useState("");
  const [projectManager, setProjectManager] = useState("");
  const [clients, setClients] = useState([]);
  const [defaultPM, setDeafultPM] = useState({id: -1, name: "None"});
  const [clientsLoading, setClientsLoading] = useState(true); // loading state for clients
  const [usersLoading, setUsersLoading] = useState(true); // loading state for users
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // Fetch project ID from URL for edit mode
  const { userInfo } = useSelector(authSelector);
  const { user } = useSelector(userSelector);
  const { projects } = useSelector(projectSelector);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const nbValue = queryParams.get("nb");


  console.log(user, "==useruser==useruser", userInfo);

  const getProjectsFunc = () => {
    if ([DIRECTOR, PROJECT_MANAGER, GENERAL].includes(userInfo?.roleAccess)) {
      dispatch(getMyProjects(userInfo?.access?.token));
    }
    if ([ADMIN, OPERATIONAL_DIRECTOR].includes(userInfo?.roleAccess)) {
      dispatch(getProjects(userInfo?.access?.token));
    }
  }

  // Redirect logic for nb value from URL params
  const handleRedirect = () => {
    if (nbValue) {
      navigate(`/${nbValue}`);
    }
  };

  useEffect(() => {
    setClientsLoading(true);
    dispatch(getClientsThunk({ token: userInfo?.access?.token }))
      .unwrap()
      .then((res) => {
        setClients(res);
        // Set default clientId if not set
        if (res && res.length > 0 && !clientId) {
          setClientId(res[0].id);
          setClientInfo(res[0]);
          setClientEmail(res[0]?.email);
          setClientNo(res[0]?.id);
          setClientName(res[0]?.clientName);
          setClientPhone(res[0]?.phone);
          setClientTitle(res[0]?.title);
        }
        setClientsLoading(false);
      })
      .catch((err) => {
        setClients([]);
        setClientsLoading(false);
      });
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (!user) {
      setUsersLoading(true);
      dispatch(getUsers(userInfo?.access?.token)).then(() => setUsersLoading(false));
    } else {
      setUsersLoading(false);
    }
  }, [dispatch, userInfo, user]);

  // Redirect logic for nb value from URL params
  // const handleRedirect = () => {
  //   if (nbValue) {
  //     navigate(`/${nbValue}`);
  //   }
  // };

  useEffect(() => {
    if (id && user && projects.length > 0) {
      const project = projects.find((project) => project.id === +id);
      console.log(project, "===id && user && projects.length > 0");
      if (project) {
        setProjectName(project.projectname);
        setTotalFee(project.total_fee);
        setLabourBudget(project.labour_budget);
        setExpenseBudget(project.budget);
        setMultiplier(project.multiplier);
        setChargeableProject(project.chargeable_project ? "Yes" : "No");
        // setClientNo(project.client_number);
        setProjectDirector(project.director);
        setBudgetLevel(project.budget_level);
        setCompany(project.company);
        setOrganisation(project.organization);
        setWorkType(project.work_type);
        // setClientName(project.client_name);
        // setClientTitle(project.client_title);
        setClientPhone(project.client_phone);
        // setClientEmail(project.client_contact_email);
        // setProjectManager(project.project_manager_name);
        setProjectManager(project.project_manager);
        setProjectStartDate(
          new Date(project.start_date).toISOString().slice(0, 10)
        );
        setProjectFinishDate(
          new Date(project.finish_date).toISOString().slice(0, 10)
        );
        setWorkLocation(project.work_location);
        setPoNo(project.po_number);

        const client = clients?.find(c => c.email == project.client_contact_email);
        // console.log(client, '=camsnsnssancsnaa');
        setClientId(client?.id);
        setClientInfo(client);
        setClientEmail(client?.email);
        setClientNo(client?.id);
        setClientName(client?.clientName);
        setClientPhone(client?.phone);
        setClientTitle(client?.title);
      }

      const pm = user.find((user) =>  user.id === +project.project_manager);
      console.log(pm, "sakcakncascj");
      
      if(pm) setDeafultPM({id: pm.id, name: pm.name});
    }
  }, [id, projects, clients, user]);

  // useEffect(() => {
  //   if (user) {
  //     const userList = user.filter((user) => user.access === DIRECTOR);
  //     setProjectDirector(userList?.[0]?.name || "None");
  //   }
  // }, [user]);

  const handleClientChange = (e) => {
    const selectedClientId = e.target.value;
    setClientId(selectedClientId);

    // Find the client details from the clients array
    const selectedClient = clients.find((client) => client.id == selectedClientId);
    console.log(selectedClient, "===ascnsancsa", clients);
    
    if (selectedClient) {
      // Set the selected client info
      setClientInfo(selectedClient);
      setClientEmail(selectedClient?.email);
      setClientNo(selectedClient?.id);
      setClientName(selectedClient?.clientName);
      setClientPhone(selectedClient?.phone);
      setClientTitle(selectedClient?.title);
    }
  };

  // // Validate budget limits
  // useEffect(() => {
  //   const totalFeeValue = parseFloat(totalFee);
  //   const labourBudgetValue = parseFloat(labourBudget);
  //   const expenseBudgetValue = parseFloat(expenseBudget);
  //   const totalBudget = labourBudgetValue + expenseBudgetValue;

  //   if (totalBudget > totalFeeValue) {
  //     setBudgetError("Total budget cannot exceed total fee.");
  //   } else {
  //     setBudgetError("");
  //   }
  // }, [labourBudget, expenseBudget, totalFee]);

  useEffect(() => {
    const totalFeeValue = parseFloat(totalFee);
    const labourBudgetValue = parseFloat(labourBudget);
    const expenseBudgetValue = parseFloat(expenseBudget);
    
    // Calculate the total budget
    const totalBudget = labourBudgetValue + expenseBudgetValue;
  
    // Check if the sum exceeds the total fee
    if (totalBudget > totalFeeValue) {
      setBudgetError("Labour Budget and Expense Budget combined cannot exceed the Total Fee.");
    } 
    // else if(totalBudget !== totalFeeValue){
    //   setBudgetError("Labour Budget and Expense Budget must be equal to Total Fee.");
    //   //
    // }
     else {
      setBudgetError("");
    }
  }, [labourBudget, expenseBudget, totalFee]);

  // Submit handler for form submission (create or update)
  const submitHandler = async (e) => {
    e.preventDefault();
    if (budgetError) return;

    if (!projectName) {
      setProjectNameError("Enter Project Name");
      return;
    }
    setProjectNameError("");
    setIsCreating(true);


    const newProject = {
      projectname: projectName,
      projectcode: projectCode + Math.floor(1000 + Math.random() * 9000),
      total_fee: totalFee,
      labour_budget: labourBudget,
      budget: expenseBudget,
      multiplier: multiplier,
      chargeable_project: chargeableProject,
      client_number: clientInfo?.id,
      project_manager: projectManager || userInfo.id,
      director: projectDirector,
      director_id: projectDirector,
      budget_level: budgetLevel,
      company: company,
      organization: organisation,
      work_type: workType,
      // client_name: clientName,
      client_name: clientInfo?.clientName,
      // client_title: clientTitle,
      client_title: clientInfo?.title,
      client_phone: clientInfo?.phone,
      client_contact_email: clientInfo?.email,
      start_date: projectStartDate,
      finish_date: projectFinishDate,
      work_location: workLocation,
      po_number: poNo,
      status: "inprogress",
    };

    console.log(newProject, '===newProjjjjjjssss');
    

    if (id) {
      // Edit existing project
      await dispatch(updateExistingProject({ token: userInfo?.access?.token, id, projectData: newProject })).unwrap();
    } else {
      // Create new project
      await dispatch(addNewProject({ token: userInfo?.access?.token, newProject })).unwrap();
    }

    setIsCreating(false);
    getProjects();
    handleRedirect(); // Handle redirection based on URL params
    navigate("/projects");
  };

  return (
    <div className="w-full flex justify-center">
  <form
    className="w-full max-w-6xl flex justify-center overflow-auto"
    onSubmit={submitHandler}
  >
    <div className="w-full h-full overflow-auto px-6">
      <h1 className="text-2xl font-semibold pt-5">
        {id ? "Edit Project" : "Create Project"}
      </h1>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg dark:bg-gray-800 mt-2 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Project Name */}
          <div>
            <label className="text-gray-700 dark:text-gray-400">Project Name</label>
            <input
              className="w-full mt-1 text-sm form-input border rounded-md px-2 py-2"
              placeholder="Enter Project Name"
              type="text"
              onChange={(e) => setProjectName(e.target.value)}
              value={projectName}
              required
            />
            {projectNameError && (
              <p className="text-red-500 text-sm mt-2">{projectNameError}</p>
            )}
          </div>

          {/* Total Fee */}
          <div>
            <label className="text-gray-700 dark:text-gray-400">Total Fee</label>
            <input
              className="w-full mt-1 text-sm form-input border rounded-md px-2 py-2"
              placeholder="Total Fee"
              type="number"
              onChange={(e) => setTotalFee(e.target.value)}
              value={totalFee}
              required
            />
          </div>

          {/* Labour Budget */}
          <div>
            <label className="text-gray-700 dark:text-gray-400">Labour Budget</label>
            <input
              className="w-full mt-1 text-sm form-input border rounded-md px-2 py-2"
              placeholder="Labour Budget"
              type="number"
              onChange={(e) => setLabourBudget(e.target.value)}
              value={labourBudget}
              required
            />
            {budgetError && (<div className="text-red-500 text-xs mt-2">{budgetError}</div>)}
          </div>


          {/* Expense Budget */}
          <div>
            <label className="text-gray-700 dark:text-gray-400">Expense Budget</label>
            <input
              className="w-full mt-1 text-sm form-input border rounded-md px-2 py-2"
              placeholder="Expense Budget"
              type="number"
              onChange={(e) => setExpenseBudget(e.target.value)}
              value={expenseBudget}
              required
            />
          </div>

          {/* Multiplier */}
          <div>
            <label className="text-gray-700 dark:text-gray-400">Multiplier</label>
            <input
              className="w-full mt-1 text-sm form-input border rounded-md px-2 py-2"
              placeholder="Multiplier"
              type="number"
              onChange={(e) => setMultiplier(e.target.value)}
              value={multiplier}
              required
            />
          </div>

          {/* Chargeable Project */}
          <div>
            <label className="text-gray-700 dark:text-gray-400">Chargeable Project</label>
            <div className="mt-2">
              <label className="inline-flex items-center text-gray-600">
                <input
                  type="radio"
                  className="form-radio"
                  name="chargeableProject"
                  onChange={() => setChargeableProject("Yes")}
                  checked={chargeableProject === "Yes"}
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center ml-6 text-gray-600">
                <input
                  type="radio"
                  className="form-radio"
                  name="chargeableProject"
                  onChange={() => setChargeableProject("No")}
                  checked={chargeableProject === "No"}
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>

          {/* Client No */}
          {/* <div>
            <label className="text-gray-700 dark:text-gray-400">Client No</label>
            <input
              className="w-full mt-1 text-sm form-input border rounded-md px-2 py-2"
              placeholder="Client No"
              type="number"
              onChange={(e) => setClientNo(e.target.value)}
              value={clientNo}
              required
            />
          </div> */}
          <div>
            <label className="text-gray-700 dark:text-gray-400">Client Name</label>
            <select
              className="w-full mt-1 text-sm form-input border rounded-md px-2 py-2"
              onChange={handleClientChange}
              value={clientId}
              required
              disabled={clientsLoading}
            >
              {clientsLoading ? (
                <option>Loading clients...</option>
              ) : (
                <>
                  <option value="" disabled>Select Client</option>
                  {clients?.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.clientName}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Work Location */}
          <div>
            <label className="text-gray-700 dark:text-gray-400">Work Location</label>
            <input
              className="w-full mt-1 text-sm form-input border rounded-md px-2 py-2"
              placeholder="Work Location"
              type="text"
              onChange={(e) => setWorkLocation(e.target.value)}
              value={workLocation}
              required
            />
          </div>

          {/* Project Director */}
          <div>
            <label className="text-gray-700 dark:text-gray-400">Project Director</label>
            <select
              className="w-full mt-1 text-sm form-input border rounded-md px-2 py-2"
              onChange={(e) => setProjectDirector(e.target.value)}
              value={projectDirector}
              disabled={usersLoading}
              required
            >
              {usersLoading ? (
                <option>Loading directors...</option>
              ) : (
                <>
                  <option value="" disabled>Select Director</option>
                  {user && user
                    .filter((u) => [DIRECTOR, ADMIN].includes(u.access))
                    .map((director) => (
                      <option key={director.id} value={director.id}>
                        {director?.name}
                      </option>
                    ))}
                </>
              )}
            </select>
          </div>

          {/* Budget Level */}
          <div>
            <label className="text-gray-700 dark:text-gray-400">Budget Level</label>
            <select
              className="w-full mt-1 text-sm form-input border rounded-md px-2 py-2"
              onChange={(e) => setBudgetLevel(e.target.value)}
              value={budgetLevel}
              required
            >
              <option>Project Charge</option>
              <option>Time Charge</option>
            </select>
          </div>

          {/* Company */}
          <div>
            <label className="text-gray-700 dark:text-gray-400">Company</label>
            <select
              className="w-full mt-1 text-sm form-input border rounded-md px-2 py-2"
              onChange={(e) => setCompany(e.target.value)}
              value={company}
              required
            >
              <option>citisense</option>
              <option>citisense</option>
            </select>
          </div>

          {/* Organisation */}
          <div>
            <label className="text-gray-700 dark:text-gray-400">Organisation</label>
            <select
              className="w-full mt-1 text-sm form-input border rounded-md px-2 py-2"
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

          {/* Work Type */}
          <div>
            <label className="text-gray-700 dark:text-gray-400">Work Type</label>
            <select
              className="w-full mt-1 text-sm form-input border rounded-md px-2 py-2"
              onChange={(e) => setWorkType(e.target.value)}
              value={workType}
              required
            >
              <option>Consultancy</option>
              <option>Technology and Monitoring</option>
            </select>
          </div>

          {/* Client Name */}
          {/* <div>
            <label className="text-gray-700 dark:text-gray-400">Client Name</label>
            <input
              className="w-full mt-1 text-sm form-input border rounded-md px-2 py-2"
              placeholder="Client Name"
              type="text"
              onChange={(e) => setClientName(e.target.value)}
              value={clientName}
              required
              disabled
            />
          </div> */}

          {/* Client Title */}
          <div>
            <label className="text-gray-700 dark:text-gray-400">Client Title</label>
            <input
              className="w-full mt-1 text-sm form-input border rounded-md px-2 py-2"
              placeholder="Client Title"
              type="text"
              onChange={(e) => setClientTitle(e.target.value)}
              value={clientTitle}
              required
              disabled
            />
          </div>

          {/* Client Phone */}
          <div>
            <label className="text-gray-700 dark:text-gray-400">Client Phone</label>
            <input
              className="w-full mt-1 text-sm form-input border rounded-md px-2 py-2"
              placeholder="Phone"
              type="number"
              onChange={(e) => setClientPhone(e.target.value)}
              value={clientPhone}
              required
              disabled
            />
          </div>

          {/* Client Email */}
          <div>
            <label className="text-gray-700 dark:text-gray-400">Client Email</label>
            <input
              className="w-full mt-1 text-sm form-input border rounded-md px-2 py-2"
              placeholder="Client Email"
              type="email"
              onChange={(e) => setClientEmail(e.target.value)}
              value={clientEmail}
              required
              disabled
            />
          </div>

          {/* Project Start Date */}
          <div>
            <label className="text-gray-700 dark:text-gray-400">Project Start Date</label>
            <input
              className="w-full mt-1 text-sm form-input border rounded-md px-2 py-2"
              type="date"
              onChange={(e) => setProjectStartDate(e.target.value)}
              value={projectStartDate}
              required
            />
          </div>

          {/* Project Finish Date */}
          <div>
            <label className="text-gray-700 dark:text-gray-400">Project Finish Date</label>
            <input
              className="w-full mt-1 text-sm form-input border rounded-md px-2 py-2"
              type="date"
              onChange={(e) => setProjectFinishDate(e.target.value)}
              value={projectFinishDate}
              required
            />
          </div>

          {/* PO Number */}
          <div>
            <label className="text-gray-700 dark:text-gray-400">PO Number</label>
            <input
              className="w-full mt-1 text-sm form-input border rounded-md px-2 py-2"
              placeholder="PO Number"
              type="number"
              onChange={(e) => setPoNo(e.target.value)}
              value={poNo}
              required
            />
          </div>

          {/* Project Manager */}
           <div>
            <label className="text-gray-700 dark:text-gray-400">Project Manager</label>
            <select
              id="projectManager"
              name="projectManager"
              className="w-full mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2 "
              placeholder="Project Manager"
              type="text"
              onChange={(e) => setProjectManager(e.target.value)}
              value={projectManager}
              required
            >
              <option value={defaultPM?.id}>{defaultPM?.name}</option>
         {user &&
                  user
                    .filter(
                      (user) =>
                        (user.access === PROJECT_MANAGER || user.access === OPERATIONAL_DIRECTOR) &&
                        user.id !== defaultPM.id
                    )
                    .map((pm) => (
                      <option key={pm.id} value={pm.id}>
                        {pm.name}
                      </option>
                    ))}

            </select>
          </div>
        </div>


        {/* Submit Button */}
        <div className="flex justify-center mt-8">
          <Button
            type="submit"
            disabled={!!budgetError || isCreating}
            className="flex justify-end px-10 py-5 bg-[#002147] hover:bg-[#011c3b] font-semibold"
          >
            {id ? "Update Project" : "Create Project"}
          </Button>
        </div>
      </div>
    </div>
  </form>
</div>
  );
};

export default CreateOrEditProject;
