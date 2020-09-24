import axios from "axios";
import Twit from "twitter-lite";
import { Readable } from "stream";
import config from "../config.json";
import Parser from "./Parser";
import RaidListManager from "./RaidListManager";
/**
 * Twitter data fetching
 */
export default class Twitter {
  /**
   * twitter api v1 connection
   */
  twit = new Twit({
    consumer_key: config["token-consumer-key"],
    consumer_secret: config["token-consumer-secret"],
    access_token_key: config["token-access"],
    access_token_secret: config["token-access-secret"],
  });

  /* Request headers */
  headers: object;

  readable = new Readable();

  /**
   * Constructor
   * @param token : string, the bearer token
   */
  constructor(token: string) {
    this.headers = {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    };
    // eslint-disable-next-line no-underscore-dangle,func-names,@typescript-eslint/no-empty-function
    this.readable._read = function () {};
  }

  /**
   * set the rules on the twitter stream
   * @param rules : JSON, a set of rules
   */
  async setRulesV2(rules: object): Promise<any> {
    return axios({
      url: config["rules-url-v2"],
      method: "POST",
      headers: this.headers,
      data: rules,
    })
      .then((response) => {
        if (config.verbose) console.log(response.data);
      })
      .catch((err) => {
        console.log("[ERROR] Twitter : Could not set rules");
        throw err;
      });
  }

  /**
   * Return the rules
   * @return rules : Promise<any>
   */
  async getRulesV2(): Promise<any> {
    return axios({
      url: config["rules-url-v2"],
      method: "GET",
      headers: this.headers,
    }).catch((err) => {
      console.log("[ERROR] Twitter : Could not get rules");
      throw err;
    });
  }

  async getStream(): Promise<any> {
    switch (config["twitter-api-version"]) {
      case 1:
        return this.getStreamV1().catch((err) => {
          console.log(`[ERROR] Twitter : Could not get stream.`);
        });
      case 2:
        return this.getStreamV2();
      default:
        throw new Error(
          `[ERROR] Twitter : API version ${config["twitter-api-version"]} doesn't exist. Set it to 1 or 2.`
        );
    }
  }

  /**
   * @return stream : Promise<any>
   */
  async getStreamV1(): Promise<any> {
    return this.twit
      .stream("statuses/filter", config["twitter-rules-v1"])
      .on("data", (data) => {
        const decodedData = Parser.decodeDataOfBackupRequest(data);
        const stringData = JSON.stringify(decodedData);
        // RaidListManager.requestUpdate(decodedData);
        this.readable.push(stringData);
      });
  }

  /**
   * Return the stream of tweets
   * @return stream : Promise<any>
   */
  async getStreamV2(): Promise<any> {
    return axios({
      url: config["stream-url-v2"],
      method: "GET",
      responseType: "stream",
      headers: this.headers,
    }).catch((err) => {
      console.log(
        `[ERROR] Twitter : could not get stream, something happened.\n.......${err}`
      );
      throw err;
    });
  }

  /**
   * Print the rules on the console
   */
  async printRulesV2(): Promise<any> {
    return this.getRulesV2().then((rules) => {
      if (rules.data.data !== undefined) console.log(rules.data);
      else console.log("[ERROR] No rules to print.");
    });
  }

  /**
   * Delete all the rules
   * @return rules : Promise<any>
   */
  async deleteAllRulesV2(): Promise<any> {
    await this.getRulesV2().then((rules) => {
      const { data } = rules.data;
      const ids: number[] = [];
      if (data !== undefined)
        Object.keys(data).forEach((k) => {
          if (config.verbose) console.log(data[k]);
          ids.push(data[k].id);
        });
      if (ids.length > 0) {
        return this.setRulesV2({ delete: { ids } });
      }
      return rules;
    });
  }

  /**
   * Initialize the rules
   * @param rules : JSON, a set of rules
   */
  async initRulesV2(rules: object): Promise<void> {
    console.log("[LOAD*] Deleting existing twitter rules");
    await this.deleteAllRulesV2();
    console.log("[LOAD*] Adding new twitter rules");
    await this.setRulesV2(rules);
  }

  async getReadableStream(): Promise<Readable> {
    return this.readable;
  }
}
