import config from "../../config.json";

class RaidsService {
  async requestStream(): Promise<void> {
    const url = `${config.server_hostname}/RaidFinder`;
    console.log(`FETCHING ${url}`);
    await fetch(url).then((resp) => {
      console.log("??");
      console.log(resp);
    });
  }
}

export default RaidsService;
