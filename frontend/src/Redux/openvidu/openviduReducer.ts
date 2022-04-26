import { Session, OpenVidu } from 'openvidu-browser';
import { AnyAction } from '@reduxjs/toolkit';
import { SET_SESSION, SET_OV } from './openviduTypes';

interface OpenviduState {
  OV: OpenVidu | undefined;
  session: Session | undefined;
}

const initialState: OpenviduState = {
  OV: undefined,
  session: undefined,
};

const openviduReducer = (state = initialState, { type, payload }: AnyAction) => {
  switch (type) {
    case SET_SESSION:
      return {
        ...state,
        session: payload,
      };
    case SET_OV:
      return {
        ...state,
        OV: payload,
      };
    default:
      return state;
  }
};

export default openviduReducer;
