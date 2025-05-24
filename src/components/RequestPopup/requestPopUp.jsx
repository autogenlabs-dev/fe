import { useState } from 'react';
import { Check, X } from 'lucide-react';

const RequestPopUp = ({ timesheetId, userId, handleStatus, projectName, projectId, approvalStatus, }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      {/* Trigger Button */}
      {["approved", "rejected"].includes(approvalStatus) ? 
        <div className={`flex justify-center gap-3 rounded-md text-white text-center py-2 ${approvalStatus == "rejected" ? "bg-red-600":  "bg-green-600"}`}>{approvalStatus}</div>:
        <button
          onClick={openModal}
          className={"bg-main text-white px-4 py-2 rounded hover:bg-main/90"}
        >
          Approve/Reject
        </button>
      }

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">
              Approval/Reject Request
            </h2>

            {/* Comment Textarea */}
            <div className="mb-4">
              <label htmlFor="comment" className="block text-lg mb-2">
                Add Comment
              </label>
              <textarea
                id="comment"
                placeholder="Add your comment here..."
                className="w-full h-32 p-2 border border-gray-300 rounded"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                className="flex items-center gap-2 bg-main text-white px-4 py-2 rounded hover:bg-main/90"
                onClick={() => {
                  handleStatus("approved", timesheetId, userId, comment, projectName, projectId);
                  closeModal();
                }}
              >
                <Check size={20} />
                Approve
              </button>
              <button
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => {
                  handleStatus("rejected", timesheetId, userId, comment, projectName);
                  closeModal();
                }}
              >
                <X size={20} />
                Reject
              </button>
            </div>

            {/* Close Button (Optional) */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RequestPopUp;


























// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogHeader,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Check } from "lucide-react";
// import { X } from "lucide-react";
// import { useState } from "react";

// // eslint-disable-next-line react/prop-types
// const RequestPopUp = ({ timesheetId, userId, handleStatus, projectName }) => {
//   const [comment, setComment] = useState("");

//   return (
//     <>
//       <Dialog>
//         <DialogTrigger asChild>
//           <Button>Approve/Reject</Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader></DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="flex-col flex items-center gap-4">
//               <Label htmlFor="name" className="text-right text-2xl">
//                 Add Comment
//               </Label>
//               <Textarea
//                 placeholder="Add Your Comment Here."
//                 className="col-span-3 h-40 "
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//               />
//             </div>
//           </div>
//           <div className="flex justify-end gap-3">
//             <DialogClose asChild>
//               <Button
//                 type="submit"
//                 className="w-15 bg-green-400 hover:bg-green-600 gap-2"
//                 onClick={() =>
//                   handleStatus("approved", timesheetId, userId, comment, projectName)
//                 }
//               >
//                 <Check size={"20"} />
//                 Approve
//               </Button>
//             </DialogClose>
//             <DialogClose asChild>
//               <Button
//                 type="button"
//                 className="w-15 bg-red-500 hover:bg-red-600 gap-2"
//                 onClick={() =>
//                   handleStatus("rejected", timesheetId, userId, comment, projectName)
//                 }
//               >
//                 <X size={"20"} />
//                 Reject
//               </Button>
//             </DialogClose>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default RequestPopUp;
