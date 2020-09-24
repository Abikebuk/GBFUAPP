import React from "react";
import "../css/App.css";
import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";
import RaidManager from "../RaidManager";

function App(): JSX.Element {
  RaidManager.init().catch((e) => {
    console.log(e);
  });
  return (
    <div id="app">
      <Header />
      <Content />
      <Footer />
    </div>
  );
}

export default App;
