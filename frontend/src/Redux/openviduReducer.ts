import { Session, OpenVidu } from 'openvidu-browser';
import { createSlice } from '@reduxjs/toolkit';

interface OpenviduState {
  OV: OpenVidu | undefined;
  session: Session | undefined;
}

const initialState: OpenviduState = {
  OV: undefined,
  session: undefined,
};

const openviduSlice = createSlice({
  name: 'openvidu',
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
    },
    setOV: (state, action) => {
      state.OV = action.payload;
    },
  },
});

export const { setSession, setOV } = openviduSlice.actions;

export default openviduSlice.reducer;
