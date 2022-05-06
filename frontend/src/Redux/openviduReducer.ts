import { Session, OpenVidu } from 'openvidu-browser';
import { createSlice } from '@reduxjs/toolkit';
import UserModel from '../Components/Room/StudyLive/user-model';
interface OpenviduState {
  OVForCamera: OpenVidu | undefined;
  OVForScreen: OpenVidu | undefined;
  sessionForCamera: Session | undefined;
  sessionForScreen: Session | undefined;
  mainUser: UserModel | undefined;
}

const initialState: OpenviduState = {
  OVForCamera: undefined,
  OVForScreen: undefined,
  sessionForCamera: undefined,
  sessionForScreen: undefined,
  mainUser: undefined,
};

const openviduSlice = createSlice({
  name: 'openvidu',
  initialState,
  reducers: {
    setOVForCamera: (state, action) => {
      state.OVForCamera = action.payload;
    },
    setOVForScreen: (state, action) => {
      state.OVForScreen = action.payload;
    },
    setSessionForCamera: (state, action) => {
      state.sessionForCamera = action.payload;
    },
    setSessionForScreen: (state, action) => {
      state.sessionForScreen = action.payload;
    },
    setMainUser: (state, action) => {
      state.mainUser = action.payload;
    },
  },
});

export const {
  setOVForCamera,
  setOVForScreen,
  setSessionForCamera,
  setSessionForScreen,
  setMainUser,
} = openviduSlice.actions;

export default openviduSlice.reducer;
