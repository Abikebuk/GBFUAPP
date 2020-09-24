import express from "express";
import config from "./config.json";
import Twitter from "./src/Twitter";
import serviceRaidFinder from "./src/services/RaidFinder";
import RaidListManager from "./src/RaidListManager";
import serviceRaidList from "./src/services/RaidsList";
import { printBanner } from "./src/Utils";

const token = config["token-bearer"];
const { port } = config;

const app = express();
async function start() {
  console.log("[LOAD*] Granblue Fantasy Utility App is starting...");
  const twit = new Twitter(token);

  console.log(
    `[INFO*] Twitter API is using version ${config["twitter-api-version"]}`
  );
  if (config["twitter-api-version"] == 2) {
    console.log("[LOAD*] Initialize Twitter rules....");
    await twit.initRulesV2(config["twitter-rules-v2"]);
    await twit.printRulesV2();
  }
  console.log("[LOAD*] Initialize the Raid List Updater...");
  await RaidListManager.init();
  console.log("[LOAD*] Synchronization with gbf.wiki's TweetDeck...");
  await RaidListManager.synchronizeWithTweetDeck();
  console.log("[*DONE] Initialization of the app done!");
  console.log("[LOAD*] Service Raid Finder...");
  twit.getStream();
  await serviceRaidFinder(app, twit);
  console.log("[LOAD*] Service Raid List...");
  await serviceRaidList(app);
  console.log("[*DONE] All services have been launched!");
  printBanner();
}

start()
  .then(() => {
    app.listen(port, () => {
      console.log(`[LOAD*] Listening to port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
    throw err;
  });
