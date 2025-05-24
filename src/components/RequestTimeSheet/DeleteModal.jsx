import React from "react";

const DeleteModal = ({ title, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-1/3">
        <h2 className="text-lg mb-4">{title}</h2>
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="mr-4 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
