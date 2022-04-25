import { Session } from 'openvidu-browser';
import { AnyAction } from '@reduxjs/toolkit';
import { SET_SESSION } from './openviduTypes';

interface OpenviduState {
  session: Session | undefined;
}

const initialState: OpenviduState = {
  session: undefined,
};

const openviduReducer = (state = initialState, { type, payload }: AnyAction) => {
  switch (type) {
    case SET_SESSION:
      return {
        ...state,
        session: payload,
      };
    default:
      return state;
  }
};

export default openviduReducer;
