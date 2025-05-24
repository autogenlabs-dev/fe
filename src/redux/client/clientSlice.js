import { createSlice } from '@reduxjs/toolkit';



const initialState = {
    
};

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    //
  },
  extraReducers: (builder) => {
    // builder.addCase(loginUser.pending, (state) => {
    //   clientSlice.caseReducers.setLoading(state);
    // }),
  },
})

export const {  } = clientSlice.actions;


export default clientSlice.reducer;