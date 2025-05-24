import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import userSlice from "./User/userSlice";
import projectsReducer from "./project/projectSlice";
import timeSheetSlice from "./timesheet/timeSheetSlice";
import expenseSheetSlice from "./expensesheet/expenseSheetSlice";
import clientSlice from "./client/clientSlice";
export const store = configureStore({
  reducer: {
    auth: authSlice,
    client: clientSlice,
    user: userSlice,
    projects: projectsReducer,
    timeSheetData: timeSheetSlice,
    expenseSheetData: expenseSheetSlice
  },
  devTools: process.env.NODE_ENV === "development",
});
