import { GlobalStyles as GlobalThemeStyles } from '@mui/material';

export default function GlobalStyles() {
  return (
    <GlobalThemeStyles
      styles={{
        
        '*': {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box'
        },
        html: {
          width: '100%',
          height: '100%',
          background: "#97B2E1",
          // WebkitOverflowScrolling: 'touch',
          // "&::-webkit-scrollbar": {
          //   width: "0.5vw"
          // },
          // "&::-webkit-scrollbar-thumb" : {
          //   borderRadius: "100px",
          //   backgroundColor: "#5F7B84",
          //   boxShadow: "inset 2px 2px 5px 0 rgba(#fff, 0.5)"
          // },
        },
        body: {
          width: '100%',
          height: '100%'
        },
        '#root': {
          width: '100%',
          height: '100%'
        },
      }}
    />
  );
}
