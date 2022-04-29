import { AnyAction } from '@reduxjs/toolkit';
import { SET_LOADING } from './commonTypes';

interface CommonState {
  nowLoading: boolean;
}

const initialState: CommonState = {
  nowLoading: false,
};

const commonReducer = (state = initialState, { type, payload }: AnyAction) => {
  switch (type) {
    case SET_LOADING:
      return { nowLoading: payload };

    default:
      return state;
  }
};
export default commonReducer;
