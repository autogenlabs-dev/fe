import { authSelector } from '@/redux/auth/authSlice';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const ExpenseEntry = () => {
  const [date, setDate] = useState('09/06/2024');
  const [user, setUser] = useState('Alqama Shuja');
  const [client, setClient] = useState('');
  const [search, setSearch] = useState('');
  const [expenseType, setExpenseType] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState(0);
  const { userInfo } = useSelector(authSelector);

  const handleClear = () => {
    setClient('');
    setSearch('');
    setExpenseType('');
    setDescription('');
    setCost(0);
  };

  const handleSubmit = () => {
    const data = {
        date, user, client, search, expenseType, description, cost
    }
    console.log(data, "===Expense Entry");
  }

  return (
    <div className="border border-[#7393B3] rounded-lg p-4 w-[48%] bg-white shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Expense Entry</h2>
      </div>

      {/* Date and User */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={date}
          className="w-1/2 border border-gray-300 rounded p-2"
          readOnly
        />
        <select
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="w-1/2 border border-gray-300 rounded p-2 ml-2"
          >
            <option>{userInfo?.name}</option>
        </select>
      </div>

      {/* Client Select */}
      <div className="mb-4">
        <select
          value={client}
          onChange={(e) => setClient(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        >
          <option value="">Client</option>
          <option value="client1">Client 1</option>
          <option value="client2">Client 2</option>
        </select>
      </div>

      {/* Search Select */}
      <div className="mb-4">
        <select
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        >
          <option value="">Search</option>
          <option value="search1">Search 1</option>
          <option value="search2">Search 2</option>
        </select>
      </div>

      {/* Expense Type */}
      <div className="mb-4">
        <select
          value={expenseType}
          onChange={(e) => setExpenseType(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        >
          <option value="">Expense Type</option>
          <option value="type1">Type 1</option>
          <option value="type2">Type 2</option>
        </select>
      </div>

      {/* Description */}
      <div className="mb-4">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>

      {/* Cost */}
      <div className="flex items-center gap-3 mb-4">
        {/* <label className="text-gray-700">Cost:</label> */}
        <input
          type="number"
          min={0}
          placeholder='Cost'
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-between">
        <button onClick={handleSubmit} className="flex items-center bg-[#002147] hover:bg-[#011c3b] text-white font-semibold py-2 px-4 rounded">
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H3"
            />
          </svg>
          Save
        </button>
        <button
          onClick={handleClear}
          className="flex items-center text-[#002147] font-semibold py-2 px-4 rounded"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Clear
        </button>
      </div>
    </div>
  );
};

export default ExpenseEntry;
