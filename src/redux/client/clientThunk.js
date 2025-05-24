import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axios";

export const createClient = createAsyncThunk(
  "createClient",
  async ({ token, ...rest }, thunkAPI) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const { data } = await axiosIns.post(`/clients`, rest, {
        headers,
      });

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateClient = createAsyncThunk(
  "updateClient",
  async ({ token, id, ...rest }, thunkAPI) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const { data } = await axiosIns.put(`/clients/${id}`, rest, {
        headers,
      });

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getClientsThunk = createAsyncThunk(
  "getClients",
  async ({ token, }, thunkAPI) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const { data } = await axiosIns.get(`/clients`, {
        headers,
      });

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getClientByIdThunk = createAsyncThunk(
  "getClientByIdThunk",
  async ({ id, token, }, thunkAPI) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const { data } = await axiosIns.get(`/clients/${id}`, {
        headers,
      });

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteClientThunk = createAsyncThunk(
  "deleteClientThunk",
  async ({ id, token, }, thunkAPI) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const { data } = await axiosIns.delete(`/clients/${id}`, {
        headers,
      });

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);