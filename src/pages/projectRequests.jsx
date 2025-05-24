import { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import WrapperComponent from "@/components/Wrapper/TableWrapper";
import { useSelector } from "react-redux";
import { authSelector } from "@/redux/auth/authSlice";
import Loader from "../components/loader";
import axiosIns from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const requestsDummyData = [
  {
    id: 1,
    projectName: "Project Alpha",
    userName: "John Doe",
    requestedStatus: "Pending",
  },
  {
    id: 2,
    projectName: "Project Beta",
    userName: "Jane Smith",
    requestedStatus: "Approved",
  },
  {
    id: 3,
    projectName: "Project Gamma",
    userName: "Alex Johnson",
    requestedStatus: "Rejected",
  },
];

const ProjectRequests = () => {
  let [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const { userInfo } = useSelector(authSelector);

  const fetchRequestSheet = useCallback(async () => {
    if (userInfo && userInfo.access && userInfo.access.token) {
      try {
        setLoading(true);
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.access.token}`,
        };
        const { data } = await axiosIns.get(`project/requests`, {
          headers,
        });
        console.log(data.requests, "===data.requests");
        
        setRequests(data.requests);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching requests:", error);
        setLoading(false);
      }
    }
  }, [userInfo]);

  useEffect(() => {
    fetchRequestSheet();
  }, [fetchRequestSheet]);

  const handleStatus = async (status, request) => {
    const body = {
      request,
      status,
      link: "/requests",
    };
    console.log("body", body);
    setLoading(true);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.access.token}`,
    };

    await axiosIns.patch(`project/requests/status`, body, {
      headers,
    });
    fetchRequestSheet();
    setLoading(false);
  };
  console.log("requests", requests);

  // if(requests.length === 0){
  //   requests = requestsDummyData;
  // }

  return (
    <div className="w-full px-5 pt-6 ml-auto mr-auto">
      {loading ? (
        <div className="flex justify-center items-center">
          <Loader />
        </div>
      ) : requests?.length > 0 ? (
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead className="bg-gray-100">Project Name</TableHead>
              <TableHead className="bg-gray-100">Requested By</TableHead>
              <TableHead className="bg-gray-100">Previous Status</TableHead>
              <TableHead className="bg-gray-100">Requested Status</TableHead>
              <TableHead className="bg-gray-100 flex justify-center items-center">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.projectName}</TableCell>
                <TableCell>{request.userName}</TableCell>
                <TableCell>{request.previousStatus}</TableCell>
                <TableCell>{request.requestedStatus}</TableCell>
                <TableCell className="flex gap-4 items-center justify-center">
                  <Button
                    type="submit"
                    className="w-15 bg-main hover:bg-main/90 gap-2"
                    onClick={() => handleStatus(true, request)}
                  >
                    <Check size={"20"} />
                    Approve
                  </Button>
                  <Button
                    type="button"
                    className="w-15 bg-red-500 hover:bg-red-600 gap-2"
                    onClick={() => handleStatus(false, request)}
                  >
                    <X size={"20"} />
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter></TableFooter>
        </Table>
      ) : (
        <h2 className="flex justify-center">No pending requests.</h2>
      )}
    </div>
  );
};

export default ProjectRequests;
