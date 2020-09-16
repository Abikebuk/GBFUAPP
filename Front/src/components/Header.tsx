import React from "react";
import Clock from "./Header/Clock";
import Banner from "./Header/Banner";

function Header(): JSX.Element {
  return (
    <div id="header">
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <Banner />
          </div>
          <div className="col-auto">
            <Clock />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Header;
