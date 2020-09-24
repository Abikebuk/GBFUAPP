import config from "../../config.json";

class RaidsService {
  async requestStream(): Promise<ReadableStream<string> | undefined> {
    const url = `${config.server_hostname}/RaidFinder`;
    return fetch(url, {
      method: "GET",
      headers: { "Content-Type": "text/plain" },
    }).then((resp) => {
      if (resp.body !== null)
        return resp.body.pipeThrough(new TextDecoderStream());
    });
  }
}

export default RaidsService;
