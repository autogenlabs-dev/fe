import React, { useEffect, useState } from "react";
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
import { useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/loader";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { eachDayOfInterval, endOfWeek, startOfWeek, format } from "date-fns-v3";
import "react-day-picker/dist/style.css";
import { convertToUTC } from "@/lib/utils";
import axiosIns from "@/api/axios";
import WeekCalendar from "../WeekCalendar/WeekCalendar";
import { utcToZonedTime } from "date-fns-tz";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const AddOvertime = () => {
  const [selectedWeek, setSelectedWeek] = useState({
    from: startOfWeek(new Date(), { weekStartsOn: 1 }),
    to: endOfWeek(new Date(), { weekStartsOn: 1 }),
  });
  const [timeSheetList, setTimeSheetList] = useState([]);
  const { userInfo } = useSelector(authSelector);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCell, setEditingCell] = useState(null);
  const [updatedTimesheet, setUpdatedTimesheet] = useState([]);
  const [editedRows, setEditedRows] = useState([]);

  const fetchTimesheets = async () => {
    setIsLoading(true);

    if (userInfo && userInfo.access && userInfo.access.token) {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.access.token}`,
      };

      try {
        const { data } = await axiosIns.get(
          `/timesheet/list?startOfWeek=${selectedWeek.from}&endOfWeek=${selectedWeek.to}`,
          {
            headers,
          }
        );
        setTimeSheetList(data);
        setEditedRows([]);
        setUpdatedTimesheet([]);
      } catch (error) {
        console.error("Error fetching timesheets:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchTimesheets();
  }, [userInfo, selectedWeek]);

  const handleCellClick = (e, date, projectId) => {
    e.preventDefault();
    e.stopPropagation();
    // console.log("date", date);
    // console.log("projectId", projectId);
    // If the cell is already being edited, do nothing
    if (editingCell?.date === date && editingCell?.projectId === projectId) {
      return;
    }
    // Otherwise, set the editing cell to the clicked cell
    setEditingCell({ date, projectId });
  };

    const handleCellChange = (event, date, projectId, id, time) => {
      // Get the new value from the event
      const newValue = event.target.value;
      // console.log("overtime", overtime);
      // console.log("projectId", projectId);
      // Update the timeSheetList with the new value
      setTimeSheetList((prevTimesheet) => {
        const newTimesheet = prevTimesheet.timesheet.map((timeSheet) => {
          // Check if the timesheets array contains a matching element
          const hasMatch = timeSheet.timesheets.some(
            (timeSheet) =>
              format(utcToZonedTime(timeSheet.date, "Etc/UTC"), "dd/MM/yy") ===
                format(date, "dd/MM/yy") && +timeSheet.projectId === +projectId
          );
          // console.log("hasMatch", hasMatch);
          if (hasMatch) {
            // If yes, update the time property of the matching element
            return {
              ...timeSheet,
              overtime: timeSheet.timesheets.reduce((acc, timeSheet) => {
                if (
                  format(
                    utcToZonedTime(timeSheet.date, "Etc/UTC"),
                    "dd/MM/yy"
                  ) === format(date, "dd/MM/yy") &&
                  timeSheet.projectId === projectId
                ) {
                  return +acc + +newValue;
                } else {
                  return +acc + +timeSheet.overtime;
                }
              }, 0),
              timesheets: timeSheet.timesheets.map((timeSheet) => {
                if (
                  format(
                    utcToZonedTime(timeSheet.date, "Etc/UTC"),
                    "dd/MM/yy"
                  ) === format(date, "dd/MM/yy") &&
                  timeSheet.projectId === projectId
                ) {
                  return { ...timeSheet, overtime: newValue };
                } else {
                  return timeSheet;
                }
              }),
            };
          } else if (timeSheet.projectId === projectId) {
            return {
              ...timeSheet,
              overtime: +timeSheet.overtime + +newValue,
              timesheets: [
                ...timeSheet.timesheets,
                {
                  projectId,
                  date,
                  overtime: newValue,
                },
              ],
            };
          } else {
            return timeSheet;
          }
        });
        const newSheet = { timesheet: newTimesheet };
        return newSheet;
      });

    setUpdatedTimesheet((prevTimesheet) => {
      const timeSheet = prevTimesheet.find(
        (timeSheet) =>
          format(utcToZonedTime(timeSheet.date, "Etc/UTC"), "dd/MM/yy") ===
            format(date, "dd/MM/yy") && timeSheet.projectId === projectId
      );
      if (timeSheet) {
        timeSheet.overtime = newValue;
      } else {
        prevTimesheet.push({
          projectId,
          date,
          overtime: newValue,
          time,
          id,
        });
      }
      const newTimesheet = [...prevTimesheet];
      return newTimesheet;
    });

    setEditedRows((prev) => {
      if (!prev.some((row) => row.projectId === projectId)) {
        return [...prev, { projectId }];
      } else {
        return prev;
      }
    });
  };

  const handleSaveTimesheet = async (projectId) => {
    setIsLoading(true);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.access.token}`,
    };

    const filteredTimeSheet = updatedTimesheet.filter(
      (timeSheet) => timeSheet.projectId === projectId
    );
    const body = {
      timesheet: filteredTimeSheet,
    };
    await axiosIns.patch(`/timesheet/update`, body, { headers });
    // await axiosIns.patch(`/timesheet/update/overtime`, body, { headers });
    setEditedRows([]);
    setUpdatedTimesheet([]);
    setEditingCell(null);
    setIsLoading(false);
    await fetchTimesheets();
  };


  const { from, to } = selectedWeek || {};

  let weekDatesList = eachDayOfInterval({
    start: from,
    end: to,
  });

  const weekDates = weekDatesList.map(convertToUTC);

  console.log("updatedTimesheet", updatedTimesheet);
  console.log("timeSheetList", timeSheetList);

  // eslint-disable-next-line react/prop-types
  const EditableCell = ({ value, onChange, isEditing }) =>
    isEditing ? (
      <input
        type="number"
        autoFocus
        value={value}
        onChange={onChange}
        className="w-[105px] pl-[3px]"
      />
    ) : (
      <span
      className="w-[105px] pl-[3px]"
      >{value}</span>
    );

  const handleDocumentClick = (event) => {
    // console.log("event.target.tagName", event.target.tagName);
    // If the event target is not an input element, clear the editing cell
    if (event.target.tagName !== "INPUT") {
      setEditingCell(null);
    }
  };

  // Add an event listener to the document to handle clicks outside the table
  React.useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  // console.log("updatedTimesheet", updatedTimesheet);

  // const handleDelete = async (timesheet) => {
  //   const body = {
  //     timesheet,
  //   };
  //   setIsLoading(true);

  //   await dispatch(
  //     deleteTimeSheet({ token: userInfo.access.token, body })
  //   ).unwrap();
  //   await fetchTimesheets();
  // };

  // console.log("finalTimeSheetList", finalTimeSheetList);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <WeekCalendar
              selectedWeek={selectedWeek}
              setSelectedWeek={(value) => {
                setSelectedWeek(value);
                setUpdatedTimesheet([]);
              }}
            />
          </div>
          {timeSheetList?.timesheet && timeSheetList?.timesheet.length > 0 ? (
            <Table className="mt-8" mainClassName="w-full max-h-[680px]">
              <TableHeader className="sticky top-0 bg-gray-200 ">
                <TableRow>
                  <TableHead className="bg-gray-100">Project Name</TableHead>
                  <TableHead className="bg-gray-100">
                    Total Hours Requested
                  </TableHead>

                  <TableHead className="bg-gray-100">Status</TableHead>
                  {weekDates.map((date, index) => (
                    // map through the array of week dates and render a table head for each date
                    <TableHead key={index} className="bg-gray-100 pr-12">
                      {format(date, "dd/MM/yy")}
                    </TableHead>
                  ))}
                  <TableHead className="bg-gray-100">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <>
                  {timeSheetList?.timesheet.map((timesheet, index) => (
                    <TableRow key={index} className="cursor-pointer">
                      <TableCell>{timesheet.projectName}</TableCell>
                      <TableCell className="text-[#9333EA]">
                        <Badge
                          className={
                            "bg-opacity-100 bg-[#F3F1FEFF] text-[#927AF4FF] w-full sm:px-8 md:px-6 lg:px-4 xl:px-1 p-1 flex justify-center items-center rounded-2xl hover:bg-[#9333EA] hover:text-white"
                          }
                        >
                          {" "}
                          {`${timesheet.time} Hours`}
                          <span className="pl-1 "></span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#9333EA]">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={`rounded-2xl p-1 h-auto px-4 border-0 hover:text-white ${
                                !timesheet?.approvalStatus ||
                                timesheet.approvalStatus === "notsubmitted"
                                  ? "text-[#6DA5B8] bg-[#F2FAFD] hover:bg-[#6DA5B8]"
                                  : timesheet.approvalStatus === "submitted"
                                  ? "text-[#6DA5B8] bg-[#F2FAFD] hover:bg-[#6DA5B8]"
                                  : timesheet.approvalStatus === "approved"
                                  ? "text-green-700 bg-green-200 hover:bg-green-700"
                                  : "text-red-700 bg-red-200 hover:bg-red-700"
                              }`}
                            >
                              {!timesheet?.approvalStatus ||
                              timesheet.approvalStatus === "notsubmitted"
                                ? "Not submitted"
                                : timesheet.approvalStatus === "submitted"
                                ? "Pending"
                                : timesheet.approvalStatus === "approved"
                                ? "Approved"
                                : "Rejected"}
                            </Button>
                          </PopoverTrigger>
                          {!timesheet?.approvalStatus ||
                          timesheet.approvalStatus === "notsubmitted" ||
                          timesheet.approvalStatus === "submitted" ? (
                            <></>
                          ) : (
                            <PopoverContent className="w-40">
                              <div className="grid gap-4 place-items-center">
                                <div className="space-y-2 text-center">
                                  <h4 className="font-medium leading-none ">
                                    Comments
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {timesheet?.comments
                                      ? timesheet.comments
                                      : " No comments"}
                                  </p>
                                </div>
                              </div>
                            </PopoverContent>
                          )}
                        </Popover>
                      </TableCell>
                      {weekDates.map((date, index) => (
                        // map through the array of week dates and render a table cell for each date
                        <TableCell
                          key={index}
                          className=""
                          onClick={(e) =>
                            handleCellClick(e, date, timesheet.projectId)
                          }
                        >
                          <div>
                            {timesheet.approvalStatus.toLowerCase() ===
                              "submitted" ||
                            timesheet.approvalStatus.toLowerCase() ===
                              "approved" ? (
                              <span className="w-[105px] pl-[3px]">
                                {timesheet.timesheets.find(
                                  (day) =>
                                    format(
                                      utcToZonedTime(day.date, "Etc/UTC"),
                                      "dd/MM/yy"
                                    ) === format(date, "dd/MM/yy")
                                )?.overtime ?? 0}
                              </span>
                            ) : (
                              <EditableCell
                                value={
                                  timesheet.timesheets.find(
                                    (day) =>
                                      format(
                                        utcToZonedTime(day.date, "Etc/UTC"),
                                        "dd/MM/yy"
                                      ) === format(date, "dd/MM/yy")
                                  )?.overtime ?? 0
                                }
                                onChange={(event) => {
                                  // console.log("timesheet", timesheet);
                                  handleCellChange(
                                    event,
                                    date,
                                    timesheet.projectId,
                                    timesheet.timesheets.find(
                                      (day) =>
                                        format(
                                          utcToZonedTime(day.date, "Etc/UTC"),
                                          "dd/MM/yy"
                                        ) === format(date, "dd/MM/yy")
                                    )?.id ?? 0,
                                    timesheet.timesheets.find(
                                      (day) =>
                                        format(
                                          utcToZonedTime(day.date, "Etc/UTC"),
                                          "dd/MM/yy"
                                        ) === format(date, "dd/MM/yy")
                                    )?.time ?? 0
                                  );
                                }}
                                isEditing={
                                  editingCell?.date &&
                                  format(editingCell?.date, "dd/MM/yy") ===
                                    format(date, "dd/MM/yy") &&
                                  editingCell?.projectId === timesheet.projectId
                                }
                                date={date}
                                projectId={timesheet.projectId}
                              />
                            )}
                          </div>
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex gap-2 justify-center">
                          {editedRows.some(
                            (row) => row.projectId === timesheet.projectId
                          ) && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button className="flex">Save</Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>
                                    <p className="leading-6">
                                      Are you sure you want to save this
                                      timesheet?
                                    </p>
                                  </DialogTitle>
                                </DialogHeader>
                                <DialogFooter className="pt-10">
                                  <DialogClose asChild>
                                    <Button
                                      type="button"
                                      className="text-white bg-[green] hover:bg-[green]"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSaveTimesheet(
                                          timesheet.projectId
                                        );
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
                            </Dialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="cursor-pointer">
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-[#9333EA] text-center text-lg font-bold">
                      Total
                    </TableCell>
                    {weekDates.map((date, index) => (
                      // map through the array of week dates and render a table cell for each date
                      <TableCell key={index} className="">
                        <div>
                          <div>
                            {timeSheetList?.timesheet.reduce(
                              (acc, timesheet) =>
                                acc +
                                +(
                                  timesheet.timesheets.find(
                                    (day) =>
                                      format(
                                        utcToZonedTime(day.date, "Etc/UTC"),
                                        "dd/MM/yy"
                                      ) === format(date, "dd/MM/yy")
                                  )?.overtime ?? 0
                                ),
                              0
                            )}
                          </div>
                        </div>
                      </TableCell>
                    ))}
                    <TableCell className="">
                      {weekDates.reduce((total, date) => {
                        // calculate the sum for each date
                        let dateSum = timeSheetList?.timesheet.reduce(
                          (acc, timesheet) =>
                            acc +
                            +(
                              timesheet.timesheets.find(
                                (day) =>
                                  format(
                                    utcToZonedTime(day.date, "Etc/UTC"),
                                    "dd/MM/yy"
                                  ) === format(date, "dd/MM/yy")
                              )?.overtime ?? 0
                            ),
                          0
                        );
                        return total + dateSum;
                      }, 0)}
                    </TableCell>
                  </TableRow>
                </>
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-2xl pt-14">
              No timesheets available.
            </p>
          )}
        </>
      )}
    </>
  );
};

export default AddOvertime;
