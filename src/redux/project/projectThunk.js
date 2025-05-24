import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axios";

export const getProjects = createAsyncThunk(
  "project",
  async (token, thunkAPI) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const { data } = await axiosIns.get(`/project`, {
        headers,
      });
      return data.projects;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getMyProjects = createAsyncThunk(
  "project",
  async (token, thunkAPI) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const { data } = await axiosIns.get(`/project/my`, {
        headers,
      });
      return data.projects;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const addNewProject = createAsyncThunk(
  "addProject",
  async ({ token, newProject }, thunkAPI) => {
    // console.log("token", token);
    // console.log("newProject", newProject);

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const { data } = await axiosIns.post(`/project`, newProject, {
        headers,
      });
      // console.log("data", data.project);
      return data.project;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateProjectStatus = createAsyncThunk(
  "updateProjectStatus",
  async ({token, projectId, status}, thunkAPI) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const body = {
        projectId,
        status
      }
      const { data } = await axiosIns.post(`/project/changestatus`, body, {
        headers,
      });
      // console.log("data", data);
      return data.project;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


// Update Existing Project Thunk
export const updateExistingProject = createAsyncThunk(
  'project/updateExistingProject',
  async ({ token, id, projectData }, thunkAPI) => {
    try {
      const response = await axiosIns.patch(`/project/${id}`, projectData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
