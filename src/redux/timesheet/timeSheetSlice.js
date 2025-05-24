import { createSlice } from "@reduxjs/toolkit";
import {
  addNewTimeSheet,
  getTimeSheet,
  getTimeSheetDetails,
  getRequestTimeSheet,
  addApprovalStatus,
  deleteTimeSheet
} from "./timeSheetThunk";

const initialState = {
  timeSheetData: [],
  selectedTimeSheet: null,
  requestedTimeSheet: [],
  loading: false,
  error: null,
};

const timeSheetSlice = createSlice({
  name: "timeSheetData",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    addAllTimeSheet: (state, action) => {
      state.loading = false;
      state.error = null;
      state.timeSheetData = action.payload;
    },
    addTimeSheet: (state, action) => {
      state.loading = false;
      state.error = null;
      state.timeSheetData.push(action.payload);
    },
    setSelectedTimeSheet: (state, action) => {
      state.selectedTimeSheet = action.payload;
    },
    setRequestedTimeSheet: (state, action) => {
      state.requestedTimeSheet = action.payload;
    },
    setError: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    resetTimeSheet: (state) => {
      state.loading = false;
      state.error = null;
      state.timeSheetData = [];
      state.selectedTimeSheet = null;
      state.requestedTimeSheet = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTimeSheet.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getTimeSheet.fulfilled, (state, { payload }) => {
      state.loading = false;
      const allTimeSheets = []
      // payload?.map(sheet => {
      //   const allTimeSheets1 = sheet.timesheets?.map(s => ({ 
      //     ...s, 
      //     projectName: sheet.projectName,
      //     projectManager: sheet.projectManager,
      //   }))
      //   allTimeSheets.push(...allTimeSheets1);
      // });
      // allTimeSheets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      // state.timeSheetData = allTimeSheets;
      state.timeSheetData = payload;
    });
    builder.addCase(getTimeSheet.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload
        ? action.payload.message
        : action.error.message;
    });
    builder.addCase(addNewTimeSheet.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addNewTimeSheet.fulfilled, (state, { payload }) => {
      state.loading = false;
      // const user = JSON.parse(localStorage.getItem("userInfo") || "{}");
      state.timeSheetData.push(payload);
    });
    builder.addCase(addNewTimeSheet.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload
        ? action.payload.message
        : action.error.message;
    });
    builder.addCase(getTimeSheetDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getTimeSheetDetails.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.selectedTimeSheet = payload;
    });
    builder.addCase(getTimeSheetDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload
        ? action.payload.message
        : action.error.message;
    });
    builder.addCase(getRequestTimeSheet.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getRequestTimeSheet.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.requestedTimeSheet = payload;
    });
    builder.addCase(getRequestTimeSheet.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload
        ? action.payload.message
        : action.error.message;
    });
    builder.addCase(addApprovalStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    builder.addCase(addApprovalStatus.fulfilled, (state, { payload }) => {
      state.loading = false;
      // state.timeSheetData = payload;
    })
    builder.addCase(addApprovalStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload
        ? action.payload.message
        : action.error.message;
    });
    builder
      .addCase(deleteTimeSheet.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTimeSheet.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.requestedTimeSheet = action.payload;
      })
      .addCase(deleteTimeSheet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setLoading,
  addAllTimeSheet,
  addTimeSheet,
  setError,
  resetTimeSheet,
} = timeSheetSlice.actions;
export const timeSheetSelector = (state) => state.timeSheetData.timeSheetData;
export const timeSheetDetailsSelector = (state) =>
  state.timeSheetData.selectedTimeSheet;
export const requestSheetSelector = (state) =>
  state.timeSheetData.requestedTimeSheet;
export default timeSheetSlice.reducer;
