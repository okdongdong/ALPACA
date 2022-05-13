import { createTheme } from '@mui/material';

const palette = {
  /* backgruond*/
  basic_backgruond: '#FFFFFF',
  dark_backgruond: '#2D2D2D',
  olivegreen_backgruond: '#FFFAED',
  peachpink_backgruond: '#FFF5F4',
  /* main*/
  basic_main: '#97B2E1',
  dark_main: '#3A4358',
  olivegreen_main: '#AAC1AA',
  peachpink_main: '#FFC2C0',
  /* txt*/
  basic_text: '#14181F',
  dark_text: '#E0E0E0',
  olivegreen_text: '#14181F',
  peachpink_text: '#000000',
  /* icon*/
  basic_icon: '#FFFFFF',
  dark_icon: '#FFFFFF',
  olivegreen_icon: '#FFFFFF',
  peachpink_icon: '#FFFFFF',
  /* accent*/
  basic_accent: '#3C5FAE',
  dark_accent: '#536A86',
  olivegreen_accent: '#1F7C39',
  peachpink_accent: '#CC9B99',
  /* component*/
  basic_component: '#F2F2F2',
  dark_component: '#1D1D20',
  olivegreen_component: '#F4EDE1',
  peachpink_component: '#F1DDE0',
  /* component_accent*/
  basic_component_accent: '#FFCD29',
  dark_component_accent: '#E3DC31',
  olivegreen_component_accent: '#E06C6C',
  peachpink_component_accent: '#E06C6C',
  /* warn*/
  warn: '#FF6B6B',
};

declare module '@mui/material/styles' {
  interface Palette {
    bg: string;
    bg2: string;
    main: string;
    txt: string;
    icon: string;
    accent: string;
    component: string;
    component_accent: string;
    warn: string;
  }

  interface PaletteOptions {
    bg: string;
    bg2: string;
    main: string;
    txt: string;
    icon: string;
    accent: string;
    component: string;
    component_accent: string;
    warn: string;
  }
}

export const basic = createTheme({
  palette: {
    bg: palette.basic_backgruond,
    bg2: '#F7F6CB',
    main: palette.basic_main,
    txt: palette.basic_text,
    icon: palette.basic_icon,
    accent: palette.basic_accent,
    component: palette.basic_component,
    component_accent: palette.basic_component_accent,
    warn: palette.warn,
  },
});

export const dark = createTheme({
  palette: {
    bg: palette.dark_backgruond,
    bg2: '#759485',
    main: palette.dark_main,
    txt: palette.dark_text,
    icon: palette.dark_icon,
    accent: palette.dark_accent,
    component: palette.dark_component,
    component_accent: palette.dark_component_accent,
    warn: palette.warn,
  },
});

export const olivegreen = createTheme({
  palette: {
    bg: palette.olivegreen_backgruond,
    bg2: '#F7F6CB',
    main: palette.olivegreen_main,
    txt: palette.olivegreen_text,
    icon: palette.olivegreen_icon,
    accent: palette.olivegreen_accent,
    component: palette.olivegreen_component,
    component_accent: palette.olivegreen_component_accent,
    warn: palette.warn,
  },
});

export const peachpink = createTheme({
  palette: {
    bg: palette.peachpink_backgruond,
    bg2: '#F7F6CB',
    main: palette.peachpink_main,
    txt: palette.peachpink_text,
    icon: palette.peachpink_icon,
    accent: palette.peachpink_accent,
    component: palette.peachpink_component,
    component_accent: palette.peachpink_component_accent,
    warn: palette.warn,
  },
});
