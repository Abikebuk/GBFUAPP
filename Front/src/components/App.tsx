import React from "react";
import "../css/App.css";
import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";

function App(): JSX.Element {
  return (
    <div id="app">
      <Header />
      <Content />
      <Footer />
    </div>
  );
}

export default App;
