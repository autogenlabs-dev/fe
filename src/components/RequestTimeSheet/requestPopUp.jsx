import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";
import { X } from "lucide-react";
import { useState } from "react";
import { useDispatch ,useSelector} from "react-redux";
import { addApprovalStatus } from "../../redux/timesheet/timeSheetThunk"; 
import { authSelector } from "@/redux/auth/authSlice";


const requestPopUp = ({ timesheetId, userId }) => {

  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const { userInfo } = useSelector(authSelector);

  const handleStatus = (status) => {
    const body = {
      timesheetId: timesheetId,
      userId: userId,
      approvalStatus: status,
      comments: comment,
      link: "/timesheetlist",
    };
    console.log("body", body);
    dispatch(addApprovalStatus({ token: userInfo.access.token, body }));
  };

  // const handleReject = () => {
  //   dispatch(addApprovalStatus({ token:userInfo.access.token, timesheetId, status: 'rejected', comment }));
  // };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Approve/Reject</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex-col flex items-center gap-4">
              <Label htmlFor="name" className="text-right text-2xl">
                Add Comment
              </Label>
              <Textarea
                placeholder="Add Your Comment Here."
                className="col-span-3 h-40 "
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button
                type="submit"
                className="w-15 bg-green-400 hover:bg-green-600 gap-2"
                onClick={() => handleStatus("approved")}
              >
                <Check size={"20"} />
                Approve
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                type="button"
                className="w-15 bg-red-500 hover:bg-red-600 gap-2"
                onClick={() => handleStatus("rejected")}
              >
                <X size={"20"} />
                Reject
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default requestPopUp;
