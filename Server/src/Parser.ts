import BackupRequest from "./models/BackupRequest";
import config from "../config.json";

/**
 * Parser class
 */
export default class Parser {
  /** English regexp */
  static en = new RegExp(
    // eslint-disable-next-line no-control-regex
    "(.*) ?([A-Z0-9]{8}) :Battle ID\nI need backup!\nLvl ([0-9]{2,3}) (.*)\n",
    "i"
  );

  /** Japanese regexp */
  static jp = new RegExp(
    // eslint-disable-next-line no-control-regex
    "(.*) ?([A-Z0-9]{8}) :参戦ID\n参加者募集！\nLv([0-9]{2,3}) (.*)\n",
    "i"
  );

  /**
   * Parse a raid tweet into a json readable string following the BackupRequest structure.
   * @param s : string, the string to parse
   * @param createdAt, the date of creation of the tweet
   * @param language, language of the tweet
   * @return Promise<string>
   */
  static decodeBackupRequest(
    s: string,
    createdAt: string,
    language: string
  ): BackupRequest | null {
    let re: RegExp;
    switch (language) {
      case "en":
        re = this.en;
        break;
      case "jp":
      case "ja":
        re = this.jp;
        break;
      default:
        re = new RegExp("");
    }
    const match = s.match(re);
    if (match === null || match.length !== 5) {
      if (config["warning-print"])
        console.log(
          `[WARN*] Parser : Parsing failed, string either empty or doesn't match parsing parameters :\n.......String = ${s}`
        );
      return null;
    }
    const [, message, code, level, raidName] = match;
    return {
      raid_name: raidName,
      level,
      message,
      code,
      createdAt,
      language,
    };
  }

  static decodeDataOfBackupRequest(data: any): BackupRequest | null {
    switch (config["twitter-api-version"]) {
      case 1:
        return this.decodeBackupRequest(data.text, data.created_at, data.lang);
      case 2:
      default:
        throw Error(
          `[ERROR] Parser : API version ${config["twitter-api-version"]} doesn't exist. Set it to 1 or 2.`
        );
    }
  }
}

module.exports = Parser;
