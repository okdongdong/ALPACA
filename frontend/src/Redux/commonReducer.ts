import { createSlice } from '@reduxjs/toolkit';

interface CommonState {
  nowLoading: boolean;
}

const initialState: CommonState = {
  nowLoading: false,
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.nowLoading = action.payload;
    },
  },
});

export const { setLoading } = commonSlice.actions;

export default commonSlice.reducer;
