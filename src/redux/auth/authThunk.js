import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axios";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const { data } = await axiosIns.post(`/auth/login`, {
        email,
        password,
      });
      // console.log("data", data);
      // localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const { data } = await axiosIns.post("/auth/verify-otp", { email, otp });
      console.log(data, "===dataaaaaaaaa");
      
      // localStorage.setItem("userInfo", JSON.stringify(data));
      return data; 
    } catch (error) {
      console.log(error, "===dataaaaaaaaa");
      return rejectWithValue(error.response.data);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password, userType }, thunkAPI) => {
    try {
      const { data } = await axiosIns.post(`/api/auth/register`, {
        name,
        email,
        password,
        userType,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const refreshTokens = createAsyncThunk(
  "auth/refreshToken",
  async ({ refreshToken }, thunkAPI) => {
    try {
      const { data } = await axiosIns.post(`/auth/refresh-tokens`, {
        refreshToken,
      });
      // console.log("refreshTokens in thunk ", refreshToken);
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
