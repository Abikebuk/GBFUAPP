import React from "react";
import Raid from "../../models/Raid";
import RaidManager from "../../RaidManager";

class Menu extends React.Component<
  { pushSelector: Function; removeSelector: Function },
  { interval: number; response: Raid[] }
> {
  constructor(props: { pushSelector: Function; removeSelector: Function }) {
    super(props);
    this.state = {
      response: [],
      interval: 0,
    };
    this.handleCheckBox = this.handleCheckBox.bind(this);
  }

  componentDidMount(): void {
    this.getRaidList();
  }

  getRaidList(): void {
    RaidManager.requestRaidList()
      .then((resp) => {
        const raids = resp.data.raids;
        this.setState({ response: raids });
      })
      .catch((err) => {
        console.log(`[ERROR] Menu : Request error.\n.......${err}`);
      });
  }

  handleCheckBox(event: React.ChangeEvent): void {
    const el = event.target;
    const id = el.id.split("-");
    const name = id[2];
    const level = parseInt(id[3], 10);
    if (el.className === "unchecked") {
      this.props.pushSelector(name, level);
      el.className = "checked";
    } else {
      this.props.removeSelector(name, level);
      el.className = "unchecked";
    }
  }

  renderRaidList(): JSX.Element {
    const { response } = this.state;
    const res = response.map((raid) => {
      return (
        <li key={raid.en_name}>
          <input
            id={"menu-list-" + raid.en_name + "-" + raid.level}
            type="checkbox"
            className="unchecked"
            onChange={this.handleCheckBox}
          />
          {raid.en_name}, {raid.jp_name}
        </li>
      );
    });
    return <ol>{res}</ol>;
  }
  render(): JSX.Element {
    return (
      <div id="menu">
        MENU
        {this.renderRaidList()}
      </div>
    );
  }
}
export default Menu;
