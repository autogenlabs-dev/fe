import { createSlice } from "@reduxjs/toolkit";
import { addNewUser, getUsers } from "./userThunk";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    addAllUsers: (state, action) => {
      state.loading = false;
      state.error = null;
      state.user = action.payload;
    },
    addUser: (state, action) => {
      state.loading = false;
      state.error = null;
      state.user = [...state.user, action.payload];
    },
    setError: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
      // state.user = null;
    },
    deleteUser: (state, action) => {
      state.loading = false;
      state.error = null;
      state.user = action.payload;
    },
    editUser: (state, action) => {
      // const users = user.
      // state.user = action.payload;
    },
    resetUser: (state) => {
      state.loading = false;
      state.error = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUsers.pending, (state) => {
      userSlice.caseReducers.setLoading(state);
    }),
      builder.addCase(getUsers.fulfilled, (state, { payload }) => {
        userSlice.caseReducers.addAllUsers(state, { payload });
      }),
      builder.addCase(getUsers.rejected, (state, action) => {
        if (action.payload) {
          userSlice.caseReducers.setError(state, {
            payload: action.payload.message,
          });
        } else {
          userSlice.caseReducers.setError(state, {
            payload: action.error.message,
          });
        }
      });
    builder.addCase(addNewUser.pending, (state) => {
      userSlice.caseReducers.setLoading(state);
    }),
      builder.addCase(addNewUser.fulfilled, (state, { payload }) => {
        userSlice.caseReducers.addUser(state, { payload });
      }),
      builder.addCase(addNewUser.rejected, (state, action) => {
        if (action.payload) {
          userSlice.caseReducers.setError(state, {
            payload: action.payload.message,
          });
        } else {
          userSlice.caseReducers.setError(state, {
            payload: action.error.message,
          });
        }
      });
  },
});

export const userSelector = (state) => state.user;
export const { addUser, deleteUser, setLoading, editUser, resetUser } =
  userSlice.actions;
export default userSlice.reducer;
