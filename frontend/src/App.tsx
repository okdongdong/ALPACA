import GlobalStyles from './Theme/GlobalStyles';
import Router from './router';
import './App.css';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material';
import Testbtn from './Testbtn';
import NowLoading from './Components/Commons/NowLoading';

function App() {
  const theme = useSelector((state: any) => state.themeReducer.theme);

  return (
    <>
      <ThemeProvider theme={theme}>
        {/* <Testbtn></Testbtn> */}
        <NowLoading />
        <GlobalStyles />
        <Router></Router>
      </ThemeProvider>
    </>
  );
}

export default App;
