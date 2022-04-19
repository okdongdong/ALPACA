import GlobalStyles from "./Theme/GlobalStyles";
import Router from './router';
import "./App.css";
import { ThemeProvider } from '@emotion/react'
import theme from './Lib/Theme'

function App() {
  return (
    <ThemeProvider theme={theme}>
    <GlobalStyles />
    <Router></Router>
    </ThemeProvider>
  );
}

export default App;
