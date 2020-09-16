import { Express } from "express";
import Twitter from "../Twitter";
import Parser from "../Parser";
import { setGenericHeaders, tagToLanguage } from "../Utils";
import RaidListManager from "../RaidListManager";
import config from "../../config.json";

async function serviceRaidFinder(app: Express, twit: Twitter): Promise<void> {
  app.get("/RaidFinder", (req, res) => {
    setGenericHeaders(res);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    twit
      .getStream()
      .then(async (stream) => {
        stream.on("data", async (data: any) => {
          try {
            const decodedData = Parser.decodeDataOfBackupRequest(data);
            if (decodedData !== null) {
              await RaidListManager.CAUStackPush({
                raidName: decodedData.raid_name,
                language: decodedData.language,
              });
              console.log(JSON.stringify(decodedData));
              res.write(JSON.stringify(decodedData));
            }
          } catch (err) {
            if (config["warning-print"])
              console.log(
                "[WARN*] Service Raid Finder : Could not parse stream. "
              );
          }
        });
      })
      .catch(() => {
        "[WARN*] Service Raid Finder : Could not parse stream. ";
      });
  });
}
export default serviceRaidFinder;
