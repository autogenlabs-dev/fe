import { createSlice } from "@reduxjs/toolkit";
import { getProjects, addNewProject, updateProjectStatus } from "./projectThunk";

const initialState = {
  projects: [],
  loading: false,
  error: null,
};
const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    addAllProjects: (state, action) => {
      state.loading = false;
      state.error = null;
      state.projects = action.payload;
    },
    addProject: (state, action) => {
      state.loading = false;
      state.error = null;
      state.projects = [...state.projects, action.payload];
    },
    setError: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
      // state.projects = null;
    },
    deleteProject: (state, action) => {
      state.loading = false;
      state.error = null;
      state.projects = action.payload;
    },
    editProject: (state, action) => {
      state.loading = false;
      state.error = null;
      state.projects = action.payload;
    },
    resetProject: (state) => {
      state.loading = false;
      state.error = null;
      state.projects = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder.addCase(addNewProject.pending, (state) => {
      projectSlice.caseReducers.setLoading(state);
    }),
      builder.addCase(addNewProject.fulfilled, (state, { payload }) => {
        projectSlice.caseReducers.addProject(state, { payload });
      }),
      builder.addCase(addNewProject.rejected, (state, action) => {
        if (action.payload) {
          projectSlice.caseReducers.setError(state, {
            payload: action.payload.message,
          });
        } else {
          projectSlice.caseReducers.setError(state, {
            payload: action.error.message,
          });
        }
      });
    builder
      .addCase(updateProjectStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProjectStatus.fulfilled, (state, action) => {
        const {status, id} = action.payload;
        state.loading = false;
        state.projects = state.projects.map((project) => {
          if(project.id === id) {
            return {...project, status}
          }
          return project
        })
      })
      .addCase(updateProjectStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const projectSelector = (state) => state.projects;
export const {
  addProject,
  deleteProject,
  setLoading,
  editProject,
  resetProject,
} = projectSlice.actions;
export default projectSlice.reducer;
