import { useState } from 'react';
import { Trash2 } from 'lucide-react';

const CustomDeleteModal = ({ handleDelete, expenseSheet }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const closeModal = (e) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <div
        className="p-2 cursor-pointer"
        onClick={openModal}
      >
        <Trash2 className="text-primary" size={22} />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="bg-white sm:max-w-[425px] w-full p-6 rounded-lg shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">
              Are you sure you want to delete this expensesheet?
            </h2>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-10">
              <button
                className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(expenseSheet);
                  closeModal(e);
                }}
              >
                Yes
              </button>
              <button
                className="text-black bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                onClick={closeModal}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomDeleteModal;