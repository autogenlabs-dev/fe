import React from "react";
import { useForm } from "react-hook-form";

const NewExpenseEntry = ({ open, close, children }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // handle form submission
  };


  return (
    <>
        {children}
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-gray-200/80 flex items-center justify-center z-[9999] ${!open ? "hidden": ""}`}
        onClick={() => close(false)} // Close modal on overlay click
      ></div>

      {/* Modal Content */}
      <div className={`fixed inset-0 flex items-center justify-center z-[99999] ${!open ? "hidden": ""}`}>
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
          {/* Modal Header */}
          <div className="mb-4 flex justify-between items-center border-b pb-2">
            <h2 className="text-xl font-bold">New Expense Entry</h2>
            <button onClick={() => close(false)} className="text-gray-500 hover:text-black">
              ✕
            </button>
          </div>

          {/* Modal Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-wrap gap-4">
              {/* For User */}
              <div className="w-full md:flex-[0_0_30%]">
                <label htmlFor="user" className="block mb-1 font-semibold">For User:</label>
                <select id="user" className="w-full border p-2 rounded" {...register("user")}>
                  <option>Shuja, Alqama</option>
                </select>
              </div>

              {/* Client */}
              <div className="w-full md:flex-[0_0_30%]">
                <label htmlFor="client" className="block mb-1 font-semibold">Client:</label>
                <input type="text" id="client" className="w-full border p-2 rounded" {...register("client")} />
              </div>

              {/* Matter */}
              <div className="w-full md:flex-[0_0_30%]">
                <label htmlFor="matter" className="block mb-1 font-semibold">Matter:</label>
                <input type="text" id="matter" className="w-full border p-2 rounded" {...register("matter")} />
              </div>

              {/* Expense Type */}
              <div className="w-full md:flex-[0_0_30%]">
                <label htmlFor="expenseType" className="block mb-1 font-semibold">Expense Type:</label>
                <select id="expenseType" className="w-full border p-2 rounded" {...register("expenseType")}>
                  <option>Select Expense Type</option>
                  {/* Add more options as needed */}
                </select>
              </div>

              {/* Expense Date */}
              <div className="w-full md:flex-[0_0_30%]">
                <label htmlFor="expenseDate" className="block mb-1 font-semibold">Expense Date:</label>
                <input type="date" id="expenseDate" className="w-full border p-2 rounded" {...register("expenseDate")} />
              </div>

              {/* Date Created */}
              <div className="w-full md:flex-[0_0_30%]">
                <label htmlFor="dateCreated" className="block mb-1 font-semibold">Date Created:</label>
                <input type="date" id="dateCreated" className="w-full border p-2 rounded" {...register("dateCreated")} />
              </div>

              {/* Exclude from Invoice */}
              <div className="flex items-center gap-2 w-full md:flex-[0_0_30%]">
                <input type="checkbox" id="excludeInvoice" {...register("excludeInvoice")} />
                <label htmlFor="excludeInvoice" className="font-semibold">Exclude from Invoice:</label>
              </div>

              {/* Reimburse */}
              <div className="flex items-center gap-2 w-full md:flex-[0_0_30%]">
                <input type="checkbox" id="reimburse" {...register("reimburse")} />
                <label htmlFor="reimburse" className="font-semibold">Reimburse:</label>
              </div>

              {/* Description */}
              <div className="w-full md:flex-[0_0_60%]">
                <label htmlFor="description" className="block mb-1 font-semibold">Description:</label>
                <textarea id="description" className="w-full border p-2 rounded" {...register("description")}></textarea>
              </div>

              {/* Cost */}
              <div className="w-full md:flex-[0_0_30%]">
                <label htmlFor="cost" className="block mb-1 font-semibold">Cost $:</label>
                <input type="number" step="0.01" id="cost" className="w-full border p-2 rounded" {...register("cost")} />
              </div>

              {/* Percent Markup */}
              <div className="w-full md:flex-[0_0_30%]">
                <label htmlFor="markup" className="block mb-1 font-semibold">Percent Markup:</label>
                <input type="number" step="0.01" id="markup" className="w-full border p-2 rounded" {...register("markup")} />
              </div>

              {/* Sell Price */}
              <div className="w-full md:flex-[0_0_30%]">
                <label htmlFor="sellPrice" className="block mb-1 font-semibold">Sell Price:</label>
                <input type="number" step="0.01" id="sellPrice" className="w-full border p-2 rounded" {...register("sellPrice")} />
              </div>

              {/* Receipt Attachment */}
              <div className="w-full">
                <label htmlFor="attachment" className="block mb-1 font-semibold">Receipt Attachment:</label>
                <input type="file" id="attachment" className="w-full border p-2 rounded" {...register("attachment")} />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-2 mt-4 flex-wrap justify-center">
              <button onClick={() => close(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button type="submit" className="bg-[#002147] text-white px-4 py-2 rounded">Save</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewExpenseEntry;
