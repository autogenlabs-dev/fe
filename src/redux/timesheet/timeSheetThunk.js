import axiosIns from "@/api/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
// import axiosIns from "../../api/axios";

export const getTimeSheet = createAsyncThunk(
  "timeSheetData",
  async ({ projectId, date, token, endOfWeek }, thunkAPI) => {
    try {
      console.log("callingnnngg", projectId, date, token);
      
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // const { data } = await axiosIns.get(`/timesheet/weekly?date=${date}`, {
      // const { data } = await axiosIns.get(`/timesheet/list?startOfWeek=${date}&endOfWeek=${endOfWeek}`, {
      const { data } = await axiosIns.get(`/timesheet`, {
        headers,
      });
      console.log("getdataknasnasnns", data);
      return data.timesheet;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getTimeSheetByProjectId = createAsyncThunk(
  "getTimeSheetByProjectId",
  async ({ projectId, token }, thunkAPI) => {
    try {
      // console.log("callingnnngg", projectId, date, token);
      
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // const { data } = await axiosIns.get(`/timesheet/weekly?date=${date}`, {
      // const { data } = await axiosIns.get(`/timesheet/list?startOfWeek=${date}&endOfWeek=${endOfWeek}`, {
      const { data } = await axiosIns.get(`/timesheet/project/${projectId}`, {
        headers,
      });
      console.log("getdataknasnasnns", data);
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getTimeSheetDetails = createAsyncThunk(
  "timeSheetDetails",
  async ({ projectId, token, date }, thunkAPI) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const { data } = await axiosIns.get(
        `/timesheet?projectId=${projectId}&date=${date}`,
        {
          headers,
        }
      );
      // console.log("details data", data);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getRequestTimeSheet = createAsyncThunk(
  "requestTimeSheet",
  async ({ token }, thunkAPI) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const { data } = await axiosIns.get(
        `/timesheet/all/pending`,
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

export const addNewTimeSheet = createAsyncThunk(
  "addTimeSheet",
  async ({ token, newTimeSheet }, thunkAPI) => {
    // console.log("newTimeSheet", newTimeSheet);
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const { data } = await axiosIns.post(`/timesheet/save`, newTimeSheet, {
        headers,
      });
      console.log("dataascmakascasncsajsja", data);
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
      const { data } = await axiosIns.post(`/timesheet/change/status`, body, {
        headers,
      });
      // console.log("status change data", data);
      // thunkAPI.dispatch(getRequestTimeSheet({ token }));
      // thunkAPI.dispatch(getTimeSheet({ token }));

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteTimeSheet = createAsyncThunk(
  "deleteTimeSheet",
  async ({ token, body }, thunkAPI, dispatch) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      // console.log("body", body)
      const { data } = await axiosIns.delete(`/timesheet`, {
        headers,
        data: body 
      });

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
