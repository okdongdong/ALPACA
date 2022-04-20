import { SET_LOADING } from './commonTypes';

export const setLoading = (isLoading: boolean) => {
  return {
    type: SET_LOADING,
    payload: isLoading,
  };
};
