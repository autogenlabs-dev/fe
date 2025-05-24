import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteClientThunk } from "@/redux/client/clientThunk";
import { authSelector } from "@/redux/auth/authSlice";
import toastMessage from "@/lib/toastMessage";

const DeleteClientModal = ({ client, handleFilter=()=>{} }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userInfo } = useSelector(authSelector);
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteClientThunk({ id: client.id, token: userInfo?.access?.token, }))
      .unwrap()
      .then((res) => {
        console.log("Client deleted:", res);
        handleFilter(client.id)
        toastMessage("Client Successfully Deleted", "success");
    })
    .catch((err) => {
        console.log("Error deleting client:", err);
        toastMessage(err.response?.data?.message || err?.message || "Something went wrong", "error");
    });
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Button to open the modal */}
      <button onClick={() => setIsModalOpen(true)} title="Delete Client">
        <Trash2 className="text-red-500" />
      </button>

      {/* Modal structure */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold">Confirm Delete</h2>
            <p>Are you sure you want to delete client {client.clientName}?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteClientModal;