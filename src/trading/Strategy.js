const { ASSET, CURRENCY, PAIR } = require("../config");
const SMA = require("../indicators/SMA");
const { round0, round4 } = require("../utils");

// long | closed
const Positions = {
  CLOSED: "CLOSED",
  LONG: "LONG"
};

class Strategy {
  constructor(portfolio) {
    this.currentPosition = Positions.CLOSED;
    this.portfolio = portfolio;

    this.smaFast = new SMA(1);
    this.smaSlow = new SMA(2);
  }

  updateIndicators(close) {
    this.smaFast.update(close);
    this.smaSlow.update(close);
  }

  areIndicatorsReady() {
    // no need to check smaFast, because it will be ready faster
    return this.smaSlow.isReady();
  }

  // long only strategy
  checkAction(close) {
    console.log(`CHECK ACTION: close: ${close} | SMA DIFF: ${round4(this.smaFast.result - this.smaSlow.result)}`);
    if (this.smaFast.result > this.smaSlow.result) {
      this.goLong(close);
    } else {
      this.closeLong(close);
    }
  }

  goLong(close) {
    if (this.currentPosition === Positions.LONG) {
      console.log("NO ACTION: already long");
      return;
    }

    this.currentPosition = Positions.LONG;

    const { amount, comm } = this.portfolio.long(close);
    console.log(
      `BUY: ${ASSET} @ ${round0(close)} w/ amount ${round0(amount)} ${CURRENCY} and commission ${comm} ${CURRENCY}`
    );
  }

  closeLong(close) {
    if (this.currentPosition === Positions.CLOSED) {
      console.log("NO ACTION: already closed");
      return;
    }

    this.currentPosition = Positions.CLOSED;

    const { amount, comm } = this.portfolio.close(close);
    console.log(
      `CLOSE: ${PAIR} @ ${round0(close)} w/ amount ${round4(amount)} ${ASSET} and commission ${round4(comm)} ${ASSET}`
    );
  }
}

module.exports = {
  Strategy
};
