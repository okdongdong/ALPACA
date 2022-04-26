import { SET_SESSION, SET_OV } from './openviduTypes';
import { Session, OpenVidu } from 'openvidu-browser';
export const setSession = (session: Session | undefined) => {
  return {
    type: SET_SESSION,
    payload: session,
  };
};

export const setOV = (OV: OpenVidu | undefined) => {
  return {
    type: SET_OV,
    payload: OV,
  };
};
