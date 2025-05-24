import { createSlice } from "@reduxjs/toolkit";
import { addApprovalStatus, deleteExpensesheet, getRequestExpenseSheet } from "./expenseSheetThunk";

const initialState = {
  expenseSheetData: [],
  selectedExpenseSheet: null,
  requestedExpenseSheet: [],
  loading: false,
  error: null,
};

const expenseSheetSlice = createSlice({
  name: "expenseSheetData",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    addAllExpenseSheet: (state, action) => {
      state.loading = false;
      state.error = null;
      state.expenseSheetData = action.payload;
    },
    addExpenseSheet: (state, action) => {
      state.loading = false;
      state.error = null;
      state.expenseSheetData.push(action.payload);
    },
    setExpenseSheetDataReducer: (state, action) => {
      state.expenseSheetData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getRequestExpenseSheet.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getRequestExpenseSheet.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.requestedExpenseSheet = payload;
    });
    builder.addCase(getRequestExpenseSheet.rejected, (state, action) => {
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
      state.expenseSheetData = payload;
    })
    builder.addCase(addApprovalStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload
        ? action.payload.message
        : action.error.message;
    });
    builder
      .addCase(deleteExpensesheet.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteExpensesheet.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.requestedExpenseSheet = action.payload;
      })
      .addCase(deleteExpensesheet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setLoading,
  addExpenseSheet,
  setError,
  setExpenseSheetDataReducer,
} = expenseSheetSlice.actions;
export const expenseSheetSelector = (state) => state.expenseSheetData.expenseSheetData;
export const requestSheetSelector = (state) =>
  state.expenseSheetData.requestedExpenseSheet;
export default expenseSheetSlice.reducer;
