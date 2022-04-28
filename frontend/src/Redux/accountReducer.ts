import { createSlice } from '@reduxjs/toolkit';

interface UserInfo {
  userId: string;
  username: string;
  nickname: string;
  info: string;
  profileImg: string | null;
  bojId: string;
  preferredLanguage: string;
  studies: string[];
  isLogin: boolean;
}

const initialState: UserInfo = {
  userId: '',
  username: '',
  nickname: '',
  info: '',
  profileImg: '',
  bojId: '',
  preferredLanguage: '',
  studies: [],
  isLogin: false,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setUserInfo: (state, action) => ({
      ...action.payload,
    }),
    logout: (state) => {
      localStorage.clear();
      return {
        ...initialState,
      };
    },
  },
});

export const { setUserInfo, logout } = accountSlice.actions;

export default accountSlice.reducer;
