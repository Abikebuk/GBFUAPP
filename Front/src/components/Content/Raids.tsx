import React from "react";
import RaidsService from "./RaidsService";
import BackupRequest from "../../models/BackupRequest";

class Raids extends React.Component<{}, { raids: BackupRequest | undefined }> {
  constructor(props: any) {
    super(props);
    this.state = {
      raids: undefined,
    };
  }

  componentDidMount(): void {
    this.getStream();
  }

  getStream(): void {
    new RaidsService().requestStream();
    console.log("fetched");
  }

  render(): JSX.Element {
    const { raids } = this.state;
    return (
      <div id="raids">
        RAIDS
        {raids}
      </div>
    );
  }
}
export default Raids;
