import { Theme } from '@mui/material';
import { AnyAction } from '@reduxjs/toolkit';
import { basic, dark, olivegreen, peachpink } from '../../Theme/theme';
import { SET_THEME } from './themeTypes';

interface ThemeState {
  themeType: string;
  theme: Theme;
}

const initialState: ThemeState = {
  themeType: 'basic',
  theme: basic,
};

const themeReducer = (state = initialState, { type, payload }: AnyAction) => {
  switch (type) {
    case SET_THEME:
      return {
        ...state,
        theme: themeSelector(payload),
      };

    default:
      return state;
  }
};

// 테마타입별 테마지정 함수
const themeSelector = (themeType: String) => {
  switch (themeType) {
    case 'basic':
      return basic;

    case 'dark':
      return dark;

    case 'olivegreen':
      return olivegreen;

    case 'peachpink':
      return peachpink;

    default:
      return basic;
  }
};

export default themeReducer;
