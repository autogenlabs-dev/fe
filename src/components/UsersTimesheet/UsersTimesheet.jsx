import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { authSelector } from '@/redux/auth/authSlice';
import axiosIns from '@/api/axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Loader from '../loader';
import { format } from 'date-fns';

const UsersTimesheet = () => {
  const { userInfo } = useSelector(authSelector);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [userTimesheets, setUserTimesheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTimesheets, setLoadingTimesheets] = useState(false);

  // Fetch users who have timesheets
  useEffect(() => {
    const fetchUsersWithTimesheets = async () => {
      try {
        setLoading(true);
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.access?.token}`,
        };
        
        const { data } = await axiosIns.get('/timesheet/users-with-timesheets', {
          headers,
        });
        
        setUsers(data.users || []);
      } catch (error) {
        console.error('Error fetching users with timesheets:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.access?.token) {
      fetchUsersWithTimesheets();
    }
  }, [userInfo]);

  // Fetch timesheets for selected user
  useEffect(() => {
    const fetchUserTimesheets = async () => {
      if (!selectedUser) {
        setUserTimesheets([]);
        return;
      }

      try {
        setLoadingTimesheets(true);
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.access?.token}`,
        };
        
        const { data } = await axiosIns.get(`/timesheet/user/${selectedUser}/all-projects`, {
          headers,
        });
        
        setUserTimesheets(data.timesheets || []);
      } catch (error) {
        console.error('Error fetching user timesheets:', error);
        setUserTimesheets([]);
      } finally {
        setLoadingTimesheets(false);
      }
    };

    fetchUserTimesheets();
  }, [selectedUser, userInfo]);

  const getStatusBadge = (status) => {
    const statusColors = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      submitted: 'bg-blue-100 text-blue-800',
      notsubmitted: 'bg-gray-100 text-gray-800',
    };

    return (
      <Badge className={`${statusColors[status] || statusColors.notsubmitted} hover:opacity-80`}>
        {status || 'Not Submitted'}
      </Badge>
    );
  };
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Users Timesheet</h1>
          <p className="text-gray-600 mb-4">View timesheets for all users across projects</p>
        </div>
      </div>

      {/* User Selection Dropdown - Separate container with high z-index */}
      <div className="bg-white rounded-lg shadow-lg p-6 relative z-50">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Select User
          </label>
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader />
            </div>
          ) : (
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Choose a user..." />
              </SelectTrigger>
              <SelectContent 
                className="z-[9999] bg-white border shadow-lg max-h-60 overflow-auto"
                position="popper"
                sideOffset={4}
              >
                {users.map((user) => (
                  <SelectItem 
                    key={user.id} 
                    value={user.id.toString()}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Timesheets Table - Separate container with lower z-index */}
      {selectedUser && (
        <div className="bg-white rounded-lg shadow-lg p-6 relative z-10">
          <h3 className="text-lg font-semibold mb-4">
            Timesheets for {users.find(u => u.id.toString() === selectedUser)?.name}
          </h3>
          
          {loadingTimesheets ? (
            <div className="flex justify-center py-8">
              <Loader />
            </div>
          ) : userTimesheets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No timesheets found for this user
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Entry Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userTimesheets.map((timesheet) => (
                    <TableRow key={timesheet.id}>
                      <TableCell className="font-medium">
                        {timesheet.project?.projectname || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {timesheet.date ? format(new Date(timesheet.date), 'dd/MM/yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {timesheet.time || 0} hrs
                        </Badge>
                      </TableCell>
                      <TableCell>{timesheet.activity || timesheet.task || 'N/A'}</TableCell>
                      <TableCell>
                        {getStatusBadge(timesheet.approvalStatus)}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {timesheet.privateDescription || 'N/A'}
                      </TableCell>
                      <TableCell>{timesheet.entryType || 'Hourly Work'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UsersTimesheet;
