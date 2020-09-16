import React from "react";

class Clock extends React.Component<{}, { interval: number; time: Date }> {
  constructor(props: Date) {
    super(props);
    this.state = {
      interval: 0,
      time: new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
      ),
    };
  }

  componentDidMount(): void {
    setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount(): void {
    const { interval } = this.state;
    clearInterval(interval);
  }

  tick(): void {
    this.setState({
      time: new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
      ),
    });
  }

  StrOn2Char(str: string): string {
    return `0${str}`.slice(-2);
  }

  render(): JSX.Element {
    const { state } = this;
    const { time } = state;
    return (
      <div id="clock">
        <span id="clock-text">Japanese time </span>
        <span className="clock-time">
          {this.StrOn2Char(time.getHours().toString())}
        </span>
        <span className="clock-colon">:</span>
        <span className="clock-time">
          {this.StrOn2Char(time.getMinutes().toString())}
        </span>
        <span className="clock-colon">:</span>
        <span className="clock-time">
          {this.StrOn2Char(time.getSeconds().toString())}
        </span>
      </div>
    );
  }
}
export default Clock;
