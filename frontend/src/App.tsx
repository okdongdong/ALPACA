import GlobalStyles from './Theme/GlobalStyles';
import Router from './router';
import './App.css';
import { useSelector } from 'react-redux';
import { Theme, ThemeProvider } from '@mui/material';
import NowLoading from './Components/Commons/NowLoading';
import { basic, dark, olivegreen, peachpink } from './Theme/theme';
import { useEffect, useState } from 'react';

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

function App() {
  const themeType = useSelector((state: any) => state.theme.themeType);
  const isLogin = useSelector((state: any) => state.account.isLogin);

  const [theme, setTheme] = useState<Theme>(basic);

  useEffect(() => {
    console.log(themeType);
    setTheme(() => themeSelector(themeType));
  }, [themeType]);
  return (
    <>
      <ThemeProvider theme={theme}>
        <NowLoading />
        <GlobalStyles />
        <Router isLogin={isLogin} />
      </ThemeProvider>
    </>
  );
}

export default App;
