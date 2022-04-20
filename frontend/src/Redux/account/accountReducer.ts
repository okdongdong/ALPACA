import { AnyAction } from '@reduxjs/toolkit';
import { SET_USER_INFO, UserInfo } from './accountTypes';

const initialState: UserInfo = {
  userId: '',
  username: '',
  nickname: '',
  info: '',
  profileImg: '',
  bojId: '',
  preferredLanguage: '',
  studies: '',
};

const accountReducer = (state = initialState, { type, payload }: AnyAction) => {
  switch (type) {
    case SET_USER_INFO:
      return { ...state, ...payload };

    default:
      return state;
  }
};

export default accountReducer;
