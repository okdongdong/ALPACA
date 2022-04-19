const palette = {
  /* backgruond*/
  basic_backgruond: '#FFFFFF',
  dark_backgruond: '#000000',
  olivegreen_backgruond: '#FFFAED',
  peachpink_backgruond: '#FFF5F4',
  /* main*/
  basic_main: '#97B2E1',
  dark_main: '#2D2D2D',
  olivegreen_main: '#AAC1AA',
  peachpink_main: '#FFC2C0',
  /* text*/
  basic_text: '#14181F',
  dark_text: '#FFFFFF',
  olivegreen_text: '#14181F',
  peachpink_text: '#000000',
  /* icon*/
  basic_icon: '#FFFFFF',
  dark_icon: '#FFFFFF',
  olivegreen_icon: '#FFFFFF',
  peachpink_icon: '#FFFFFF',
  /* accent*/
  basic_accent: '#3C5FAE',
  dark_accent: '#5A6B96',
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
  /* warning*/
  warning: '#FF6B6B'
};

const theme = {
  basic: {
    background: palette.basic_backgruond,
    main: palette.basic_main,
    text: palette.basic_text,
    icon: palette.basic_icon,
    accent: palette.basic_accent,
    component: palette.basic_component,
    component_accent: palette.basic_component_accent,
    warning: palette.warning,
  },
  dark: {
    background: palette.dark_backgruond,
    main: palette.dark_main,
    text: palette.dark_text,
    icon: palette.dark_icon,
    accent: palette.dark_accent,
    component: palette.dark_component,
    component_accent: palette.dark_component_accent,
    warning: palette.warning,
  },
  olivegreen: {
    background: palette.olivegreen_backgruond,
    main: palette.olivegreen_main,
    text: palette.olivegreen_text,
    icon: palette.olivegreen_icon,
    accent: palette.olivegreen_accent,
    component: palette.olivegreen_component,
    component_accent: palette.olivegreen_component_accent,
    warning: palette.warning
  },
  peachpink: {
    background: palette.peachpink_backgruond,
    main: palette.peachpink_main,
    text: palette.peachpink_text,
    icon: palette.peachpink_icon,
    accent: palette.peachpink_accent,
    component: palette.peachpink_component,
    component_accent: palette.peachpink_component_accent,
    warning: palette.warning
  }  
}

export default theme;