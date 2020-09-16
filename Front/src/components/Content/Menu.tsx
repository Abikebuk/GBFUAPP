import React from "react";
import MenuService from "./MenuService";
import Raid from "../../models/Raid";

class Menu extends React.Component<{}, { interval: number; response: Raid[] }> {
  constructor(props: string) {
    super(props);
    this.state = {
      response: [],
      interval: 0,
    };
  }

  componentDidMount(): void {
    this.getRaidList();
  }

  getRaidList(): void {
    new MenuService()
      .requestRaidList()
      .then((resp) => {
        console.log(resp.data);
        this.setState({ response: resp.data.raids });
      })
      .catch((err) => {
        console.log(`[ERROR] Menu : Request error.\n.......${err}`);
      });
  }

  render(): JSX.Element {
    const { response } = this.state;
    return (
      <div id="menu">
        MENU
        <ol>
          {response.map((raid) => {
            return (
              <li>
                {raid.en_name}, {raid.jp_name}
              </li>
            );
          })}
        </ol>
      </div>
    );
  }
}
export default Menu;
