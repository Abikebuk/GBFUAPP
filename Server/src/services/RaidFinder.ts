import { Express } from "express";
import Twitter from "../Twitter";
import { setGenericHeaders } from "../Utils";

async function serviceRaidFinder(app: Express, twit: Twitter): Promise<void> {
  app.get("/RaidFinder", async (req, res) => {
    setGenericHeaders(res);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    const stream = await twit.getReadableStream();
    stream.pipe(res);
  });
  /*
    twit
      .getStream()
      .then(async (stream) => {
        stream.on("data", async (data: any) => {
          try {
            const decodedData = Parser.decodeDataOfBackupRequest(data);

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
     */
}

export default serviceRaidFinder;
