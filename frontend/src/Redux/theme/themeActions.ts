import { SET_THEME } from './themeTypes';

export const setTheme = (theme: string) => {
  return {
    type: SET_THEME,
    payload: theme,
  };
};
