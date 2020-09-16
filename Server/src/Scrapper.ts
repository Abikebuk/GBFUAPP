import puppeteer from "puppeteer";
import cheerio from "cheerio";
import config from "./ScrapperConfig.json";
import Raid from "./models/Raid";

/**
 * An unoptimized gbf.wiki scrapper
 */
class Scrapper {
  static tweetDeck: Raid[] = [];

  static enRegexp = new RegExp("Lvl ([0-9]{2,3}) (.*)");

  static jpRegexp = new RegExp("Lv([0-9]{2,3}) (.*)");

  static async getTweetDeckHtml(): Promise<string | undefined> {
    const url: string = `${config.wiki_url}${config.tweetdeck_path}`;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const res = await page.content();
    await browser.close();
    return res;
  }

  static async loadTweetDeck(): Promise<Raid[]> {
    return this.getTweetDeckHtml().then((html) => {
      const res: Raid[] = [];
      if (html !== undefined) {
        const $ = cheerio.load(html);
        const rc = config.raid_category;
        let eventName = "default";
        // Iterate on raid categories
        Object.keys(rc).forEach((k: any) => {
          const rcName = rc[k].name;
          const rcId = rc[k].id;
          let type = "normal";
          const category = rcName;
          // raidTable is a list of <tr>[...]</tr>
          const raidTable = $(`#${rcId}`)
            .parent()
            .next("table")
            .find("tr")
            .toArray();
          // Iterate on <tr>[...]</tr> list
          Object.keys(raidTable).forEach((j: any) => {
            const tr = this.checkTr($, raidTable[j]);
            if (rcId === "Event_Raid_Bosses") {
              type = "event";
              if (typeof tr === "string") {
                eventName = tr;
              } else {
                tr.category = category;
                tr.type = type;
                tr.event_name = eventName;
                res.push(tr);
              }
            } else if (typeof tr !== "string") {
              tr.category = category;
              tr.type = type;
              tr.event_name = eventName;
              res.push(tr);
            }
          }); // Endif Iterate on <tr>[...]</tr> list
        }); // Endif Iterate on raid categories
      }
      return res;
    });
  }

  static checkTr($: CheerioStatic, tr: CheerioElement): Raid | string {
    const children = $(tr).children();
    const trLength = $(tr).children().length;
    if (trLength === 1) {
      return $(children[0]).text();
    }
    if (trLength === 2) {
      let jpName = "unknown";
      let enName = "unknown";
      let level = -1;
      let wikiUrl = "unknown";
      /* Jp part */
      const tr1 = $(children[0]);
      const tr1Match = tr1.text().match(this.jpRegexp);
      if (tr1Match) {
        // eslint-disable-next-line prefer-destructuring
        jpName = tr1Match[2];
      }
      /* En part */
      const tr2 = $(children[1]);
      const tr2Match = tr2.text().match(this.enRegexp);
      if (tr2Match) {
        // eslint-disable-next-line prefer-destructuring
        enName = tr2Match[2];
      }
      /* common */
      if (tr1Match) {
        // eslint-disable-next-line prefer-destructuring
        level = parseInt(tr1Match[1], 10);
      }
      const wikiUrlSearch = tr2.find("a").attr("href");
      if (wikiUrlSearch !== undefined) {
        wikiUrl = wikiUrlSearch;
      }
      return {
        id: enName,
        en_name: enName,
        jp_name: jpName,
        level,
        category: "",
        type: "",
        event_name: "",
        last_backup: "",
        active: true,
        wiki_url: wikiUrl,
      };
    }
    return "";
  }

  static async getTweetDeck(): Promise<Raid[]> {
    if (this.tweetDeck.length === 0) {
      return this.loadTweetDeck();
    }
    return this.tweetDeck;
  }

  static async search(
    query: string
  ): Promise<{ content: string; url: string }> {
    const url = encodeURI(`${config.wiki_url}/?search=${query}`);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const searchContent = await page.content();
    const $ = cheerio.load(searchContent);
    const urlFound = $("a[data-serp-pos=0]").attr("href");
    let newUrl = "notfound";
    let res = "";
    if (urlFound !== undefined) {
      newUrl = encodeURI(`${config.wiki_url}${urlFound}`);
      await page.goto(newUrl);
      res = await page.content();
    }
    console.log(newUrl);

    await browser.close();
    return { content: res, url: newUrl };
  }

  static async getRaidDataForRaidName(
    raidName: string,
    language: string
  ): Promise<Raid | undefined> {
    await this.loadTweetDeck();
    // eslint-disable-next-line consistent-return
    Object.keys(this.tweetDeck).forEach((k: any) => {
      if (raidName === this.tweetDeck[k].en_name || this.tweetDeck[k].jp_name) {
        return this.tweetDeck[k];
      }
    });
    return this.search(`${raidName} raid`).then((page) => {
      if (page.url === "notfound") {
        return undefined;
      }
      const $ = cheerio.load(page.content);
      const enNameLocation = $("a[title='TweetDeck']").parent().next();
      const jpNameLocation = enNameLocation.next();
      const enNameMatch = enNameLocation.text().match(this.enRegexp);
      const jpNameMatch = jpNameLocation.text().match(this.jpRegexp);
      let enName = "unknown";
      let jpName = "unknown";
      let level = -1;
      if (enNameMatch) {
        enName = enNameMatch[2];
      }
      if (jpNameMatch) {
        jpName = jpNameMatch[2];
      }
      if (enNameMatch) {
        level = parseInt(enNameMatch[1], 10);
      }
      if (enName === "unknown" && jpName === "unknown") {
        // eslint-disable-next-line default-case
        switch (language) {
          case "en":
            enName = raidName;
          case "jp":
          case "ja":
            jpName = raidName;
          default:
            return undefined;
        }
      }
      return {
        id: enName,
        en_name: enName,
        jp_name: jpName,
        level,
        category: "unknown",
        type: "event",
        event_name: "",
        last_backup: new Date().toString(),
        active: true,
        wiki_url: page.url,
      };
    });
  }
}

export default Scrapper;
