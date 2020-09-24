import { Express } from "express";
import RaidListManager from "../RaidListManager";
import { setGenericHeaders } from "../Utils";

async function serviceRaidList(app: Express): Promise<void> {
  app.get("/RaidList", (req, res) => {
    setGenericHeaders(res);
    RaidListManager.read()
      .then((raids) => {
        res.send(raids);
      })
      .catch((err) => {
        console.log(
          `[ERROR] On : serviceRaidList\n$.......${err}\n.......Could not send raid list`
        );
      });
  });
}

export default serviceRaidList;
