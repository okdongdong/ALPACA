import { useState } from "react";
import logo from "./logo.svg";
import GlobalStyles from "./Theme/GlobalStyles";
import Router from './router';
import "./App.css";

function App() {
  return (
    <>
      <GlobalStyles />
      <Router></Router>
    </>
  );
}

export default App;
