import React from "react";
import BackupRequest from "../../models/BackupRequest";
import RaidManager from "../../RaidManager";
import RaidStack from "../../models/RaidStack";
import RaidSelector from "../RaidSelectorService";

class Raids extends React.Component<
  { selector: RaidSelector },
  { raidStacks: Array<RaidStack> }
> {
  constructor(props: { selector: RaidSelector }) {
    super(props);
    this.state = {
      raidStacks: [],
    };
    this.getRaidSelector = this.getRaidSelector.bind(this);
  }

  componentDidMount(): void {
    this.setRaidStack()
      .then(() => {
        this.getStream();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  readStream(stream: ReadableStreamDefaultReader<string>): void {
    stream.read().then((res) => {
      if (res.value !== undefined) {
        try {
          const req: BackupRequest = JSON.parse(res.value);
          const raidStacks = RaidManager.pushBackupRequest(req);
          this.setState(() => {
            return { raidStacks: raidStacks };
          });
        } catch {}
      }
      this.readStream(stream);
    });
  }

  getStream(): void {
    RaidManager.requestRaidFinderStream().then(async (stream) => {
      if (stream !== undefined) {
        this.readStream(stream.getReader());
      }
    });
  }

  async setRaidStack(): Promise<Array<RaidStack>> {
    if (this.state.raidStacks.length === 0) {
      await this.sleep(100);
      this.setState(() => {
        return {
          raidStacks: RaidManager.getRaidStacks(),
        };
      });
      return this.setRaidStack();
    }
    return this.state.raidStacks;
  }

  renderListRaidOf(index: number): JSX.Element {
    const rs = this.state.raidStacks;
    const res = this.state.raidStacks[index].stack.map((br) => (
      <li id={"raid-" + rs[index].en_name} key={br.date + br.code}>
        {br.code} {br.message} {br.date}
      </li>
    ));
    return (
      <ul>
        <div>{rs[index].en_name}</div>
        {res}
      </ul>
    );
  }

  renderListRaid(): JSX.Element {
    const s = this.getRaidSelector().list();
    const res: Array<JSX.Element> = [];
    Object.keys(s).map((k) => {
      const el = s[parseInt(k)];
      const index = this.getIndexOfRaidStack(el.name, el.level);
      res.push(this.renderListRaidOf(index));
    });
    return <div>{res}</div>;
  }

  getIndexOfRaidStack(name: string, level: number): number {
    const rs = this.state.raidStacks;
    let res = -1;
    Object.keys(rs).forEach((key) => {
      const k = parseInt(key, 10);
      if (rs[k].en_name === name && rs[k].level === level) {
        res = k;
      }
    });
    return res;
  }
  getRaidSelector(): RaidSelector {
    return this.props.selector;
  }

  render(): JSX.Element {
    if (this.state.raidStacks.length === 0) {
      return <div id="raid">Loading...</div>;
    } else {
      return (
        <div id="raids">
          RAIDS
          {this.renderListRaid()}
        </div>
      );
    }
  }
}
export default Raids;
