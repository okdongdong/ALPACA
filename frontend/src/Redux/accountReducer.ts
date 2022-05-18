import { createSlice } from '@reduxjs/toolkit';

interface Study {
  id: number;
  title: string;
  pinnedTime: string;
  profileImgList: string;
}

interface UserInfo {
  userId: string;
  username: string;
  nickname: string;
  info: string;
  profileImg: string | null;
  bojId: string;
  preferredLanguage: string;
  studies: Study[];
  isLogin: boolean;
  studyCount: number;
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
  studyCount: 0,
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
    deleteStudyUserInfo: (state, action) => {
      state.studies = state.studies.filter((study) => study.id !== parseInt(action.payload));
      state.studyCount -= 1;
    },
    setStudies: (state, action) => {
      state.studies = action.payload;
    },
  },
});

export const { setUserInfo, logout, deleteStudyUserInfo, setStudies } = accountSlice.actions;

export default accountSlice.reducer;
