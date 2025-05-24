import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "@/redux/auth/authSlice";
import axiosIns from "@/api/axios";
import Loader from "../loader";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";
import { timeSheetSelector } from "@/redux/timesheet/timeSheetSlice";
import { getTimeSheet, getTimeSheetByProjectId } from "@/redux/timesheet/timeSheetThunk";

const ProjectsOverview = ({ dropdownOptions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState({ title: "Select Project" }); // Updated placeholder
  const { userInfo } = useSelector(authSelector);
  const [projectUsers, setprojectUsers] = useState([]);
  const [isFetchingMembers, setIsFetchingMembers] = useState(false);
  const [expenseSheetData, setExpenseSheetData] = useState([]);
  const [currentProjTimesheet, setCurrentProjTimesheet] = useState([]);
  const timeSheetData = useSelector(timeSheetSelector);
  const dispatch = useDispatch();

  const dropdownRef = useRef(null); // Ref for dropdown container

  console.log(timeSheetData, "===timeSheetDataselectedOptionss, ");
  

  const dummyUserInfos = [
    { username: "abc", role: "dev", budgetSpent: "500" },
    { username: "def", role: "marketing", budgetSpent: "500" },
    { username: "ghi", role: "sales", budgetSpent: "500" },
    { username: "ghi", role: "sales", budgetSpent: "500" },
  ];

  useEffect(() => {
    if (userInfo && userInfo.access && userInfo.access.token) {
      dispatch(getTimeSheet({ date: new Date(), token: userInfo.access.token }));
    }
  }, [userInfo]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false); // Close dropdown when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = async (option) => {
    setIsFetchingMembers(true);
    if (option !== "Dropdown") {
      console.log(option, "=ajsncjascsanjs");

      // const timesheetOfSelProj = timeSheetData?.filter(sheet => (sheet.projectId === option.projectId && sheet.approvalStatus === 'approved'));
      // console.log(timesheetOfSelProj, " ==timesheetOfSelProj, projectUsers = ", projectUsers, " option = ", option);
      
      const resp = await dispatch(getTimeSheetByProjectId({ projectId: option.projectId, token: userInfo.access.token })).unwrap();
      console.log(resp, "ascnasncnsasncnsjns");
      setCurrentProjTimesheet(resp);
      setSelectedOption({ ...option, title: option?.projectName, });
      handleGetAllMember(option.projectId);
    } else {
      setSelectedOption(option);
    }
  };

  const handleGetAllMember = async (id) => {
    console.log(id);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.access.token}`,
    };
    const { data } = await axiosIns.get(`/project/members/${id}`, {
      headers,
    });

    console.log(data?.members, "===data?.membersdata?.members");
    
    setprojectUsers(data?.members);
    console.log(data);
    setIsFetchingMembers(false);
  };

  const fetchExpenseSheets = async () => {
    if (userInfo && userInfo.access && userInfo.access.token) {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.access.token}`,
      };

      try {
        const date = new Date();
        const { data } = await axiosIns.get(
          `/expensesheet/list?month=${date}`,
          {
            headers,
          }
        );
        console.log(data, "===--sanajsssasass:dataajasncajs");
        
        setExpenseSheetData(data.expenseSheet);
      } catch (error) {
        console.error("Error fetching expenseSheets:", error);
      } finally {
      }
    }
  }

  useEffect(() => {
    fetchExpenseSheets();
  }, []);

  return (
    <div className="">
      <div className="border-b p-2 px-6 flex justify-between items-end flex-wrap font-bold text-[#002147]">
        Projects Overview
        {/* --------custom Select tag------------- */}
        <div
          className="custom-select relative min-w-[170px] text-sm text-gray-800"
          onClick={toggleDropdown}
          ref={dropdownRef} // Attach ref to the dropdown
        >
          <div className="selected-option border p-2 rounded-md flex justify-between items-center font-medium cursor-pointer !text-black">
            {selectedOption?.title}
            {/* <FaAngleDown className="" /> */}
          </div>
          {isOpen && (
            <div className="z-[1000] options absolute max-h-[200px] top-[40px] border left-0 w-full bg-white shadow-md rounded-md overflow-y-auto overflow-hidden break-words scrollhide">
              <div
                className="option cursor-pointer hover:bg-gray-100 py-2 px-2 font-light border-b"
                // onClick={() => handleOptionClick("Dropdown")}
              >
                Select Project
              </div>
              {dropdownOptions?.map((option, index) => (
                <div
                  key={`${option?.projectId}${index}`}
                  className="option cursor-pointer hover:bg-gray-100 py-2 px-2 font-light border-b text-sm"
                  onClick={() => handleOptionClick(option)}
                >
                  {option?.projectName}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="min-h-[200px] ">
        {selectedOption?.title === "Select Project" ? (
          <div className="h-[200px] w-full text-gray-400 flex justify-center items-center text-center">
            Please select project from dropdown
          </div>
        ) : (
          <div className="overflow-y-hidden">
            {!isFetchingMembers ? (
              <Table
                className="pt-8 w-full min-w-[400px] text-black !overflow-x-scroll !overflow-y-hidden scrollhide"
                hideScrollbar={true}
              >
                <TableHeader className="sticky top-0 text-black">
                  <TableRow>
                    <TableHead className="text-black text-center">
                      Team Members
                    </TableHead>
                    <TableHead className="text-black text-center">Role</TableHead>
                    <TableHead className="text-black text-center">
                      Budget Used
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="overflow-y-hidden">
                  {projectUsers?.length > 0
                    ? projectUsers?.map((data, index) => {
                      const timesheetOfSelProjAndUser = currentProjTimesheet?.filter(sheet => (
                        sheet.projectId == selectedOption?.projectId && 
                        sheet.approvalStatus === 'approved' && 
                        data.id == sheet.userId
                        )
                      );
                      {/* console.log(timesheetOfSelProjAndUser, "===timesheetOfSelProjAndUser:timesheetOfSelProjAndUser") */}
                      let cost = 0
                      if(timesheetOfSelProjAndUser?.length > 0){
                        cost += (timesheetOfSelProjAndUser || [])?.reduce((total, sheet) => {
                          return total + (sheet.time * data.blendedRate * selectedOption?.multiplier)
                        }, 0)
                      }
                      console.log(cost, "===timesheetOfSelProjAndUser:cost")
                      const currUserExpenseSheet = expenseSheetData?.filter(sheet => sheet.approvalStatus === 'approved' && data.id === sheet.userId)
                      console.log(currUserExpenseSheet, "===timesheetOfSelProjAndUser:currUserExpenseSheet")
                      if(currUserExpenseSheet?.length > 0){
                        cost += (currUserExpenseSheet || [])?.reduce((total, sheet) => {
                          return total + sheet.expense
                        }, 0)
                      }

                      return (
                        <TableRow
                          key={index}
                          className="cursor-pointer border-none"
                        >
                          <TableCell className="border-none text-center">
                            {data?.name ? data?.name : "N/A"}
                          </TableCell>
                          <TableCell className="border-none flex justify-center">
                            <p className="bg-main rounded-lg py-1 px-2 min-w-[50px] max-w-fit px-3 text-white text-center text-sm">
                              {data?.company_role ? data?.company_role : "N/A"}
                            </p>
                          </TableCell>
                          <TableCell className="border-none text-center">
                            {cost.toFixed(2)}
                            {/* || selectedOption?.total_fee || data?.budgetSpent || data?.budgetSpent || "N/A"} */}
                          </TableCell>
                        </TableRow>
                      )})
                    : "none"
                  }
                </TableBody>
                <TableFooter>
                  <TableRow></TableRow>
                </TableFooter>
              </Table>
            ) : (
              <div className="min-h-[200px] w-full flex justify-center items-center">
                <Loader />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsOverview;
