import '@emotion/react';

type ThemeId = 'basic' | 'dark' | 'olivegreen' | 'peachpink';

declare module '@emotion/react' {
  export interface Theme {   
    'basic': {
      background: string;
      main: string;
      text:string;
      icon: string;
      accent: string;
      component: string;
      component_accent: string;
      warning: string;   
    },
    'dark': {
      background: string;
      main: string;
      text:string;
      icon: string;
      accent: string;
      component: string;
      component_accent: string;
      warning: string;   
    },
    'olivegreen': {
      background: string;
      main: string;
      text:string;
      icon: string;
      accent: string;
      component: string;
      component_accent: string;
      warning: string;   
    },
    'peachpink': {
      background: string;
      main: string;
      text:string;
      icon: string;
      accent: string;
      component: string;
      component_accent: string;
      warning: string;   
    };
  }
}