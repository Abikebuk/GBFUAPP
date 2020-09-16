import React from "react";
import Menu from "./Content/Menu";
import Raids from "./Content/Raids";

function Content(): JSX.Element {
  return (
    <div id="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <Raids />
          </div>
          <div className="col-auto">
            <Menu />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Content;
