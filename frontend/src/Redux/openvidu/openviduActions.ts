import { SET_SESSION } from './openviduTypes';
import { Session } from 'openvidu-browser';
export const setSession = (session: Session | undefined) => {
  return {
    type: SET_SESSION,
    payload: session,
  };
};
