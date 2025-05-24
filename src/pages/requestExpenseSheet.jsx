import { useEffect } from "react";
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
import RequestPopUp from "../components/RequestPopup/requestPopUp";
import WrapperComponent from "@/components/Wrapper/TableWrapper";
import { Badge } from "@/components/ui/badge";
import { useSelector, useDispatch } from "react-redux";
import { authSelector } from "@/redux/auth/authSlice";
import {
  addApprovalStatus,
  getRequestExpenseSheet,
  deleteExpensesheet,
} from "@/redux/expensesheet/expenseSheetThunk";
import { requestSheetSelector, setExpenseSheetDataReducer } from "@/redux/expensesheet/expenseSheetSlice";
import Loader from "../components/loader";
import {
  format,
} from "date-fns-v3";
import { ADMIN, OPERATIONAL_DIRECTOR } from "@/constants";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import CustomDeleteModal from "@/components/RequestExpenseSheet/CustomDeleteModal";

const RequestExpenseSheet = () => {
  const { userInfo } = useSelector(authSelector);
  const dispatch = useDispatch();
  let requestSheetData = useSelector(requestSheetSelector);
  const isLoading = useSelector((state) => state.expenseSheetData.loading);

  console.log(requestSheetData, "===ascmacmsancjasncj");

  const requestSheetDummyData = {
    // expenseSheets: [
    //   {
    //     id: 1,
    //     userName: 'John Doe',
    //     projectName: 'Project Alpha',
    //     expense: 1500,
    //     category: 'Travel',
    //     month: '2023-08-01',
    //     imageUrls: [
    //       'https://via.placeholder.com/150',
    //       'https://via.placeholder.com/150',
    //     ],
    //     status: 'Pending',
    //     userId: 101,
    //     projectId: 201,
    //   },
    //   {
    //     id: 2,
    //     userName: 'Jane Smith',
    //     projectName: 'Project Beta',
    //     expense: 2200,
    //     category: 'Accommodation',
    //     month: '2023-07-01',
    //     imageUrls: [
    //       'https://via.placeholder.com/150',
    //       'https://via.placeholder.com/150',
    //       'https://via.placeholder.com/150',
    //     ],
    //     status: 'Approved',
    //     userId: 102,
    //     projectId: 202,
    //   },
    //   {
    //     id: 3,
    //     userName: 'Alex Johnson',
    //     projectName: 'Project Gamma',
    //     expense: 1800,
    //     category: 'Meals',
    //     month: '2023-06-01',
    //     imageUrls: ['https://via.placeholder.com/150'],
    //     status: 'Rejected',
    //     userId: 103,
    //     projectId: 203,
    //   },
    // ],
  };

  // if(requestSheetData?.expenseSheets?.length === 0){
  //   requestSheetData = requestSheetDummyData;
  // }

  useEffect(() => {
    if (userInfo && userInfo.access && userInfo.access.token) {
      dispatch(getRequestExpenseSheet({ token: userInfo.access.token }));
    }
  }, [dispatch, userInfo]);

  const handleStatus = (status, expenseSheetId, userId, comments, projectName) => {
    const body = {
      expenseSheetId,
      userId,
      approvalStatus: status,
      comments,
      link: "/expensesheet",
      projectName,
    };
    // console.log("body", body);
    dispatch(addApprovalStatus({ token: userInfo?.access?.token, body })).unwrap()
    .then(res => {
      dispatch(getRequestExpenseSheet({ token: userInfo?.access?.token }));
      // const filtData = requestSheetData?.expenseSheets?.filter(sheet => sheet.id !== expenseSheetId);
      // console.log(filtData, "====filtDatafiltDatafiltData");
      // dispatch(setExpenseSheetDataReducer({ expenseSheets: filtData }));
    })
  };

  const handleDelete = async (expenseSheet) => {
    const body = {
      expenseSheet,
    };
    dispatch(deleteExpensesheet({ token: userInfo?.access?.token, body }));
  };


  // console.log("requestSheetData", requestSheetData);

  return (
    <div className="w-full px-5 ml-auto mr-auto pt-4">
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Loader />
        </div>
      ) : requestSheetData &&
        requestSheetData?.expenseSheets &&
        requestSheetData?.expenseSheets?.length > 0 ? (
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead className="bg-gray-100">User</TableHead>
              <TableHead className="bg-gray-100">Project Name</TableHead>
              <TableHead className="bg-gray-100">Expense Requested</TableHead>
              <TableHead className="bg-gray-100">Category</TableHead>
              <TableHead className="bg-gray-100">Month</TableHead>
              <TableHead className="bg-gray-100">Receipts</TableHead>
              <TableHead className="bg-gray-100">Current Status</TableHead>
              <TableHead className="bg-gray-100">Change Status</TableHead>
              {(userInfo?.roleAccess === ADMIN || userInfo?.roleAccess === OPERATIONAL_DIRECTOR) && (
                <TableHead className="bg-gray-100">Action</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {requestSheetData?.expenseSheets?.map((expenseSheet) => (
              <TableRow key={expenseSheet.id}>
                <TableCell>{expenseSheet.userName}</TableCell>
                <TableCell>{expenseSheet.projectName}</TableCell>
                <TableCell className="text-[#011c3b]">
                  <Badge
                    className={
                      " bg-opacity-100  bg-blue-100 text-[#011c3b] w-3/4  p-1 flex justify-center items-center rounded-2xl hover:bg-[#002147] hover:text-white text-base"
                    }
                  >
                    {" "}
                    {`£${expenseSheet.expense}`}
                  </Badge>
                </TableCell>
                <TableCell>{expenseSheet.category}</TableCell>
                <TableCell>
                  {format(new Date(expenseSheet.month), "LLLL y")}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col justify-center items-center gap-2">
                    <div className="flex flex-wrap justify-center gap-3">
                      {expenseSheet?.imageUrls?.map((url, index) => (
                        <div
                          key={index}
                          className="w-16 h-16 rounded-lg shadow-md bg-slate-500 relative"
                        >
                          <img
                            className="w-full h-full object-cover"
                            src={url}
                            alt={`Expense ${expenseSheet?.projectId}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{expenseSheet?.approvalStatus || "Pending"}</TableCell>
                <TableCell>
                  {" "}
                  <RequestPopUp
                    timesheetId={expenseSheet?.id}
                    userId={expenseSheet?.userId}
                    handleStatus={handleStatus}
                    projectName={expenseSheet?.projectName}
                  />
                </TableCell>
                {(userInfo?.roleAccess === ADMIN || userInfo?.roleAccess === OPERATIONAL_DIRECTOR) && (
                  <TableCell>
                    <CustomDeleteModal
                      expenseSheet={expenseSheet}
                      handleDelete={handleDelete}
                    />
                    {/* <Dialog>
                      <DialogTrigger asChild>
                        <div
                          className="p-2 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="text-primary " size={22} />
                        </div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>
                            Are you sure you want to delete this expensesheet?
                          </DialogTitle>
                        </DialogHeader>
                        <DialogFooter className="pt-10">
                          <DialogClose asChild>
                            <Button
                              type="button"
                              className="text-white bg-[red] hover:bg-[red]"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(expenseSheet);
                              }}
                            >
                              Yes
                            </Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button
                              type="button"
                              className="text-[black] bg-[#E2E8F0] hover:bg-[#E2E8F0]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              No
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog> */}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter></TableFooter>
        </Table>
      ) : (
        <div className="h-[85vh] w-full flex justify-center items-center">
          <h2 className="">No expense sheet requested.</h2>
        </div>
      )}
    </div>
  );
};

export default RequestExpenseSheet;
