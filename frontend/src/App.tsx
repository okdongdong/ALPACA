import GlobalStyles from './Theme/GlobalStyles';
import Router from './router';
import './App.css';
import { ThemeProvider } from '@emotion/react';
import theme from './Lib/theme';
import Testbtn from './Testbtn';

function App() {
  return (
    <>
      <GlobalStyles />
      <Router></Router>
    </>
  );
}

export default App;
