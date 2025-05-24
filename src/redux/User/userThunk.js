import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axios";

export const getUsers = createAsyncThunk("user", async (token, thunkAPI) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const { data } = await axiosIns.get(`/user`, {
      headers,
    });
    console.log(data.users, "===data.usersdata.usersdata233");
    return data.users;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getSubordinates = createAsyncThunk("user", async ({ path='', token}, thunkAPI) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const { data } = await axiosIns.get(`/user/${path}`, {
      headers,
    });
    console.log(data, "=ascscsjansncjsajna");
    
    return data.users;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const addNewUser = createAsyncThunk(
  "addUser",
  async ({ token, newUser }, thunkAPI) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const { data } = await axiosIns.post(`/auth/register`, newUser, {
        headers,
      });
      // console.log("data", data.user);
      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
