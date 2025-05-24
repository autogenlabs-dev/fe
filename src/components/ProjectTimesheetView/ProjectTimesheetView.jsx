import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { authSelector } from '@/redux/auth/authSlice';
import axiosIns from '@/api/axios';
import Loader from '../loader';
import { ArrowLeft, Trash2 } from 'lucide-react';

const ProjectTimesheetView = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector(authSelector);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [timeSheet, setTimeSheet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTimeSheet, setLoadingTimeSheet] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch users who have timesheets for this project
  useEffect(() => {
    const fetchUsersWithTimesheets = async () => {
      try {
        setLoading(true);
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.access?.token}`,
        };
        
        // First fetch all timesheets for this project
        const { data: timesheetData } = await axiosIns.get(`/timesheet/project/${projectId}`, {
          headers
        });
        
        // Extract unique users who have timesheets
        const usersWithTimesheets = timesheetData.data || [];
        const uniqueUsers = usersWithTimesheets.reduce((acc, timesheet) => {
          if (timesheet.user && !acc.find(u => u.id === timesheet.user.id)) {
            acc.push({
              id: timesheet.user.id,
              name: timesheet.user.name
            });
          }
          return acc;
        }, []);
        
        setUsers(uniqueUsers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users with timesheets:', error);
        setLoading(false);
      }
    };

    if (userInfo?.access?.token && projectId) {
      fetchUsersWithTimesheets();
    }
  }, [userInfo, projectId]);

  // Fetch timesheets when user is selected
  useEffect(() => {
    if (selectedUser && projectId) {
      fetchUserTimesheets();
    }
  }, [selectedUser, projectId]);

  const fetchUserTimesheets = async () => {
    try {
      setLoadingTimeSheet(true);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo?.access?.token}`,
      };
      
      // Fetch all timesheets for the project with user filter as query param
      const { data } = await axiosIns.get(`/timesheet/project/${projectId}`, {
        headers,
        params: {
          userId: selectedUser
        }
      });
      
      // The backend should already filter by user, but we can double-check
      const filteredTimesheets = data.data?.filter(entry => entry.user?.id == selectedUser) || [];
      setTimeSheet(filteredTimesheets);
      setLoadingTimeSheet(false);
    } catch (error) {
      console.error('Error fetching timesheets:', error);
      setLoadingTimeSheet(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo?.access?.token}`,
      };
      await axiosIns.delete(`/timesheet/delete-dir-admin/${deleteId}`, {
        headers,
      });
      
      const updatedSheet = timeSheet.filter(sh => sh.id != deleteId);
      setTimeSheet(updatedSheet);
      
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.log(error);
      setIsDeleting(false);
    }
  };

  const DeleteModal = ({ isOpen, onClose, onDelete, isDeleting }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]">
        <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
          <h2 className="text-lg font-semibold">Are you sure you want to delete?</h2>
          <div className="mt-4 flex gap-6 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              disabled={isDeleting}
              onClick={onDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              {isDeleting ? "Deleting" : "Delete"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto py-10">
      <DeleteModal 
        isOpen={showDeleteModal} 
        isDeleting={isDeleting}
        onClose={() => setShowDeleteModal(false)} 
        onDelete={handleDelete} 
      />

      <div className="bg-white shadow-lg rounded-lg p-8 mb-10">
        <div className="flex items-center gap-4 mb-6 border-b pb-4">
          <ArrowLeft className="text-main hover:text-main/90 cursor-pointer" onClick={() => navigate(-1)} />
          <h2 className="text-2xl font-semibold">Project Timesheet View</h2>
        </div>

        {/* User Dropdown */}
        <div className="mb-6">
          <label htmlFor="userSelect" className="block text-sm font-medium text-gray-700 mb-2">
            Select User:
          </label>
          {loading ? (
            <Loader />
          ) : (
            <select
              id="userSelect"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="block w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Choose a user...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Timesheet Table */}
        {selectedUser && (
          <div className="flex justify-center items-center flex-col">
            {loadingTimeSheet ? (
              <Loader />
            ) : !loadingTimeSheet && timeSheet.length === 0 ? (
              <p>No TimeSheet Found.</p>
            ) : (
              <div className="w-full overflow-auto">
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="border border-gray-300 px-4 py-2">Project</th>
                      <th className="border border-gray-300 px-4 py-2">Role</th>
                      <th className="border border-gray-300 px-4 py-2">Time (Hours)</th>
                      <th className="border border-gray-300 px-4 py-2">Date</th>
                      <th className="border border-gray-300 px-4 py-2">Description</th>
                      <th className="border border-gray-300 px-4 py-2">Approval Status</th>
                      <th className="border border-gray-300 px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeSheet?.map((entry, index) => (
                      <tr
                        key={entry.id}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="border border-gray-300 px-4 py-2">{entry.project?.projectname || "N/A"}</td>
                        <td className="border border-gray-300 px-4 py-2">{entry.user?.access || "N/A"}</td>
                        <td className="border border-gray-300 px-4 py-2">{entry.time}</td>
                        <td className="border border-gray-300 px-4 py-2">{new Date(entry.date).toLocaleDateString()}</td>
                        <td className="border border-gray-300 px-4 py-2">{entry.privateDescription}</td>
                        <td className="border border-gray-300 px-4 py-2">{entry.approvalStatus}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <Trash2 
                            className="text-red-600 hover:text-red-800 cursor-pointer" 
                            onClick={() => {
                              setDeleteId(entry.id); 
                              setShowDeleteModal(true);
                            }} 
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTimesheetView;
