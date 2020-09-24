import React from "react";
import Menu from "./Content/Menu";
import Raids from "./Content/Raids";
import RaidSelector from "./RaidSelectorService";
class Content extends React.Component<{}, { raidSelector: RaidSelector }> {
  constructor(props: object) {
    super(props);
    this.state = {
      raidSelector: new RaidSelector(),
    };
    this.pushSelector = this.pushSelector.bind(this);
    this.removeSelector = this.removeSelector.bind(this);
  }

  pushSelector(name: string, level: number): void {
    this.setState(() => {
      return {
        raidSelector: this.state.raidSelector.push({
          name: name,
          level: level,
        }),
      };
    });
  }

  removeSelector(name: string, level: number) {
    this.setState(() => {
      return {
        raidSelector: this.state.raidSelector.remove({
          name: name,
          level: level,
        }),
      };
    });
  }

  render(): JSX.Element {
    return (
      <div id="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <Raids selector={this.state.raidSelector} />
            </div>
            <div className="col-auto">
              <Menu
                pushSelector={this.pushSelector}
                removeSelector={this.removeSelector}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Content;
