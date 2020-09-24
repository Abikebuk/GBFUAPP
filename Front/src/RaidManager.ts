import RaidStack from "./models/RaidStack";
import axios from "axios";
import config from "./config.json";
import BackupRequest from "./models/BackupRequest";

class RaidManager {
  static raidStacks: Array<RaidStack> = [];
  static raidList: Array<any>;
  static raidStacksSize = 50;

  static async init(): Promise<void> {
    await this.requestRaidList().then((resp) => {
      this.raidList = resp.data.raids;
    });
    await this.initRaidStack();
  }

  static async initRaidStack(): Promise<void> {
    Object.keys(this.raidList).forEach((k) => {
      const raid = this.raidList[parseInt(k)];
      const raidStack: RaidStack = {
        en_name: raid.en_name,
        jp_name: raid.jp_name,
        level: raid.level,
        stack: [],
      };
      this.raidStacks.push(raidStack);
    });
  }

  static getIndexOfRaidStackFromBackupRequest(br: BackupRequest): number {
    let res = -1;
    Object.keys(this.raidStacks).forEach((key) => {
      const k = parseInt(key);
      if (
        this.raidStacks[k].level === parseInt(br.level) &&
        (this.raidStacks[k].jp_name === br.raid_name ||
          this.raidStacks[k].en_name === br.raid_name)
      ) {
        res = k;
      }
    });
    return res;
  }

  static pushBackupRequest(br: BackupRequest): Array<RaidStack> {
    const index = this.getIndexOfRaidStackFromBackupRequest(br);
    if (index >= 0) {
      this.raidStacks[index].stack.unshift({
        code: br.code,
        message: br.message,
        date: br.createdAt,
      });
      if (this.raidStacks[index].stack.length >= this.raidStacksSize) {
        this.raidStacks[index].stack.pop();
      }
    }
    return this.raidStacks;
  }

  static async requestRaidList(): Promise<any> {
    return axios({
      method: "GET",
      url: `${config.server_hostname}/RaidList`,
      responseType: "json",
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(
        `[ERROR] Menu : Request to server to fetch raid list failed.\n.......${err}`
      );
    });
  }

  static async requestRaidFinderStream(): Promise<
    ReadableStream<string> | undefined
  > {
    const url = `${config.server_hostname}/RaidFinder`;
    return fetch(url, {
      method: "GET",
      headers: { "Content-Type": "text/plain" },
    }).then((resp) => {
      if (resp.body !== null)
        return resp.body.pipeThrough(new TextDecoderStream());
    });
  }

  static getRaidStacks(): Array<RaidStack> {
    return this.raidStacks;
  }
}

export default RaidManager;
