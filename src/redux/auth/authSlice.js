import { createSlice } from '@reduxjs/toolkit';
import { loginUser, refreshTokens, registerUser } from "./authThunk"
import { resetProject } from '../project/projectSlice';
import { resetTimeSheet } from '../timesheet/timeSheetSlice';
import { resetUser } from '../User/userSlice';
import toastMessage from '@/lib/toastMessage';

let userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  loading: false,
  userInfo: userInfoFromStorage,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
      state.userInfo = null;
    },
    setUserInfo: (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.userInfo = payload;
    },
    setError: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
      state.userInfo = null;
    },
    reset: (state) => {
      state.loading = false;
      state.error = null;
      state.userInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      authSlice.caseReducers.setLoading(state);
    }),
      builder.addCase(loginUser.fulfilled, (state, { payload }) => {
        authSlice.caseReducers.setUserInfo(state, { payload })
      }),
      builder.addCase(loginUser.rejected, (state, action) => {
        const msg = action.payload ? action.payload.message : action.error.message;
        state.loading = false;
        // if (action.payload) {
        //   authSlice.caseReducers.setError(state, { payload: action.payload.message })
        // } else {
        //   authSlice.caseReducers.setError(state, { payload: action.error.message })
        // }
        toastMessage(msg, "error");
      }),
      builder.addCase(registerUser.pending, (state) => {
        authSlice.caseReducers.setLoading(state);
      }),
      builder.addCase(registerUser.fulfilled, (state, { payload }) => {
        authSlice.caseReducers.setUserInfo(state, { payload })
      }),
      builder.addCase(registerUser.rejected, (state, action) => {
        if (action.payload) {
          authSlice.caseReducers.setError(state, { payload: action.payload.message })
        } else {
          authSlice.caseReducers.setError(state, { payload: action.error.message })
        }
      })
  },
})

export const { reset, setUserInfo } = authSlice.actions;

export const logoutUser = () => async (dispatch) => {
  dispatch(reset());
  dispatch(resetProject());
  dispatch(resetTimeSheet());
  dispatch(resetUser());
  localStorage.clear();
};

export const authSelector = (state) => state.auth;

export default authSlice.reducer;