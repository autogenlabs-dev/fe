
import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { authSelector } from "@/redux/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../components/loader";
import TableWrapper from "@/components/Wrapper/TableWrapper";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MonthCalendar from "@/components/MonthCalendar/MonthCalendar";
import axiosIns from "@/api/axios";
import { GENERAL, ADMIN, PROJECT_MANAGER, OPERATIONAL_DIRECTOR, DIRECTOR } from "@/constants";
import { convertToUTC } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Trash2 } from "lucide-react";
import { put } from "@vercel/blob";
import { deleteExpensesheet } from "@/redux/expensesheet/expenseSheetThunk";
import { useNavigate } from "react-router-dom";

// CustomModal Component
const CustomModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white p-5 rounded-lg z-50 max-w-lg mx-auto shadow-lg">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {children}
        <div className="flex justify-end mt-4">
          <Button className="bg-gray-400 hover:bg-gray-500 text-white rounded" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

const ExpenseSheet = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const dispatch = useDispatch();
  const { userInfo } = useSelector(authSelector);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Search by name input
  const [selectedManager, setSelectedManager] = useState(""); // Selected manager
  const [uniqueManagers, setUniqueManagers] = useState([]); // Unique project managers
  const [expenseSheetData, setExpenseSheetData] = useState([]);
  const [filteredExpenseData, setFilteredExpenseData] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [finalExpenseList, setFinalExpenseList] = useState([]);
  const [updatedExpenseSheet, setUpdatedExpenseSheet] = useState([]);
  const [editedRows, setEditedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const navigate = useNavigate();

  // Open Modal
  const openModal = (title, content) => {
    setModalContent({ title, content });
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const EditableCell = ({ value, onChange, isEditing }) => {
    return isEditing ? (
      <input
        type="number"
        autoFocus
        value={value}
        onChange={onChange}
        className="w-[105px] pl-[3px]"
      />
    ) : (
      <span className="w-[105px] pl-[3px]"> {`£${value}`}</span>
    );
  };

  const handleAddImages = (event, expenseSheet) => {
    console.log(event.target.files, " ===== mkcamsmask =====, ", expenseSheet);
    
    const files = Array.from(event.target.files);
    event.preventDefault();

    const promises = files.map(async (file) => {
      return new Promise(async (resolve) => {
        try {
          const { url } = await put(file.name, file, {
            access: "public",
            token: import.meta.env.VITE_BLOB_READ_WRITE_TOKEN,
          });

          console.log(url, "=scmkackascks:imgUrl:1");
          
          resolve(url);
        } catch (error) {
          console.error("There was a problem with the fetch operation: " + error.message);
        }
      });
    });

    Promise.all(promises).then(async (imageUrls) => {
      console.log(imageUrls, "=scmkackascks:imgUrl");
      
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.access.token}`,
      };

      const { data } = await axiosIns.patch(`/expensesheet/update/receipts`, 
        { id: expenseSheet.id, imageUrls }, 
        { headers,}
      );
console.log(data, "===datadatadata:data");

      setExpenseSheetData((prevSheets) => {
        const newSheet = prevSheets.expenseSheet.map((sheet) => {
          return sheet.projectId === expenseSheet.projectId
            ? { ...sheet, imageUrls: [...(expenseSheet.imageUrls || []), ...imageUrls] }
            : sheet;
        });
        return { expenseSheet: newSheet };
      });
      setUpdatedExpenseSheet((prevExpense) => {
        const newExpense = prevExpense.map((sheet) => {
          if (sheet.projectId === expenseSheet.projectId) {
            return {
              ...sheet,
              approvalStatus: "notsubmitted",
              imageUrls: [...(expenseSheet.imageUrls || []), ...imageUrls],
            };
          }
          return sheet;
        });

        if (!newExpense.find((sheet) => sheet.projectId === expenseSheet.projectId)) {
          newExpense.push({
            projectId: expenseSheet.projectId,
            month: convertToUTC(selectedMonth),
            expense: expenseSheet.expense,
            id: 0,
            approvalStatus: "notsubmitted",
            category: expenseSheet.category,
            imageUrls: [...(expenseSheet.imageUrls || []), ...imageUrls],
          });
        }
        return newExpense;
      });
      setEditedRows((prev) => {
        if (!prev.some((row) => row.projectId === expenseSheet.projectId)) {
          return [...prev, { projectId: expenseSheet.projectId }];
        } else {
          return prev;
        }
      });
    });
  };

  const handleImageDelete = (index, expenseSheet) => {
    setExpenseSheetData((prevSheets) => {
      const newSheet = prevSheets.expenseSheet.map((sheet) => {
        if (sheet.projectId === expenseSheet.projectId) {
          const newImageUrls = [...expenseSheet.imageUrls];
          newImageUrls.splice(index, 1);
          return { ...sheet, imageUrls: newImageUrls };
        }
        return sheet;
      });
      return { expenseSheet: newSheet };
    });
    setUpdatedExpenseSheet((prevExpense) => {
      const newExpense = prevExpense.map((sheet) => {
        if (sheet.projectId === expenseSheet.projectId) {
          const newImageUrls = [...expenseSheet.imageUrls];
          newImageUrls.splice(index, 1);
          return { ...sheet, imageUrls: newImageUrls };
        }
        return sheet;
      });

      if (!newExpense.find((sheet) => sheet.projectId === expenseSheet.projectId)) {
        const newImageUrls = [...expenseSheet.imageUrls];
        newImageUrls.splice(index, 1);
        newExpense.push({
          ...expenseSheet,
          imageUrls: newImageUrls,
        });
      }
      return newExpense;
    });
    setEditedRows((prev) => {
      if (!prev.some((row) => row.projectId === expenseSheet.projectId)) {
        return [...prev, { projectId: expenseSheet.projectId }];
      } else {
        return prev;
      }
    });
  };

  const handleCellClick = (e, projectId) => {
    e.preventDefault();
    e.stopPropagation();
    if (editingCell?.projectId === projectId) {
      return;
    }
    setEditingCell({ projectId });
  };

  const handleCellChange = (event, projectId, category, imageUrls, id) => {
    const newValue = event.target.value;
    setExpenseSheetData((prevExpense) => {
      const newExpense = prevExpense?.expenseSheet?.map((expenseSheet) => {
        return {
          ...expenseSheet,
          expense: expenseSheet.projectId === projectId ? +newValue : expenseSheet.expense,
        };
      });
      const newSheet = { expenseSheet: newExpense };
      return newSheet;
    });

    setUpdatedExpenseSheet((prevExpense) => {
      const expenseSheet = prevExpense.find((expenseSheet) => expenseSheet.projectId === projectId);
      if (expenseSheet) {
        expenseSheet.expense = +newValue;
        expenseSheet.category = category;
        expenseSheet.imageUrls = [...(imageUrls || [])];
        expenseSheet.approvalStatus = "notsubmitted";
      } else {
        prevExpense.push({
          projectId,
          month: convertToUTC(selectedMonth),
          expense: +newValue,
          id,
          approvalStatus: "notsubmitted",
          category,
          imageUrls: [...(imageUrls || [])],
        });
      }
      const newExpense = [...prevExpense];
      return newExpense;
    });

    setEditedRows((prev) => {
      if (!prev.some((row) => row.projectId === projectId)) {
        return [...prev, { projectId }];
      } else {
        return prev;
      }
    });
  };

  const handleCategoryChange = (event, projectId, expense, imageUrls, id) => {
    const newValue = event.target.value;
    setExpenseSheetData((prevExpense) => {
      const newExpense = prevExpense?.expenseSheet?.map((expenseSheet) => {
        return {
          ...expenseSheet,
          category: expenseSheet.projectId === projectId ? newValue : expenseSheet.category,
        };
      });
      const newSheet = { expenseSheet: newExpense };
      return newSheet;
    });

    setUpdatedExpenseSheet((prevExpense) => {
      const expenseSheet = prevExpense.find((expenseSheet) => expenseSheet.projectId === projectId);
      if (expenseSheet) {
        expenseSheet.category = newValue;
        expenseSheet.expense = expense;
        expenseSheet.imageUrls = [...(imageUrls || [])];
        expenseSheet.approvalStatus = "notsubmitted";
      } else {
        prevExpense.push({
          projectId,
          month: convertToUTC(selectedMonth),
          expense,
          id,
          approvalStatus: "notsubmitted",
          category: newValue,
          imageUrls: [...(imageUrls || [])],
        });
      }
      const newExpense = [...prevExpense];
      return newExpense;
    });
    setEditedRows((prev) => {
      if (!prev.some((row) => row.projectId === projectId)) {
        return [...prev, { projectId }];
      } else {
        return prev;
      }
    });
  };

  const handleSaveExpenseSheet = async (projectId) => {
    setIsLoading(true);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.access.token}`,
    };
    const filteredExpenseSheet = updatedExpenseSheet.filter((sheet) => sheet.projectId === projectId);

    const body = {
      expenseSheet: filteredExpenseSheet,
    };
    await axiosIns.patch(`/expenseSheet/update`, body, { headers });
    setUpdatedExpenseSheet([]);
    setEditedRows([]);
    setEditingCell(null);
    setFinalExpenseList(expenseSheetData);
    await fetchExpenseSheets();
  };

  const fetchExpenseSheets = useCallback(async () => {
    setIsLoading(true);

    if (userInfo && userInfo.access && userInfo.access.token) {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.access.token}`,
      };

      try {
        const { data } = await axiosIns.get(`/expensesheet/list?month=${selectedMonth}`, {
          headers,
        });
        console.log(data, "==aakscsasnexpensseeeeeeeee");
        
        setExpenseSheetData(data);
        setFinalExpenseList(data);
        setEditedRows([]);
        setUpdatedExpenseSheet([]);

        // Get unique project managers
        const managers = [...new Set(data.expenseSheet.map((item) => item.projectManager))];
        setUniqueManagers(managers);

        filterExpenseSheets(data, searchTerm, selectedManager); // Apply filtering
      } catch (error) {
        console.error("Error fetching expenseSheets:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [selectedMonth, userInfo]);

  useEffect(() => {
    fetchExpenseSheets();
  }, [userInfo, selectedMonth]);

  const handleSubmitExpenseSheet = async (expId) => {
    setIsLoading(true);
    setUpdatedExpenseSheet([]);
    setEditedRows([]);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.access.token}`,
    };

    const body = {
      id: expId,
      link: "/expenseSheetlist",
    };
    await axiosIns.post(`/expenseSheet/submit/all`, body, { headers });
    setEditingCell(null);
    setExpenseSheetData([]);
    setFinalExpenseList([]);
    await fetchExpenseSheets();
  };

  // Filter logic based on search term and selected project manager
  const filterExpenseSheets = (data, searchTerm, selectedManager) => {
    let filteredData = data.expenseSheet;

    if (searchTerm) {
      filteredData = filteredData?.filter((sheet) =>
        sheet?.project?.projectname?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    if (selectedManager) {
      filteredData = filteredData.filter(
        (sheet) => sheet?.project?.manager?.id == selectedManager
      );
    }

    setFilteredExpenseData(filteredData);
  };

  useEffect(() => {
    if (expenseSheetData?.expenseSheet) {
      filterExpenseSheets(expenseSheetData, searchTerm, selectedManager);
    }
  }, [searchTerm, selectedManager, expenseSheetData]);

  const handleDelete = (expenseSheet) => {
    openModal("Delete Expense Sheet", (
      <>
        <p>Are you sure you want to delete this expensesheet?</p>
        <div className="flex justify-end mt-4">
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={async () => {
              await dispatch(deleteExpensesheet({ token: userInfo.access.token, body: { expenseSheet } })).unwrap();
              await fetchExpenseSheets();
              closeModal();
            }}
          >
            Yes
          </Button>
          <Button className="bg-gray-400 hover:bg-gray-500 text-white ml-2" onClick={closeModal}>
            No
          </Button>
        </div>
      </>
    ));
  };

  const handleSaveModal = (expenseSheet) => {
    openModal("Save Expense Sheet", (
      <>
        <p>Are you sure you want to save this expensesheet?</p>
        <div className="flex justify-end mt-4">
          <Button
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={() => {
              handleSaveExpenseSheet(expenseSheet.projectId);
              closeModal();
            }}
          >
            Yes
          </Button>
          <Button className="bg-gray-400 hover:bg-gray-500 text-white ml-2" onClick={closeModal}>
            No
          </Button>
        </div>
      </>
    ));
  };

  console.log(filteredExpenseData, "===filteredExpenseDatahhh");
  

  return (
    <div className="pt-6 px-5 mt-4">
      {/* Inputs in a single row aligned to the right */}
      <div className="flex justify-between">
        <Button className="bg-main hover:bg-main/90 px-3 mt-5" onClick={() => navigate("/createexpensesheet")}>
          Create Expense Sheet
        </Button>
        <div className="flex justify-end items-center gap-4">
          <div className="flex flex-col mt-1">
            <Label htmlFor="calender" className="text-sm font-medium leading-none mb-1">Select Date</Label>
            <MonthCalendar
              id="calender"
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              className="relative z-[9999]"
            />
          </div>
          <div>
            <Label htmlFor="searchName">Search by Project Name</Label>
            <Input
              id="searchName"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter project name"
            />
          </div>
          <div>
            <Label htmlFor="projectManager">Filter by Project Manager</Label>
            <select
              id="projectManager"
              className="w-full border rounded-md h-9"
              value={selectedManager}
              onChange={(e) => setSelectedManager(e.target.value)}
            >
              <option value="">All Managers</option>
              {expenseSheetData?.expenseSheet?.map((sheet, index) => (
                <option key={index} value={sheet?.project?.manager?.name}>
                  {sheet?.project?.manager?.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <>
          {filteredExpenseData?.length > 0 ? (
            <Table className="mt-8">
              <TableHeader>
                <TableRow>
                  <TableHead>Project Manager</TableHead>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Expense</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Receipts</TableHead>
                  <TableHead>Status</TableHead>
                  {(userInfo?.roleAccess === ADMIN || userInfo?.roleAccess === OPERATIONAL_DIRECTOR) && (
                    <TableHead>Action</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenseData?.map((expenseSheet, index) => (
                  <TableRow key={index} className="cursor-pointer">
                    <TableCell>{expenseSheet?.project?.manager?.name}</TableCell>
                    <TableCell>{expenseSheet?.project?.projectname}</TableCell>
                    <TableCell
                      key={index}
                      onClick={(e) => handleCellClick(e, expenseSheet.projectId)}
                    >
                      <EditableCell
                        value={expenseSheet?.expense ?? 0}
                        onChange={(event) => handleCellChange(
                          event,
                          expenseSheet.projectId,
                          expenseSheet.category,
                          expenseSheet?.imageUrls,
                          expenseSheet?.id ?? 0
                        )}
                        isEditing={editingCell?.projectId === expenseSheet.projectId}
                        projectId={expenseSheet.projectId}
                      />
                    </TableCell>
                    <TableCell className="text-[#011c3b]">
                      <select
                        id="team1"
                        name="project"
                        className="w-11/12 mt-1 text-sm focus:border-blue-400 focus:outline-none focus:shadow-outline-blue form-input border rounded-md px-2 py-2"
                        value={expenseSheet?.category}
                        onChange={(event) =>
                          handleCategoryChange(
                            event,
                            expenseSheet.projectId,
                            expenseSheet.expense,
                            expenseSheet?.imageUrls,
                            expenseSheet?.id ?? 0
                          )
                        }
                        required
                      >
                        {/* Category Options */}
                        <option value="Mileage">Mileage</option>
                        <option value="Train Travel">Train Travel</option>
                        <option value="Hire car">Hire car</option>
                        <option value="Hire car fuel">Hire car fuel</option>
                        <option value="Taxi">Taxi</option>
                        <option value="Other travel">Other travel</option>
                        <option value="Subsistence/ meals">Subsistence/ meals</option>
                        <option value="Overnight accommodation">Overnight accommodation</option>
                        <option value="Printing">Printing</option>
                        <option value="Photocopying">Photocopying</option>
                        <option value="IT consumables">IT consumables</option>
                        <option value="Courier">Courier</option>
                        <option value="Phone">Phone</option>
                        <option value="Postage">Postage</option>
                        <option value="Training">Training</option>
                        <option value="Professional subscriptions">Professional subscriptions</option>
                        <option value="Client entertaining">Client entertaining</option>
                        <option value="Staff entertaining">Staff entertaining</option>
                        <option value="Other/ sundry costs">Other/ sundry costs</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col justify-center items-center gap-2">
                        <div className="flex flex-wrap justify-center gap-3">
                          {expenseSheet?.imageUrls?.map((url, index) => (
                            <div
                              key={index}
                              className="w-32 h-32 rounded-lg shadow-md bg-slate-500 relative"
                            >
                              <img
                                className="w-full h-full object-cover"
                                src={url}
                                alt={`Expense ${expenseSheet?.projectId}`}
                              />
                              {(expenseSheet.approvalStatus?.toLowerCase() === "notsubmitted" ||
                                expenseSheet.approvalStatus?.toLowerCase() === "rejected") && (
                                  <div
                                    className="absolute top-[-10px] right-[-10px] p-1 border-none cursor-pointer bg-red-500 hover:bg-red-600 rounded-full"
                                    onClick={() => handleImageDelete(index, expenseSheet)}
                                  >
                                    <X size={24} color="black" />
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                        {(expenseSheet.approvalStatus?.toLowerCase() === "notsubmitted" ||
                          expenseSheet.approvalStatus?.toLowerCase() === "rejected") && (
                          <div className="grid w-[147px] max-w-sm items-center gap-1.5">
                            <Label
                              htmlFor={`picture${expenseSheet?.projectId}`}
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[#002147] text-primary-foreground shadow hover:bg-[#011c3b] h-9 px-4 py-2"
                            >
                              Upload Receipts
                            </Label>
                            <Input
                              id={`picture${expenseSheet?.projectId}`}
                              type="file"
                              accept=".jpg,.jpeg,.png"
                              multiple
                              style={{ display: "none" }}
                              onChange={(event) => handleAddImages(event, expenseSheet)}
                            />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-[#9333EA]">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`rounded-2xl p-1 h-auto px-4 border-0 hover:text-white ${
                              !expenseSheet?.approvalStatus || expenseSheet.approvalStatus === "notsubmitted"
                                ? "text-[#6DA5B8] bg-[#F2FAFD] hover:bg-[#6DA5B8]"
                                : expenseSheet.approvalStatus === "submitted"
                                ? "text-[#6DA5B8] bg-[#F2FAFD] hover:bg-[#6DA5B8]"
                                : expenseSheet.approvalStatus === "approved"
                                ? "text-green-700 bg-green-200 hover:bg-green-700"
                                : "text-red-700 bg-red-200 hover:bg-red-700"
                            }`}
                          >
                            {!expenseSheet?.approvalStatus || expenseSheet.approvalStatus === "notsubmitted"
                              ? "Not submitted"
                              : expenseSheet.approvalStatus === "submitted"
                              ? "Pending"
                              : expenseSheet.approvalStatus === "approved"
                              ? "Approved"
                              : "Rejected"}
                          </Button>
                        </PopoverTrigger>
                        {!expenseSheet?.approvalStatus || expenseSheet.approvalStatus === "notsubmitted" ||
                        expenseSheet.approvalStatus === "submitted" ? (
                          <></>
                        ) : (
                          <PopoverContent className="w-40">
                            <div className="grid gap-4 place-items-center">
                              <div className="space-y-2 text-center">
                                <h4 className="font-medium leading-none">Comments</h4>
                                <p className="text-sm text-muted-foreground">
                                  {expenseSheet?.comments ? expenseSheet.comments : " No comments"}
                                </p>
                              </div>
                            </div>
                          </PopoverContent>
                        )}
                      </Popover>
                    </TableCell>
                    {(userInfo?.roleAccess === ADMIN || userInfo?.roleAccess === OPERATIONAL_DIRECTOR) && (
                      <TableCell>
                        {expenseSheet.expense > 0 && expenseSheet?.id && (
                          <div className="p-2 cursor-pointer" onClick={() => handleDelete(expenseSheet)}>
                            <Trash2 className="text-primary" size={22} />
                          </div>
                        )}
                      </TableCell>
                    )}
                    <TableCell>
                      {expenseSheet?.approvalStatus === 'notsubmitted' && 
                      <div className="flex justify-center">
                        <Button
                          className="flex"
                          onClick={() => handleSubmitExpenseSheet(expenseSheet?.id)}
                        >
                          Submit {userInfo?.roleAccess === GENERAL && <span>&nbsp;For Approval</span>}
                        </Button>
                        </div>
                      }
                      {/* <div className="flex gap-2 justify-center">
                        {editedRows.some((row) => row.projectId === expenseSheet.projectId) && (
                          <Button className="flex" onClick={() => handleSaveModal(expenseSheet)}>Save</Button>
                        )}
                        {finalExpenseList?.expenseSheet?.some(
                          (ts) =>
                            (ts.approvalStatus === "notsubmitted" ||
                              (ts.approvalStatus === "submitted" &&
                                [ADMIN, DIRECTOR, OPERATIONAL_DIRECTOR, PROJECT_MANAGER].includes(
                                  userInfo?.roleAccess
                                ))) &&
                            ts.expense > 0 &&
                            ts.projectId === expenseSheet.projectId
                        ) && (
                          <div className="flex justify-center">
                            <Button
                              className="flex"
                              onClick={() => handleSubmitExpenseSheet(expenseSheet?.id)}
                            >
                              Submit {userInfo?.roleAccess === GENERAL && <span>&nbsp;For Approval</span>}
                            </Button>
                          </div>
                        )} */}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="cursor-pointer">
                  <TableCell></TableCell>
                  <TableCell className="text-[#011c3b] text-center text-lg font-bold">Total</TableCell>
                  <TableCell>
                    {`£${expenseSheetData?.expenseSheet?.reduce(
                      (acc, expenseData) => acc + +(expenseData?.expense ?? 0),
                      0
                    )}`}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <p>No ExpenseSheet available.</p>
          )}
        </>
      )}
      {/* Custom Modal */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalContent?.title || "Modal"}
      >
        {modalContent?.content}
      </CustomModal>
    </div>
  );
};

export default ExpenseSheet;





















// import React, { useCallback, useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { authSelector } from "@/redux/auth/authSlice";
// import { useSelector, useDispatch } from "react-redux";
// import Loader from "../components/loader";
// import TableWrapper from "@/components/Wrapper/TableWrapper";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import MonthCalendar from "@/components/MonthCalendar/MonthCalendar";
// import axiosIns from "@/api/axios";
// import { GENERAL, ADMIN, PROJECT_MANAGER, OPERATIONAL_DIRECTOR, DIRECTOR } from "@/constants";
// import { convertToUTC } from "@/lib/utils";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { X, Trash2 } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogClose,
// } from "@/components/ui/dialog";
// import { put } from "@vercel/blob";
// import { deleteExpensesheet } from "@/redux/expensesheet/expenseSheetThunk";
// import { useNavigate } from "react-router-dom";

// const ExpenseSheet = () => {
//   const [selectedMonth, setSelectedMonth] = useState(new Date());
//   const dispatch = useDispatch();
//   const { userInfo } = useSelector(authSelector);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState(""); // Search by name input
//   const [selectedManager, setSelectedManager] = useState(""); // Selected manager
//   const [uniqueManagers, setUniqueManagers] = useState([]); // Unique project managers
//   const [expenseSheetData, setExpenseSheetData] = useState([]);
//   const [filteredExpenseData, setFilteredExpenseData] = useState([]);
//   const [editingCell, setEditingCell] = useState(null);
//   const [finalExpenseList, setFinalExpenseList] = useState([]);
//   const [updatedExpenseSheet, setUpdatedExpenseSheet] = useState([]);
//   const [editedRows, setEditedRows] = useState([]);
//   const navigate = useNavigate();

//   console.log(filteredExpenseData, "====filteredExpenseDatafilteredExpenseData");
  

//   const EditableCell = ({ value, onChange, isEditing }) => {
//     return isEditing ? (
//       <input
//         type="number"
//         autoFocus
//         value={value}
//         onChange={onChange}
//         className="w-[105px] pl-[3px]"
//       />
//     ) : (
//       <span className="w-[105px] pl-[3px]"> {`£${value}`}</span>
//     );
//   };

//   const handleAddImages = (event, expenseSheet) => {
//     const files = Array.from(event.target.files);
//     event.preventDefault();

//     const promises = files.map(async (file) => {
//       return new Promise(async (resolve) => {
//         try {
//           const { url } = await put(file.name, file, {
//             access: "public",
//             token: import.meta.env.VITE_BLOB_READ_WRITE_TOKEN,
//           });

//           resolve(url);
//         } catch (error) {
//           console.error(
//             "There was a problem with the fetch operation: " + error.message
//           );
//         }
//       });
//     });

//     Promise.all(promises).then(async (imageUrls) => {
//       setExpenseSheetData((prevSheets) => {
//         const newSheet = prevSheets.expenseSheet.map((sheet) => {
//           return sheet.projectId === expenseSheet.projectId
//             ? {
//                 ...sheet,
//                 imageUrls: [...(expenseSheet.imageUrls || []), ...imageUrls],
//               }
//             : sheet;
//         });
//         return { expenseSheet: newSheet };
//       });
//       setUpdatedExpenseSheet((prevExpense) => {
//         const newExpense = prevExpense.map((sheet) => {
//           if (sheet.projectId === expenseSheet.projectId) {
//             return {
//               ...sheet,
//               approvalStatus: "notsubmitted",
//               imageUrls: [...(expenseSheet.imageUrls || []), ...imageUrls],
//             };
//           }
//           return sheet;
//         });

//         if (
//           !newExpense.find(
//             (sheet) => sheet.projectId === expenseSheet.projectId
//           )
//         ) {
//           newExpense.push({
//             projectId: expenseSheet.projectId,
//             month: convertToUTC(selectedMonth),
//             expense: expenseSheet.expense,
//             id: 0,
//             approvalStatus: "notsubmitted",
//             category: expenseSheet.category,
//             imageUrls: [...(expenseSheet.imageUrls || []), ...imageUrls],
//           });
//         }
//         return newExpense;
//       });
//       setEditedRows((prev) => {
//         if (!prev.some((row) => row.projectId === expenseSheet.projectId)) {
//           return [...prev, { projectId: expenseSheet.projectId }];
//         } else {
//           return prev;
//         }
//       });
//     });
//   };

//   const handleImageDelete = (index, expenseSheet) => {
//     setExpenseSheetData((prevSheets) => {
//       const newSheet = prevSheets.expenseSheet.map((sheet) => {
//         if (sheet.projectId === expenseSheet.projectId) {
//           const newImageUrls = [...expenseSheet.imageUrls];
//           newImageUrls.splice(index, 1);
//           return { ...sheet, imageUrls: newImageUrls };
//         }
//         return sheet;
//       });
//       return { expenseSheet: newSheet };
//     });
//     setUpdatedExpenseSheet((prevExpense) => {
//       const newExpense = prevExpense.map((sheet) => {
//         if (sheet.projectId === expenseSheet.projectId) {
//           const newImageUrls = [...expenseSheet.imageUrls];
//           newImageUrls.splice(index, 1);
//           return { ...sheet, imageUrls: newImageUrls };
//         }
//         return sheet;
//       });

//       if (
//         !newExpense.find((sheet) => sheet.projectId === expenseSheet.projectId)
//       ) {
//         const newImageUrls = [...expenseSheet.imageUrls];
//         newImageUrls.splice(index, 1);
//         newExpense.push({
//           ...expenseSheet,
//           imageUrls: newImageUrls,
//         });
//       }
//       return newExpense;
//     });
//     setEditedRows((prev) => {
//       if (!prev.some((row) => row.projectId === expenseSheet.projectId)) {
//         return [...prev, { projectId: expenseSheet.projectId }];
//       } else {
//         return prev;
//       }
//     });
//   };

//   const handleCellClick = (e, projectId) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (editingCell?.projectId === projectId) {
//       return;
//     }
//     setEditingCell({ projectId });
//   };

//   const handleCellChange = (event, projectId, category, imageUrls, id) => {
//     const newValue = event.target.value;
//     setExpenseSheetData((prevExpense) => {
//       const newExpense = prevExpense?.expenseSheet?.map((expenseSheet) => {
//         return {
//           ...expenseSheet,
//           expense:
//             expenseSheet.projectId === projectId
//               ? +newValue
//               : expenseSheet.expense,
//         };
//       });
//       const newSheet = { expenseSheet: newExpense };
//       return newSheet;
//     });

//     setUpdatedExpenseSheet((prevExpense) => {
//       const expenseSheet = prevExpense.find(
//         (expenseSheet) => expenseSheet.projectId === projectId
//       );
//       if (expenseSheet) {
//         expenseSheet.expense = +newValue;
//         expenseSheet.category = category;
//         expenseSheet.imageUrls = [...(imageUrls || [])];
//         expenseSheet.approvalStatus = "notsubmitted";
//       } else {
//         prevExpense.push({
//           projectId,
//           month: convertToUTC(selectedMonth),
//           expense: +newValue,
//           id,
//           approvalStatus: "notsubmitted",
//           category,
//           imageUrls: [...(imageUrls || [])],
//         });
//       }
//       const newExpense = [...prevExpense];
//       return newExpense;
//     });

//     setEditedRows((prev) => {
//       if (!prev.some((row) => row.projectId === projectId)) {
//         return [...prev, { projectId }];
//       } else {
//         return prev;
//       }
//     });
//   };

//   const handleCategoryChange = (event, projectId, expense, imageUrls, id) => {
//     const newValue = event.target.value;
//     setExpenseSheetData((prevExpense) => {
//       const newExpense = prevExpense?.expenseSheet?.map((expenseSheet) => {
//         return {
//           ...expenseSheet,
//           category:
//             expenseSheet.projectId === projectId
//               ? newValue
//               : expenseSheet.category,
//         };
//       });
//       const newSheet = { expenseSheet: newExpense };
//       return newSheet;
//     });

//     setUpdatedExpenseSheet((prevExpense) => {
//       const expenseSheet = prevExpense.find(
//         (expenseSheet) => expenseSheet.projectId === projectId
//       );
//       if (expenseSheet) {
//         expenseSheet.category = newValue;
//         expenseSheet.expense = expense;
//         expenseSheet.imageUrls = [...(imageUrls || [])];
//         expenseSheet.approvalStatus = "notsubmitted";
//       } else {
//         prevExpense.push({
//           projectId,
//           month: convertToUTC(selectedMonth),
//           expense,
//           id,
//           approvalStatus: "notsubmitted",
//           category: newValue,
//           imageUrls: [...(imageUrls || [])],
//         });
//       }
//       const newExpense = [...prevExpense];
//       return newExpense;
//     });
//     setEditedRows((prev) => {
//       if (!prev.some((row) => row.projectId === projectId)) {
//         return [...prev, { projectId }];
//       } else {
//         return prev;
//       }
//     });
//   };

//   const handleSaveExpenseSheet = async (projectId) => {
//     setIsLoading(true);
//     const headers = {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${userInfo.access.token}`,
//     };
//     const filteredExpenseSheet = updatedExpenseSheet.filter(
//       (sheet) => sheet.projectId === projectId
//     );

//     const body = {
//       expenseSheet: filteredExpenseSheet,
//     };
//     await axiosIns.patch(`/expenseSheet/update`, body, { headers });
//     setUpdatedExpenseSheet([]);
//     setEditedRows([]);
//     setEditingCell(null);
//     setFinalExpenseList(expenseSheetData);
//     await fetchExpenseSheets();
//   };

//   const fetchExpenseSheets = useCallback(async () => {
//     setIsLoading(true);

//     if (userInfo && userInfo.access && userInfo.access.token) {
//       const headers = {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${userInfo.access.token}`,
//       };

//       try {
//         const { data } = await axiosIns.get(
//           `/expensesheet/list?month=${selectedMonth}`,
//           {
//             headers,
//           }
//         );
//         console.log(data, "===--sanajsajasncajs");
        
//         setExpenseSheetData(data);
//         setFinalExpenseList(data);
//         setEditedRows([]);
//         setUpdatedExpenseSheet([]);

//         // Get unique project managers
//         const managers = [
//           ...new Set(data.expenseSheet.map((item) => item.projectManager)),
//         ];
//         setUniqueManagers(managers);

//         filterExpenseSheets(data, searchTerm, selectedManager); // Apply filtering
//       } catch (error) {
//         console.error("Error fetching expenseSheets:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   }, [selectedMonth, userInfo]);

//   useEffect(() => {
//     fetchExpenseSheets();
//   }, [userInfo, selectedMonth, fetchExpenseSheets]);

//   const handleSubmitExpenseSheet = async (expId) => {
//     setIsLoading(true);
//     setUpdatedExpenseSheet([]);
//     setEditedRows([]);

//     // const expenseSheets = finalExpenseList.expenseSheet.filter(
//     //   (expenseSheet) =>
//     //     expenseSheet.approvalStatus === "notsubmitted" &&
//     //     expenseSheet.expense > 0
//     // );

//     const headers = {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${userInfo.access.token}`,
//     };

//     const body = {
//       // expenseSheets,
//       id: expId,
//       link: "/expenseSheetlist",
//     };
//     await axiosIns.post(`/expenseSheet/submit/all`, body, { headers });
//     setEditingCell(null);
//     setExpenseSheetData([]);
//     setFinalExpenseList([]);
//     await fetchExpenseSheets();
//   };

//   // Filter logic based on search term and selected project manager
//   const filterExpenseSheets = (data, searchTerm, selectedManager) => {
//     let filteredData = data.expenseSheet;

//     if (searchTerm) {
//       filteredData = filteredData?.filter((sheet) =>
//         sheet?.project?.projectname?.toLowerCase()?.includes(searchTerm?.toLowerCase())
//       );
//     }

//     if (selectedManager) {
//       filteredData = filteredData.filter(
//         (sheet) => sheet?.project?.manager?.id == selectedManager
//       );
//     }

//     setFilteredExpenseData(filteredData);
//   };

//   useEffect(() => {
//     if (expenseSheetData?.expenseSheet) {
//       filterExpenseSheets(expenseSheetData, searchTerm, selectedManager);
//     }
//   }, [searchTerm, selectedManager, expenseSheetData]);

//   const handleDocumentClick = (event) => {
//     if (event.target.tagName !== "INPUT") {
//       setEditingCell(null);
//     }
//   };

//   React.useEffect(() => {
//     document.addEventListener("click", handleDocumentClick);
//     return () => {
//       document.removeEventListener("click", handleDocumentClick);
//     };
//   }, []);

//   const handleDelete = async (expenseSheet) => {
//     const body = {
//       expenseSheet,
//     };
//     setIsLoading(true);

//     await dispatch(
//       deleteExpensesheet({ token: userInfo.access.token, body })
//     ).unwrap();
//     await fetchExpenseSheets();
//   };

//   return (
//     <div className="pt-6 px-5 mt-4">
//       {/* Inputs in a single row aligned to the right */}
//       <div className="flex justify-between">
//       <Button className="bg-main hover:bg-main/90 px-3 mt-5" onClick={()=>navigate("/createexpensesheet")}>Create Expense Sheet</Button>
//       <div className="flex justify-end items-center gap-4">
//         <div className="flex flex-col mt-1">
//           <Label htmlFor="calender" className="text-sm font-medium leading-none mb-1">Select Date</Label>
//           <MonthCalendar
//             id="calender"
//             selectedMonth={selectedMonth}
//             setSelectedMonth={(value) => {
//               setSelectedMonth(value);
//             }}
//             className="relative z-[9999]"
//           />
//         </div>

//         <div>
//           <Label htmlFor="searchName">Search by Project Name</Label>
//           <Input
//             id="searchName"
//             type="text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="Enter project name"
//           />
//         </div>

        

//         <div>
//           <Label htmlFor="projectManager">Filter by Project Manager</Label>
//           <select
//             id="projectManager"
//             className="w-full  border rounded-md h-9"
//             value={selectedManager}
//             onChange={(e) => setSelectedManager(e.target.value)}
//           >
//             <option value="">All Managers</option>
//             {expenseSheetData?.expenseSheet?.map((sheet, index) => (
//               <option key={index} value={sheet?.project?.manager?.name}>
//                 {sheet?.project?.manager?.name}
//               </option>
//             ))}
//             {/* {expenseSheetData?.expenseSheet?.map((manager, index) => (
//               <option key={index} value={manager["project.manager.id"]}>
//                 {manager["project.manager.name"]}
//               </option>
//             ))} */}
//           </select>
//         </div>
//       </div>
//       </div>
 
//       {isLoading ? (
//         <div className="flex justify-center items-center">
//           <Loader />
//         </div>
//       ) : (
//         <>
//           {filteredExpenseData?.length > 0 ? (
//             <Table className="mt-8">
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Project Manager</TableHead>
//                   <TableHead>Project Name</TableHead>
//                   <TableHead>Expense</TableHead>
//                   <TableHead>Category</TableHead>
//                   <TableHead>Receipts</TableHead>
//                   <TableHead>Status</TableHead>
//                   {(userInfo?.roleAccess === ADMIN || userInfo?.roleAccess === OPERATIONAL_DIRECTOR) && (
//                     <TableHead>Action</TableHead>
//                   )}
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredExpenseData?.map((expenseSheet, index) => (
//                   <TableRow key={index} className="cursor-pointer">
//                     <TableCell>{expenseSheet?.project?.manager?.name}</TableCell>
//                     <TableCell>{expenseSheet?.project?.projectname}</TableCell>
//                     <TableCell
//                       key={index}
//                       onClick={(e) =>
//                         handleCellClick(e, expenseSheet.projectId)
//                       }
//                     >
//                       <EditableCell
//                         value={expenseSheet?.expense ?? 0}
//                         onChange={(event) => {
//                           handleCellChange(
//                             event,
//                             expenseSheet.projectId,
//                             expenseSheet.category,
//                             expenseSheet?.imageUrls,
//                             expenseSheet?.id ?? 0
//                           );
//                         }}
//                         isEditing={
//                           editingCell?.projectId === expenseSheet.projectId
//                         }
//                         projectId={expenseSheet.projectId}
//                       />
//                     </TableCell>
//                     <TableCell className="text-[#011c3b]">
//                       <select
//                         id="team1"
//                         name="project"
//                         className="w-11/12 mt-1 text-sm focus:border-blue-400 focus:outline-none focus:shadow-outline-blue form-input border rounded-md px-2 py-2"
//                         value={expenseSheet?.category}
//                         onChange={(event) =>
//                           handleCategoryChange(
//                             event,
//                             expenseSheet.projectId,
//                             expenseSheet.expense,
//                             expenseSheet?.imageUrls,
//                             expenseSheet?.id ?? 0
//                           )
//                         }
//                         required
//                       >
//                         <option value="Mileage">Mileage</option>
//                         <option value="Train Travel">Train Travel</option>
//                         <option value="Hire car">Hire car</option>
//                         <option value="Hire car fuel">Hire car fuel</option>
//                         <option value="Taxi">Taxi</option>
//                         <option value="Other travel">Other travel</option>
//                         <option value="Subsistence/ meals">
//                           Subsistence/ meals
//                         </option>
//                         <option value="Overnight accommodation">
//                           Overnight accommodation
//                         </option>
//                         <option value="Printing">Printing</option>
//                         <option value="Photocopying">Photocopying</option>
//                         <option value="IT consumables">IT consumables</option>
//                         <option value="Courier">Courier</option>
//                         <option value="Phone">Phone</option>
//                         <option value="Postage">Postage</option>
//                         <option value="Training">Training</option>
//                         <option value="Professional subscriptions">
//                           Professional subscriptions
//                         </option>
//                         <option value="Client entertaining">
//                           Client entertaining
//                         </option>
//                         <option value="Staff entertaining">
//                           Staff entertaining
//                         </option>
//                         <option value="Other/ sundry costs">
//                           Other/ sundry costs
//                         </option>
//                       </select>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex flex-col justify-center items-center gap-2">
//                         <div className="flex flex-wrap justify-center gap-3">
//                           {expenseSheet?.imageUrls?.map((url, index) => (
//                             <div
//                               key={index}
//                               className="w-32 h-32 rounded-lg shadow-md bg-slate-500 relative"
//                             >
//                               <img
//                                 className="w-full h-full object-cover"
//                                 src={url}
//                                 alt={`Expense ${expenseSheet?.projectId}`}
//                               />
//                               {(expenseSheet.approvalStatus?.toLowerCase() ===
//                                 "notsubmitted" ||
//                                 expenseSheet.approvalStatus?.toLowerCase() ===
//                                   "rejected") && (
//                                   <div
//                                     className="absolute top-[-10px] right-[-10px] p-1 border-none cursor-pointer bg-red-500 hover:bg-red-600 rounded-full"
//                                     onClick={() =>
//                                       handleImageDelete(index, expenseSheet)
//                                     }
//                                   >
//                                     <X size={24} color="black" />
//                                   </div>
//                                 )}
//                             </div>
//                           ))}
//                         </div>
//                         {(expenseSheet.approvalStatus?.toLowerCase() ===
//                           "notsubmitted" ||
//                           expenseSheet.approvalStatus?.toLowerCase() ===
//                             "rejected") && (
//                           <div className="grid w-[147px] max-w-sm items-center gap-1.5">
//                             <Label
//                               htmlFor={`picture${expenseSheet?.projectId}`}
//                               className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[#002147] text-primary-foreground shadow hover:bg-[#011c3b] h-9 px-4 py-2"
//                             >
//                               Upload Receipts
//                             </Label>

//                             <Input
//                               id={`picture${expenseSheet?.projectId}`}
//                               type="file"
//                               accept=".jpg,.jpeg,.png"
//                               multiple
//                               style={{ display: "none" }}
//                               onChange={(event) => {
//                                 handleAddImages(event, expenseSheet);
//                               }}
//                             />
//                           </div>
//                         )}
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-[#9333EA]">
//                       <Popover>
//                         <PopoverTrigger asChild>
//                           <Button
//                             variant="outline"
//                             className={`rounded-2xl p-1 h-auto px-4 border-0 hover:text-white ${
//                               !expenseSheet?.approvalStatus ||
//                               expenseSheet.approvalStatus === "notsubmitted"
//                                 ? "text-[#6DA5B8] bg-[#F2FAFD] hover:bg-[#6DA5B8]"
//                                 : expenseSheet.approvalStatus === "submitted"
//                                 ? "text-[#6DA5B8] bg-[#F2FAFD] hover:bg-[#6DA5B8]"
//                                 : expenseSheet.approvalStatus === "approved"
//                                 ? "text-green-700 bg-green-200 hover:bg-green-700"
//                                 : "text-red-700 bg-red-200 hover:bg-red-700"
//                             }`}
//                           >
//                             {!expenseSheet?.approvalStatus ||
//                             expenseSheet.approvalStatus === "notsubmitted"
//                               ? "Not submitted"
//                               : expenseSheet.approvalStatus === "submitted"
//                               ? "Pending"
//                               : expenseSheet.approvalStatus === "approved"
//                               ? "Approved"
//                               : "Rejected"}
//                           </Button>
//                         </PopoverTrigger>
//                         {!expenseSheet?.approvalStatus ||
//                         expenseSheet.approvalStatus === "notsubmitted" ||
//                         expenseSheet.approvalStatus === "submitted" ? (
//                           <></>
//                         ) : (
//                           <PopoverContent className="w-40">
//                             <div className="grid gap-4 place-items-center">
//                               <div className="space-y-2 text-center">
//                                 <h4 className="font-medium leading-none ">
//                                   Comments
//                                 </h4>
//                                 <p className="text-sm text-muted-foreground">
//                                   {expenseSheet?.comments
//                                     ? expenseSheet.comments
//                                     : " No comments"}
//                                 </p>
//                               </div>
//                             </div>
//                           </PopoverContent>
//                         )}
//                       </Popover>
//                     </TableCell>
//                     {(userInfo?.roleAccess === ADMIN || userInfo?.roleAccess === OPERATIONAL_DIRECTOR) && (
//                       <TableCell>
//                         {expenseSheet.expense > 0 && expenseSheet?.id && (
//                           <Dialog>
//                             <DialogTrigger asChild>
//                               <div
//                                 className="p-2 cursor-pointer"
//                                 onClick={(e) => e.stopPropagation()}
//                               >
//                                 <Trash2 className="text-primary " size={22} />
//                               </div>
//                             </DialogTrigger>
//                             <DialogContent className="sm:max-w-[425px]">
//                               <DialogHeader>
//                                 <DialogTitle>
//                                   Are you sure you want to delete this
//                                   expensesheet?
//                                 </DialogTitle>
//                               </DialogHeader>
//                               <DialogFooter className="pt-10">
//                                 <DialogClose asChild>
//                                   <Button
//                                     type="button"
//                                     className="text-white bg-[red] hover:bg-[red]"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       handleDelete(expenseSheet);
//                                     }}
//                                   >
//                                     Yes
//                                   </Button>
//                                 </DialogClose>
//                                 <DialogClose asChild>
//                                   <Button
//                                     type="button"
//                                     className="text-[black] bg-[#E2E8F0] hover:bg-[#E2E8F0]"
//                                     onClick={(e) => e.stopPropagation()}
//                                   >
//                                     No
//                                   </Button>
//                                 </DialogClose>
//                               </DialogFooter>
//                             </DialogContent>
//                           </Dialog>
//                         )}
//                       </TableCell>
//                     )}

//                     <TableCell>
//                       <div className="flex gap-2 justify-center">
//                         {editedRows.some(
//                           (row) => row.projectId === expenseSheet.projectId
//                         ) && (
//                           <Dialog>
//                             <DialogTrigger asChild>
//                               <Button className="flex">Save</Button>
//                             </DialogTrigger>
//                             <DialogContent className="sm:max-w-[425px]">
//                               <DialogHeader>
//                                 <DialogTitle>
//                                   <p className="leading-6">
//                                     Are you sure you want to save this
//                                     expensesheet?
//                                   </p>
//                                 </DialogTitle>
//                               </DialogHeader>
//                               <DialogFooter className="pt-10">
//                                 <DialogClose asChild>
//                                   <Button
//                                     type="button"
//                                     className="text-white bg-[green] hover:bg-[green]"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       handleSaveExpenseSheet(
//                                         expenseSheet.projectId
//                                       );
//                                     }}
//                                   >
//                                     Yes
//                                   </Button>
//                                 </DialogClose>
//                                 <DialogClose asChild>
//                                   <Button
//                                     type="button"
//                                     className="text-[black] bg-[#E2E8F0] hover:bg-[#E2E8F0]"
//                                   >
//                                     No
//                                   </Button>
//                                 </DialogClose>
//                               </DialogFooter>
//                             </DialogContent>
//                           </Dialog>
//                         )}
//                         {finalExpenseList?.expenseSheet?.some(
//                           (ts) =>
//                             (ts.approvalStatus === "notsubmitted" || (ts.approvalStatus === "submitted" && [ADMIN, DIRECTOR, OPERATIONAL_DIRECTOR, PROJECT_MANAGER].includes(userInfo?.roleAccess))) &&
//                             ts.expense > 0 &&
//                             ts.projectId === expenseSheet.projectId
//                         ) && (
//                           <div className="flex justify-center">
//                             <Dialog>
//                               <DialogTrigger asChild>
//                                 <Button className="flex">
//                                   Submit{" "}
//                                   {userInfo?.roleAccess === GENERAL && (
//                                     <span>&nbsp;For Approval</span>
//                                   )}
//                                 </Button>
//                               </DialogTrigger>
//                               <DialogContent className="sm:max-w-[425px]">
//                                 <DialogHeader>
//                                   <DialogTitle>
//                                     <p className="leading-6">
//                                       Are you sure you want to submit this
//                                       expensesheet?
//                                     </p>
//                                   </DialogTitle>
//                                 </DialogHeader>
//                                 <DialogFooter className="pt-10">
//                                   <DialogClose asChild>
//                                     <Button
//                                       type="button"
//                                       className="text-white bg-[green] hover:bg-[green]"
//                                       onClick={() =>handleSubmitExpenseSheet(expenseSheet?.id)}
//                                     >
//                                       Yes
//                                     </Button>
//                                   </DialogClose>
//                                   <DialogClose asChild>
//                                     <Button
//                                       type="button"
//                                       className="text-[black] bg-[#E2E8F0] hover:bg-[#E2E8F0]"
//                                     >
//                                       No
//                                     </Button>
//                                   </DialogClose>
//                                 </DialogFooter>
//                               </DialogContent>
//                             </Dialog>
//                           </div>
//                         )}
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//                 <TableRow className="cursor-pointer">
//                   <TableCell></TableCell>
//                   <TableCell className="text-[#011c3b] text-center text-lg font-bold">
//                     Total
//                   </TableCell>
//                   <TableCell>
//                     {`£${expenseSheetData?.expenseSheet?.reduce(
//                       (acc, expenseData) => acc + +(expenseData?.expense ?? 0),
//                       0
//                     )}`}
//                   </TableCell>
//                 </TableRow>
//               </TableBody>
//             </Table>
//           ) : (
//             <p>No ExpenseSheet available.</p>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default ExpenseSheet;








































// /* eslint-disable react/prop-types */
// import React, { useCallback, useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { authSelector } from "@/redux/auth/authSlice";
// import { useSelector, useDispatch } from "react-redux";
// import Loader from "../components/loader";
// import TableWrapper from "@/components/Wrapper/TableWrapper";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import MonthCalendar from "@/components/MonthCalendar/MonthCalendar";
// import axiosIns from "@/api/axios";
// import { GENERAL, ADMIN } from "@/constants";
// import { convertToUTC } from "@/lib/utils";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { X, Trash2 } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogClose,
// } from "@/components/ui/dialog";
// import { put } from "@vercel/blob";
// import { deleteExpensesheet } from "@/redux/expensesheet/expenseSheetThunk";

// const ExpenseSheet = () => {
//   const [selectedMonth, setSelectedMonth] = useState(new Date());
//   const dispatch = useDispatch();
//   const { userInfo } = useSelector(authSelector);
//   const [isLoading, setIsLoading] = useState(true);
//   const [editingCell, setEditingCell] = useState(null);
//   const [finalExpenseList, setFinalExpenseList] = useState([]);
//   const [updatedExpenseSheet, setUpdatedExpenseSheet] = useState([]);
//   const [expenseSheetData, setExpenseSheetData] = useState([]);
//   const [editedRows, setEditedRows] = useState([]);

//   const EditableCell = ({ value, onChange, isEditing }) => {
//     return isEditing ? (
//       <input
//         type="number"
//         autoFocus
//         value={value}
//         onChange={onChange}
//         className="w-[105px] pl-[3px]"
//       />
//     ) : (
//       <span className="w-[105px] pl-[3px]"> {`£${value}`}</span>
//     );
//   };

//   const handleAddImages = (event, expenseSheet) => {
//     const files = Array.from(event.target.files);
//     event.preventDefault();

//     const promises = files.map(async (file) => {
//       return new Promise(async (resolve) => {
//         try {
//           const { url } = await put(file.name, file, {
//             access: "public",
//             token: import.meta.env.VITE_BLOB_READ_WRITE_TOKEN,
//           });

//           resolve(url);
//         } catch (error) {
//           console.error(
//             "There was a problem with the fetch operation: " + error.message
//           );
//         }
//       });
//     });

//     Promise.all(promises).then(async (imageUrls) => {
//       setExpenseSheetData((prevSheets) => {
//         const newSheet = prevSheets.expenseSheet.map((sheet) => {
//           return sheet.projectId === expenseSheet.projectId
//             ? {
//                 ...sheet,
//                 imageUrls: [...(expenseSheet.imageUrls || []), ...imageUrls],
//               }
//             : sheet;
//         });
//         return { expenseSheet: newSheet };
//       });
//       setUpdatedExpenseSheet((prevExpense) => {
//         const newExpense = prevExpense.map((sheet) => {
//           if (sheet.projectId === expenseSheet.projectId) {
//             return {
//               ...sheet,
//               approvalStatus: "notsubmitted",
//               imageUrls: [...(expenseSheet.imageUrls || []), ...imageUrls],
//             };
//           }
//           return sheet;
//         });

//         if (
//           !newExpense.find(
//             (sheet) => sheet.projectId === expenseSheet.projectId
//           )
//         ) {
//           newExpense.push({
//             projectId: expenseSheet.projectId,
//             month: convertToUTC(selectedMonth),
//             expense: expenseSheet.expense,
//             id: 0,
//             approvalStatus: "notsubmitted",
//             category: expenseSheet.category,
//             imageUrls: [...(expenseSheet.imageUrls || []), ...imageUrls],
//           });
//         }
//         return newExpense;
//       });
//       setEditedRows((prev) => {
//         if (!prev.some((row) => row.projectId === expenseSheet.projectId)) {
//           return [...prev, { projectId: expenseSheet.projectId }];
//         } else {
//           return prev;
//         }
//       });
//     });
//   };

//   const handleImageDelete = (index, expenseSheet) => {
//     setExpenseSheetData((prevSheets) => {
//       const newSheet = prevSheets.expenseSheet.map((sheet) => {
//         if (sheet.projectId === expenseSheet.projectId) {
//           const newImageUrls = [...expenseSheet.imageUrls];
//           newImageUrls.splice(index, 1);
//           return { ...sheet, imageUrls: newImageUrls };
//         }
//         return sheet;
//       });
//       return { expenseSheet: newSheet };
//     });
//     setUpdatedExpenseSheet((prevExpense) => {
//       const newExpense = prevExpense.map((sheet) => {
//         if (sheet.projectId === expenseSheet.projectId) {
//           const newImageUrls = [...expenseSheet.imageUrls];
//           newImageUrls.splice(index, 1);
//           return { ...sheet, imageUrls: newImageUrls };
//         }
//         return sheet;
//       });

//       if (
//         !newExpense.find((sheet) => sheet.projectId === expenseSheet.projectId)
//       ) {
//         const newImageUrls = [...expenseSheet.imageUrls];
//         newImageUrls.splice(index, 1);
//         newExpense.push({
//           ...expenseSheet,
//           imageUrls: newImageUrls,
//         });
//       }
//       return newExpense;
//     });
//     setEditedRows((prev) => {
//       if (!prev.some((row) => row.projectId === expenseSheet.projectId)) {
//         return [...prev, { projectId: expenseSheet.projectId }];
//       } else {
//         return prev;
//       }
//     });
//   };

//   const handleCellClick = (e, projectId) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (editingCell?.projectId === projectId) {
//       return;
//     }
//     setEditingCell({ projectId });
//   };

//   const handleCellChange = (event, projectId, category, imageUrls, id) => {
//     const newValue = event.target.value;
//     setExpenseSheetData((prevExpense) => {
//       const newExpense = prevExpense?.expenseSheet?.map((expenseSheet) => {
//         return {
//           ...expenseSheet,
//           expense:
//             expenseSheet.projectId === projectId
//               ? +newValue
//               : expenseSheet.expense,
//         };
//       });
//       const newSheet = { expenseSheet: newExpense };
//       return newSheet;
//     });

//     setUpdatedExpenseSheet((prevExpense) => {
//       const expenseSheet = prevExpense.find(
//         (expenseSheet) => expenseSheet.projectId === projectId
//       );
//       if (expenseSheet) {
//         expenseSheet.expense = +newValue;
//         expenseSheet.category = category;
//         expenseSheet.imageUrls = [...(imageUrls || [])];
//         expenseSheet.approvalStatus = "notsubmitted";
//       } else {
//         prevExpense.push({
//           projectId,
//           month: convertToUTC(selectedMonth),
//           expense: +newValue,
//           id,
//           approvalStatus: "notsubmitted",
//           category,
//           imageUrls: [...(imageUrls || [])],
//         });
//       }
//       const newExpense = [...prevExpense];
//       return newExpense;
//     });

//     setEditedRows((prev) => {
//       if (!prev.some((row) => row.projectId === projectId)) {
//         return [...prev, { projectId }];
//       } else {
//         return prev;
//       }
//     });
//   };

//   const handleCategoryChange = (event, projectId, expense, imageUrls, id) => {
//     const newValue = event.target.value;
//     setExpenseSheetData((prevExpense) => {
//       const newExpense = prevExpense?.expenseSheet?.map((expenseSheet) => {
//         return {
//           ...expenseSheet,
//           category:
//             expenseSheet.projectId === projectId
//               ? newValue
//               : expenseSheet.category,
//         };
//       });
//       const newSheet = { expenseSheet: newExpense };
//       return newSheet;
//     });

//     setUpdatedExpenseSheet((prevExpense) => {
//       const expenseSheet = prevExpense.find(
//         (expenseSheet) => expenseSheet.projectId === projectId
//       );
//       if (expenseSheet) {
//         expenseSheet.category = newValue;
//         expenseSheet.expense = expense;
//         expenseSheet.imageUrls = [...(imageUrls || [])];
//         expenseSheet.approvalStatus = "notsubmitted";
//       } else {
//         prevExpense.push({
//           projectId,
//           month: convertToUTC(selectedMonth),
//           expense,
//           id,
//           approvalStatus: "notsubmitted",
//           category: newValue,
//           imageUrls: [...(imageUrls || [])],
//         });
//       }
//       const newExpense = [...prevExpense];
//       return newExpense;
//     });
//     setEditedRows((prev) => {
//       if (!prev.some((row) => row.projectId === projectId)) {
//         return [...prev, { projectId }];
//       } else {
//         return prev;
//       }
//     });
//   };

//   const handleSaveExpenseSheet = async (projectId) => {
//     setIsLoading(true);
//     const headers = {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${userInfo.access.token}`,
//     };
//     const filteredExpenseSheet = updatedExpenseSheet.filter(
//       (sheet) => sheet.projectId === projectId
//     );

//     const body = {
//       expenseSheet: filteredExpenseSheet,
//     };
//     await axiosIns.patch(`/expenseSheet/update`, body, { headers });
//     setUpdatedExpenseSheet([]);
//     setEditedRows([]);
//     setEditingCell(null);
//     setFinalExpenseList(expenseSheetData);
//     await fetchExpenseSheets();
//   };

//   const handleSubmitExpenseSheet = async () => {
//     setIsLoading(true);
//     setUpdatedExpenseSheet([]);
//     setEditedRows([]);

//     const expenseSheets = finalExpenseList.expenseSheet.filter(
//       (expenseSheet) =>
//         expenseSheet.approvalStatus === "notsubmitted" &&
//         expenseSheet.expense > 0
//     );

//     const headers = {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${userInfo.access.token}`,
//     };

//     const body = {
//       expenseSheets,
//       link: "/expenseSheetlist",
//     };
//     await axiosIns.post(`/expenseSheet/submit/all`, body, { headers });
//     setEditingCell(null);
//     setExpenseSheetData([]);
//     setFinalExpenseList([]);
//     await fetchExpenseSheets();
//   };

//   const fetchExpenseSheets = useCallback(async () => {
//     setIsLoading(true);

//     if (userInfo && userInfo.access && userInfo.access.token) {
//       const headers = {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${userInfo.access.token}`,
//       };

//       try {
//         const { data } = await axiosIns.get(
//           `/expensesheet/list?month=${selectedMonth}`,
//           {
//             headers,
//           }
//         );
//         setExpenseSheetData(data);
//         setFinalExpenseList(data);
//         setEditedRows([]);
//         setUpdatedExpenseSheet([]);
//       } catch (error) {
//         console.error("Error fetching expenseSheets:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   }, [selectedMonth, userInfo]);

  // const handleDelete = async (expenseSheet) => {
  //   const body = {
  //     expenseSheet,
  //   };
  //   setIsLoading(true);

  //   await dispatch(
  //     deleteExpensesheet({ token: userInfo.access.token, body })
  //   ).unwrap();
  //   await fetchExpenseSheets();
  // };

//   useEffect(() => {
//     fetchExpenseSheets();
//   }, [userInfo, selectedMonth, fetchExpenseSheets]);

//   const handleDocumentClick = (event) => {
//     if (event.target.tagName !== "INPUT") {
//       setEditingCell(null);
//     }
//   };

//   React.useEffect(() => {
//     document.addEventListener("click", handleDocumentClick);
//     return () => {
//       document.removeEventListener("click", handleDocumentClick);
//     };
//   }, []);

//   return (
//     // <TableWrapper heading={"Expense sheet"}>
//     <div className="pt-6 px-5">
//       <MonthCalendar
//         selectedMonth={selectedMonth}
//         setSelectedMonth={(value) => {
//           setSelectedMonth(value);
//         }}
//         className="relative z-[9999]" // Adjusted z-index for date picker
//       />
//       {isLoading ? (
//         <div className="flex justify-center items-center">
//           <Loader />
//         </div>
//       ) : (
//         <>
//           {expenseSheetData && expenseSheetData.expenseSheet?.length > 0 ? (
//             <Table className="mt-8">
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Project Manager</TableHead>
//                   <TableHead>Project Name</TableHead>
//                   <TableHead>Expense</TableHead>
//                   <TableHead>Category</TableHead>
//                   <TableHead>Receipts</TableHead>
//                   <TableHead>Status</TableHead>
//                   {userInfo?.roleAccess === ADMIN && (
//                     <TableHead>Action</TableHead>
//                   )}
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {expenseSheetData?.expenseSheet?.map((expenseSheet, index) => (
//                   <TableRow key={index} className="cursor-pointer">
//                     <TableCell>{expenseSheet.projectManager}</TableCell>
//                     <TableCell>{expenseSheet.projectName}</TableCell>
//                     <TableCell
//                       key={index}
//                       onClick={(e) =>
//                         handleCellClick(e, expenseSheet.projectId)
//                       }
//                     >
//                       <EditableCell
//                         value={expenseSheet?.expense ?? 0}
//                         onChange={(event) => {
//                           handleCellChange(
//                             event,
//                             expenseSheet.projectId,
//                             expenseSheet.category,
//                             expenseSheet?.imageUrls,
//                             expenseSheet?.id ?? 0
//                           );
//                         }}
//                         isEditing={
//                           editingCell?.projectId === expenseSheet.projectId
//                         }
//                         projectId={expenseSheet.projectId}
//                       />
//                     </TableCell>
//                     <TableCell className="text-[#011c3b]">
//                       <select
//                         id="team1"
//                         name="project"
//                         className="w-11/12 mt-1 text-sm focus:border-blue-400 focus:outline-none focus:shadow-outline-blue form-input border rounded-md px-2 py-2"
//                         value={expenseSheet?.category}
//                         onChange={(event) =>
//                           handleCategoryChange(
//                             event,
//                             expenseSheet.projectId,
//                             expenseSheet.expense,
//                             expenseSheet?.imageUrls,
//                             expenseSheet?.id ?? 0
//                           )
//                         }
//                         required
//                       >
//                         <option value="Mileage">Mileage</option>
//                         <option value="Train Travel">Train Travel</option>
//                         <option value="Hire car">Hire car</option>
//                         <option value="Hire car fuel">Hire car fuel</option>
//                         <option value="Taxi">Taxi</option>
//                         <option value="Other travel">Other travel</option>
//                         <option value="Subsistence/ meals">
//                           Subsistence/ meals
//                         </option>
//                         <option value="Overnight accommodation">
//                           Overnight accommodation
//                         </option>
//                         <option value="Printing">Printing</option>
//                         <option value="Photocopying">Photocopying</option>
//                         <option value="IT consumables">IT consumables</option>
//                         <option value="Courier">Courier</option>
//                         <option value="Phone">Phone</option>
//                         <option value="Postage">Postage</option>
//                         <option value="Training">Training</option>
//                         <option value="Professional subscriptions">
//                           Professional subscriptions
//                         </option>
//                         <option value="Client entertaining">
//                           Client entertaining
//                         </option>
//                         <option value="Staff entertaining">
//                           Staff entertaining
//                         </option>
//                         <option value="Other/ sundry costs">
//                           Other/ sundry costs
//                         </option>
//                       </select>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex flex-col justify-center items-center gap-2">
//                         <div className="flex flex-wrap justify-center gap-3">
//                           {expenseSheet?.imageUrls?.map((url, index) => (
//                             <div
//                               key={index}
//                               className="w-32 h-32 rounded-lg shadow-md bg-slate-500 relative"
//                             >
//                               <img
//                                 className="w-full h-full object-cover"
//                                 src={url}
//                                 alt={`Expense ${expenseSheet.projectId}`}
//                               />
//                               {(expenseSheet.approvalStatus.toLowerCase() ===
//                                 "notsubmitted" ||
//                                 expenseSheet.approvalStatus.toLowerCase() ===
//                                   "rejected") && (
//                                   <div
//                                     className="absolute top-[-10px] right-[-10px] p-1 border-none cursor-pointer bg-red-500 hover:bg-red-600 rounded-full"
//                                     onClick={() =>
//                                       handleImageDelete(index, expenseSheet)
//                                     }
//                                   >
//                                     <X size={24} color="black" />
//                                   </div>
//                                 )}
//                             </div>
//                           ))}
//                         </div>
//                         {(expenseSheet.approvalStatus.toLowerCase() ===
//                           "notsubmitted" ||
//                           expenseSheet.approvalStatus.toLowerCase() ===
//                             "rejected") && (
//                           <div className="grid w-[147px] max-w-sm items-center gap-1.5">
//                             <Label
//                               htmlFor={`picture${expenseSheet.projectId}`}
//                               className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[#002147] text-primary-foreground shadow hover:bg-[#011c3b] h-9 px-4 py-2"
//                             >
//                               Upload Receipts
//                             </Label>

//                             <Input
//                               id={`picture${expenseSheet.projectId}`}
//                               type="file"
//                               accept=".jpg,.jpeg,.png"
//                               multiple
//                               style={{ display: "none" }}
//                               onChange={(event) => {
//                                 handleAddImages(event, expenseSheet);
//                               }}
//                             />
//                           </div>
//                         )}
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-[#9333EA]">
//                       <Popover>
//                         <PopoverTrigger asChild>
//                           <Button
//                             variant="outline"
//                             className={`rounded-2xl p-1 h-auto px-4 border-0 hover:text-white ${
//                               !expenseSheet?.approvalStatus ||
//                               expenseSheet.approvalStatus === "notsubmitted"
//                                 ? "text-[#6DA5B8] bg-[#F2FAFD] hover:bg-[#6DA5B8]"
//                                 : expenseSheet.approvalStatus === "submitted"
//                                 ? "text-[#6DA5B8] bg-[#F2FAFD] hover:bg-[#6DA5B8]"
//                                 : expenseSheet.approvalStatus === "approved"
//                                 ? "text-green-700 bg-green-200 hover:bg-green-700"
//                                 : "text-red-700 bg-red-200 hover:bg-red-700"
//                             }`}
//                           >
//                             {!expenseSheet?.approvalStatus ||
//                             expenseSheet.approvalStatus === "notsubmitted"
//                               ? "Not submitted"
//                               : expenseSheet.approvalStatus === "submitted"
//                               ? "Pending"
//                               : expenseSheet.approvalStatus === "approved"
//                               ? "Approved"
//                               : "Rejected"}
//                           </Button>
//                         </PopoverTrigger>
//                         {!expenseSheet?.approvalStatus ||
//                         expenseSheet.approvalStatus === "notsubmitted" ||
//                         expenseSheet.approvalStatus === "submitted" ? (
//                           <></>
//                         ) : (
//                           <PopoverContent className="w-40">
//                             <div className="grid gap-4 place-items-center">
//                               <div className="space-y-2 text-center">
//                                 <h4 className="font-medium leading-none ">
//                                   Comments
//                                 </h4>
//                                 <p className="text-sm text-muted-foreground">
//                                   {expenseSheet?.comments
//                                     ? expenseSheet.comments
//                                     : " No comments"}
//                                 </p>
//                               </div>
//                             </div>
//                           </PopoverContent>
//                         )}
//                       </Popover>
//                     </TableCell>
//                     {userInfo?.roleAccess === ADMIN && (
//                       <TableCell>
//                         {expenseSheet.expense > 0 && expenseSheet?.id && (
//                           <Dialog>
//                             <DialogTrigger asChild>
//                               <div
//                                 className="p-2 cursor-pointer"
//                                 onClick={(e) => e.stopPropagation()}
//                               >
//                                 <Trash2 className="text-primary " size={22} />
//                               </div>
//                             </DialogTrigger>
//                             <DialogContent className="sm:max-w-[425px]">
//                               <DialogHeader>
//                                 <DialogTitle>
//                                   Are you sure you want to delete this
//                                   expensesheet?
//                                 </DialogTitle>
//                               </DialogHeader>
//                               <DialogFooter className="pt-10">
//                                 <DialogClose asChild>
//                                   <Button
//                                     type="button"
//                                     className="text-white bg-[red] hover:bg-[red]"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       handleDelete(expenseSheet);
//                                     }}
//                                   >
//                                     Yes
//                                   </Button>
//                                 </DialogClose>
//                                 <DialogClose asChild>
//                                   <Button
//                                     type="button"
//                                     className="text-[black] bg-[#E2E8F0] hover:bg-[#E2E8F0]"
//                                     onClick={(e) => e.stopPropagation()}
//                                   >
//                                     No
//                                   </Button>
//                                 </DialogClose>
//                               </DialogFooter>
//                             </DialogContent>
//                           </Dialog>
//                         )}
//                       </TableCell>
//                     )}

//                     <TableCell>
//                       <div className="flex gap-2 justify-center">
//                         {editedRows.some(
//                           (row) => row.projectId === expenseSheet.projectId
//                         ) && (
//                           <Dialog>
//                             <DialogTrigger asChild>
//                               <Button className="flex">Save</Button>
//                             </DialogTrigger>
//                             <DialogContent className="sm:max-w-[425px]">
//                               <DialogHeader>
//                                 <DialogTitle>
//                                   <p className="leading-6">
//                                     Are you sure you want to save this
//                                     expensesheet?
//                                   </p>
//                                 </DialogTitle>
//                               </DialogHeader>
//                               <DialogFooter className="pt-10">
//                                 <DialogClose asChild>
//                                   <Button
//                                     type="button"
//                                     className="text-white bg-[green] hover:bg-[green]"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       handleSaveExpenseSheet(
//                                         expenseSheet.projectId
//                                       );
//                                     }}
//                                   >
//                                     Yes
//                                   </Button>
//                                 </DialogClose>
//                                 <DialogClose asChild>
//                                   <Button
//                                     type="button"
//                                     className="text-[black] bg-[#E2E8F0] hover:bg-[#E2E8F0]"
//                                   >
//                                     No
//                                   </Button>
//                                 </DialogClose>
//                               </DialogFooter>
//                             </DialogContent>
//                           </Dialog>
//                         )}
//                         {finalExpenseList?.expenseSheet?.some(
//                           (ts) =>
//                             ts.approvalStatus === "notsubmitted" &&
//                             ts.expense > 0 &&
//                             ts.projectId === expenseSheet.projectId
//                         ) && (
//                           <div className="flex justify-center">
//                             <Dialog>
//                               <DialogTrigger asChild>
//                                 <Button className="flex">
//                                   Submit{" "}
//                                   {userInfo?.roleAccess === GENERAL && (
//                                     <span>&nbsp;For Approval</span>
//                                   )}
//                                 </Button>
//                               </DialogTrigger>
//                               <DialogContent className="sm:max-w-[425px]">
//                                 <DialogHeader>
//                                   <DialogTitle>
//                                     <p className="leading-6">
//                                       Are you sure you want to submit this
//                                       expensesheet?
//                                     </p>
//                                   </DialogTitle>
//                                 </DialogHeader>
//                                 <DialogFooter className="pt-10">
//                                   <DialogClose asChild>
//                                     <Button
//                                       type="button"
//                                       className="text-white bg-[green] hover:bg-[green]"
//                                       onClick={handleSubmitExpenseSheet}
//                                     >
//                                       Yes
//                                     </Button>
//                                   </DialogClose>
//                                   <DialogClose asChild>
//                                     <Button
//                                       type="button"
//                                       className="text-[black] bg-[#E2E8F0] hover:bg-[#E2E8F0]"
//                                     >
//                                       No
//                                     </Button>
//                                   </DialogClose>
//                                 </DialogFooter>
//                               </DialogContent>
//                             </Dialog>
//                           </div>
//                         )}
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//                 <TableRow className="cursor-pointer">
//                   <TableCell></TableCell>
//                   <TableCell className="text-[#011c3b] text-center text-lg font-bold">
//                     Total
//                   </TableCell>
//                   <TableCell>
//                     {`£${expenseSheetData?.expenseSheet.reduce(
//                       (acc, expenseData) => acc + +(expenseData?.expense ?? 0),
//                       0
//                     )}`}
//                   </TableCell>
//                 </TableRow>
//               </TableBody>
//             </Table>
//           ) : (
//             <p>No ExpenseSheet available.</p>
//           )}
//         </>
//       )}
//     </div>
//     // </TableWrapper>
//   );
// };

// export default ExpenseSheet;
