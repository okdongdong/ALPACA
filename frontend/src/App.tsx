import { useState } from "react";
import "./App.css";
import { ThemeProvider } from '@emotion/react'
import theme from './Lib/Theme'
import Testbtn from "./Testbtn";

function App() {
  const [count, setCount] = useState(0);
  return (
    <ThemeProvider theme={theme}>
      <div className="App">알파카~
        <Testbtn themeId="peachpink" />
      </div>
    </ThemeProvider>
  )
}

export default App;
