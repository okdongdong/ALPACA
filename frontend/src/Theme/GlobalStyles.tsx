import { GlobalStyles as GlobalThemeStyles } from '@mui/material';
import { useTheme } from '@mui/material/styles';
export default function GlobalStyles() {
  const theme = useTheme();
  return (
    <GlobalThemeStyles
      styles={{
        '*': {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
        },
        html: {
          width: '100%',
          height: '100%',
          // background: theme.palette.main,
          color: theme.palette.txt,
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
          height: '100%',
        },
        '#root': {
          width: '100%',
          height: '100%',
        },
        '#background': {
          backgroundImage: `linear-gradient(12deg, #fff, ${theme.palette.main}, ${theme.palette.bg2}, #fff)`,
          width: '400%',
          height: '400%',
          position: 'fixed',
          top: '-150%',
          left: '-150%',
          zIndex: -1,
        },
      }}
    />
  );
}
