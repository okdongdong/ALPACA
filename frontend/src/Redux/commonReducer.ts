import { createSlice } from '@reduxjs/toolkit';
interface CommonState {
  nowLoading: boolean;
  nowLoadingMessage: string | undefined;
}

const initialState: CommonState = {
  nowLoading: false,
  nowLoadingMessage: undefined,
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.nowLoading = action.payload;
      if (!action.payload) {
        state.nowLoadingMessage = undefined;
      }
    },
    setLoadingMessage: (state, action) => {
      state.nowLoadingMessage = action.payload;
    },
  },
});

export const { setLoading, setLoadingMessage } = commonSlice.actions;

export default commonSlice.reducer;
