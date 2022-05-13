import { Session, OpenVidu } from 'openvidu-browser';
import { createSlice } from '@reduxjs/toolkit';
import UserModel from '../Components/Room/StudyLive/user-model';

export interface Constraints {
  audioSource: undefined | string;
  videoSource: undefined | string;
  publishAudio: boolean;
  publishVideo: boolean;
}

interface OpenviduState {
  OVForCamera: OpenVidu | undefined;
  OVForScreen: OpenVidu | undefined;
  sessionForCamera: Session | undefined;
  sessionForScreen: Session | undefined;
  mainUser: UserModel | undefined;
  constraints: Constraints;
}

const initialState: OpenviduState = {
  OVForCamera: undefined,
  OVForScreen: undefined,
  sessionForCamera: undefined,
  sessionForScreen: undefined,
  mainUser: undefined,
  constraints: {
    audioSource: undefined,
    videoSource: undefined,
    publishAudio: true,
    publishVideo: true,
  },
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
    setConstraints: (state, action) => {
      state.constraints = action.payload;
    },
  },
});

export const {
  setOVForCamera,
  setOVForScreen,
  setSessionForCamera,
  setSessionForScreen,
  setMainUser,
  setConstraints,
} = openviduSlice.actions;

export default openviduSlice.reducer;
