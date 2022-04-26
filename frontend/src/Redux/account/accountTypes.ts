export const SET_USER_INFO = 'SET_USER_INFO';

export interface UserInfo {
  userId: string;
  username: string;
  nickname: string;
  info: string;
  profileImg: string;
  bojId: string;
  preferredLanguage: string;
  studies: string;
}
