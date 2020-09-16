import fs from "fs/promises";
import jsonRaids from "./data/raids.json";
import Raid from "./models/Raid";
import Scrapper from "./Scrapper";
/**
 * Class managing the list of known raids
 */
class RaidListManager {
  static raids: Array<Raid>;

  // CAU means Check And Update
  static CAUStack: Array<{ raidName: string; language: string }> = [];

  static CAUProcessingStack: Array<{ raidName: string; language: string }> = [];

  static CAUNotFound: Array<{ raidName: string; language: string }> = [];

  static CAUDone: Array<{ raidName: string; language: string }> = [];

  static CAULock: number = 1;

  /**
   * Put in memory the list of raids
   */
  static async init(): Promise<void> {
    this.raids = jsonRaids.raids;
  }

  /**
   * Check if a raid exist in the json
   * @param raidName
   */
  static exist(raidName: string): boolean {
    for (let i = 0; i < this.raids.length; i += 1) {
      const raid = this.raids[i];
      if (raidName === raid.en_name || raidName === raid.jp_name) return true;
    }
    return false;
  }

  static compareRaids(a: Raid, b: Raid): number {
    if (a.level < b.level) return -1;
    if (a.level > b.level) return 1;
    // levels are equals, sub-sort on english name
    const A = a.en_name.toUpperCase();
    const B = b.en_name.toUpperCase();
    const enCompare = A.localeCompare(B, "en");
    if (enCompare !== 0) return enCompare;
    return a.jp_name.localeCompare(b.jp_name, "jp");
  }

  static stringifyRaids(): string {
    this.raids.sort(this.compareRaids);
    return JSON.stringify({ raids: this.raids }, null, 4);
  }

  /**
   * @deprecated
   * @param name
   * @param language
   * @param level
   */
  static createRaid(name: string, language: string, level: number): Raid {
    let enName = "unknown";
    let jpName = "unknown";
    if (language === "en") enName = name;
    if (language === "jp") jpName = name;
    return {
      id: name,
      en_name: enName,
      jp_name: jpName,
      level,
      type: "event",
      active: true,
      category: "unknown",
      event_name: "unknown",
      wiki_url: "unknown",
      last_backup: "unknown",
    };
  }

  static async rebuildRaidFile(): Promise<void> {
    await fs.writeFile(
      `${__dirname}/data/raids.json`,
      this.stringifyRaids(),
      "utf-8"
    );
  }

  static existInCAU(
    stack: Array<{ raidName: string; language: string }>,
    raidName: string
  ): boolean {
    let res = false;
    Object.keys(stack).forEach((k: any) => {
      if (stack[k].raidName === raidName) {
        res = true;
      }
    });
    return res;
  }

  static async CAUStackPush(raid: {
    raidName: string;
    language: string;
  }): Promise<void> {
    if (
      !this.exist(raid.raidName) &&
      !this.existInCAU(this.CAUStack, raid.raidName) &&
      !this.existInCAU(this.CAUNotFound, raid.raidName)
    ) {
      this.CAUStack.push(raid);
    }
    if (this.CAUStack.length > 0 && this.CAULock > 0) {
      this.CAULock -= 1;
      await this.checkAndUpdate();
    }
  }

  static async checkAndUpdate(): Promise<void> {
    this.CAUProcessingStack.push(this.CAUStack[0]);
    const raid = this.CAUStack.shift();
    console.log("[INFO*] Not found list : ");
    console.log(this.CAUNotFound);
    if (raid !== undefined)
      if (!this.exist(raid.raidName)) {
        let newRaid: Raid | undefined;
        await Scrapper.getRaidDataForRaidName(
          raid.raidName,
          raid.language
        ).then((r) => {
          newRaid = r;
        });
        if (newRaid !== undefined) {
          await this.raids.push(newRaid);
          await this.rebuildRaidFile().catch((err) => {
            // TODO : error log
            throw err;
          });
          await this.init();
          console.log(`[INFO-] New raid "${raid.raidName}" added`);
        } else {
          await this.CAUNotFound.push(raid);
          console.log(`[INFO-] Could not add "${raid.raidName}" `);
        }
        this.CAUProcessingStack = await this.CAUProcessingStack.filter(
          (r) => r !== raid
        );
      }
    this.CAULock += 1;
    if (this.CAULock > 0 && this.CAUStack.length > 0) {
      this.CAULock -= 1;
      await this.checkAndUpdate();
    }
  }

  static async read(): Promise<string> {
    return JSON.stringify({ raids: this.raids });
  }

  static async synchronizeWithTweetDeck(): Promise<void> {
    await Scrapper.getTweetDeck().then((tweetDeck) => {
      Object.keys(tweetDeck).forEach((k: any) => {
        if (!this.exist(tweetDeck[k].en_name)) {
          console.log(
            `[LOAD*] Updating new raid from TweetDeck ${tweetDeck[k].en_name}`
          );
          this.raids.push(tweetDeck[k]);
        }
      });
    });
    await this.rebuildRaidFile();
    console.log("[DONE*] Synchronization of raid list with TweetDeck done");
  }
}

export default RaidListManager;
