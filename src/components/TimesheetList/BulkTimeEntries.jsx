import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BulkTimeEntries = ({ cancel, isFromDashboard=false }) => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([
    {
      user: "Shuja, Alqama",
      client: "",
      matter: "",
      type: "Hourly",
      activity: "",
      privateDescription: "",
      publicDescription: "",
      date: "2024-09-05",
      labor: "",
      travel: "",
      billable: "",
      showAdvanced: false, // Flag to toggle advanced fields
    },
  ]);

  const [copyPrevious, setCopyPrevious] = useState(false);

  const handleChange = (index, field, value) => {
    const updatedEntries = [...entries];
    updatedEntries[index][field] = value;
    setEntries(updatedEntries);
  };

  const handleAddEntry = () => {
    const lastEntry = entries[entries.length - 1];
    const newEntry = copyPrevious
      ? { ...lastEntry, showAdvanced: false }
      : {
          user: "Shuja, Alqama",
          client: "",
          matter: "",
          type: "Hourly",
          activity: "",
          privateDescription: "",
          publicDescription: "",
          date: "2024-09-05",
          labor: "",
          travel: "",
          billable: "",
          showAdvanced: false,
        };
    setEntries([...entries, newEntry]);
  };

  const handleToggleAdvanced = (index) => {
    const updatedEntries = [...entries];
    updatedEntries[index].showAdvanced = !updatedEntries[index].showAdvanced;
    setEntries(updatedEntries);
  };

  const handleSave = () => {
    console.log("Saving entries:", entries);
    // Save the entries to the server or perform further actions
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Bulk Time Entries</h2>
      <div className="mb-4">
        <input
          type="checkbox"
          id="copyPrevious"
          checked={copyPrevious}
          onChange={() => setCopyPrevious(!copyPrevious)}
        />
        <label htmlFor="copyPrevious" className="ml-2 cursor-pointer">
          Copy fields from the previous line to the next
        </label>
      </div>

      {/* Headers */}
      <div className="grid grid-cols-11 gap-4 mb-2">
        <div className="font-semibold">For User</div>
        <div className="font-semibold">Client</div>
        <div className="font-semibold">Matter</div>
        <div className="font-semibold">Type</div>
        <div className="font-semibold">Activity</div>
        <div className="font-semibold">Private Description</div>
        <div className="font-semibold">Date</div>
        <div className="font-semibold">Labor</div>
        <div className="font-semibold">Travel</div>
        <div className="font-semibold">Billable</div>
        <div className="font-semibold">Advanced</div>
      </div>

      {/* Entries Container */}
      <div className="overflow-y-auto max-h-96">
        {entries.map((entry, index) => (
          <div key={index} className="mb-4">
            {/* Input Row */}
            <div className="grid grid-cols-11 gap-4">
              <div>
                <input
                  type="text"
                  value={entry.user}
                  onChange={(e) => handleChange(index, "user", e.target.value)}
                  className="w-full border p-1 rounded h-8"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Search"
                  value={entry.client}
                  onChange={(e) => handleChange(index, "client", e.target.value)}
                  className="w-full border p-1 rounded h-8"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Search"
                  value={entry.matter}
                  onChange={(e) => handleChange(index, "matter", e.target.value)}
                  className="w-full border p-1 rounded h-8"
                />
              </div>
              <div>
                <select
                  value={entry.type}
                  onChange={(e) => handleChange(index, "type", e.target.value)}
                  className="w-full border p-1 rounded h-8"
                >
                  <option value="Hourly">Hourly</option>
                  <option value="Flat Fee">Flat Fee</option>
                  {/* Add more options as needed */}
                </select>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Search"
                  value={entry.activity}
                  onChange={(e) =>
                    handleChange(index, "activity", e.target.value)
                  }
                  className="w-full border p-1 rounded h-8"
                />
              </div>
              <div>
                <textarea
                  value={entry.privateDescription}
                  onChange={(e) =>
                    handleChange(index, "privateDescription", e.target.value)
                  }
                  className="w-full border p-1 rounded h-8"
                />
              </div>
              <div>
                <input
                  type="date"
                  value={entry.date}
                  onChange={(e) => handleChange(index, "date", e.target.value)}
                  className="w-full border p-1 rounded h-8"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={entry.labor}
                  onChange={(e) => handleChange(index, "labor", e.target.value)}
                  className="w-full border p-1 rounded h-8"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={entry.travel}
                  onChange={(e) => handleChange(index, "travel", e.target.value)}
                  className="w-full border p-1 rounded h-8"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={entry.billable}
                  onChange={(e) =>
                    handleChange(index, "billable", e.target.value)
                  }
                  className="w-full border p-1 rounded h-8"
                />
              </div>
              <div>
                <span
                  className="text-[#002147] cursor-pointer text-sm"
                  onClick={() => handleToggleAdvanced(index)}
                >
                  {entry.showAdvanced ? "- Basic" : "+ Advanced"}
                </span>
              </div>
            </div>

            {/* Advanced Section */}
            {entry.showAdvanced && (
              <div className="mt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1 flex items-center">
                    <input
                      type="checkbox"
                      checked={entry.billable}
                      onChange={(e) =>
                        handleChange(index, "billable", e.target.checked)
                      }
                      className="h-4 w-4"
                    />
                    <label className="ml-2">Billable</label>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <input
                      type="checkbox"
                      checked={entry.override}
                      onChange={(e) =>
                        handleChange(index, "override", e.target.checked)
                      }
                      className="h-4 w-4"
                    />
                    <label className="ml-2">Exclude From Invoice</label>
                  </div>
                  <div className="col-span-2">
                    <label className="font-semibold">Public Description</label>
                    <textarea
                      className="border p-1 rounded h-8 w-full"
                      onChange={(e) =>
                        handleChange(index, "publicDescription", e.target.value)
                      }
                    ></textarea>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add More Entry Button */}
      <div className="mt-4">
        <button
          className="bg-[#002147] text-white px-4 py-2 rounded"
          onClick={handleAddEntry}
        >
          Add More Entry
        </button>
      </div>

      {/* Save and Cancel Buttons */}
      <div className="mt-4 flex justify-end gap-4">
        <button
          className="bg-[#002147] text-white px-4 py-2 rounded"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded"
          onClick={() => {setEntries([]); isFromDashboard ? navigate(-1): cancel()}}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BulkTimeEntries;
