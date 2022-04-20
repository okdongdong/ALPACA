import GlobalStyles from './Theme/GlobalStyles';
import Router from './router';
import './App.css';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material';
import Testbtn from './Testbtn';

function App() {
  const theme = useSelector((state: any) => state.themeReducer.theme);

  return (
    <>
      <ThemeProvider theme={theme}>
        {/* <Testbtn></Testbtn> */}
        <GlobalStyles />
        <Router></Router>
      </ThemeProvider>
    </>
  );
}

export default App;
