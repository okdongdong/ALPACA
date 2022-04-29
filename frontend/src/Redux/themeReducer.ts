import { createSlice } from '@reduxjs/toolkit';

interface ThemeState {
  themeType: string;
}

const initialState: ThemeState = {
  themeType: 'basic',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // 함수 반환값을 사용해야해서 return방식 사용
    setTheme: (state, action) => {
      state.themeType = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
