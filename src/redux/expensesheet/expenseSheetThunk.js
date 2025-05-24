import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axios";

export const addNewExpenseSheet = createAsyncThunk(
  "addNewExpenseSheet",
  async ({ token, data }, thunkAPI) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      console.log(data, "===data,ksckamcmkms");
      
      const { data } = await axiosIns.post(`/expensesheet/submit/all`, data, { headers, });
      console.log("addNewExpenseSheet009", data);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getRequestExpenseSheet = createAsyncThunk(
  "requestExpenseSheet",
  async ({ token }, thunkAPI) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const { data } = await axiosIns.get(
        `/expensesheet/all/pending`,
        {
          headers,
        }
      );
      // console.log("requested data", data);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const addApprovalStatus = createAsyncThunk(
  "addApprovalStatus",
  async ({ token, body }, thunkAPI, dispatch) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      // console.log("body", body)
      const { data } = await axiosIns.post(`/expensesheet/change/status`, body, {
        headers,
      });
      // console.log("status change data", data);
      // thunkAPI.dispatch(getRequestExpenseSheet({ token }));

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteExpensesheet = createAsyncThunk(
  "deleteExpensesheet",
  async ({ token, body }, thunkAPI, dispatch) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      // console.log("body", body)
      const { data } = await axiosIns.delete(`/expensesheet`, {
        headers,
        data: body 
      });

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);