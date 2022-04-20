import { SET_USER_INFO, UserInfo } from './accountTypes';

export const setUserInfo = (userInfo: UserInfo) => {
  return {
    type: SET_USER_INFO,
    payload: userInfo,
  };
};
