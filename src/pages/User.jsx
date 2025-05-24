import CreateUserForm from "@/components/CreateUser/CreateUserForm";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Edit2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSelector, useDispatch } from "react-redux";
import {
  addUser,
  userSelector,
  deleteUser,
  setLoading,
} from "../redux/User/userSlice";
import { getSubordinates, getUsers } from "@/redux/User/userThunk";
import { authSelector } from "@/redux/auth/authSlice";
import Loader from "@/components/loader";
import { ADMIN, DIRECTOR, PROJECT_MANAGER } from "@/constants";
import axiosIns from "@/api/axios";
import UserTable from "@/components/Tables/userTable";
import WrapperComponent from "@/components/Wrapper/TableWrapper";

const User = () => {
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useSelector(userSelector);

  return (
    <div className="px-4 py-4">
      {userLoading && (
        <div className="absolute bg-white w-full h-full flex justify-center items-center z-50">
          <Loader />
        </div>
      )}
      <UserTable />
    </div>
  );
};

export default User;
