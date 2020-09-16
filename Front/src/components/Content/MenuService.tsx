import axios from "axios";
import config from "../../config.json";

class MenuService {
  requestRaidList(): Promise<any> {
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
}

export default MenuService;
