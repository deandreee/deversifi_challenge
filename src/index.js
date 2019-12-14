const { Portfolio } = require("./Portfolio");
const SMA = require("./indicators/SMA");
const { fetchJSON, round0, round4 } = require("./utils");

const API_ROOT = "https://api-pub.bitfinex.com/v2";

const ASSET = "BTC";
const CURRENCY = "USD";

const PAIR = `t${ASSET}${CURRENCY}`;
const INTERVAL = 3 * 1000;

const STARTING_ASSET = 0;
const STARTING_CURRENCY = 50000;
const COMMISSION_PCT = 0.1;

const portfolio = new Portfolio(STARTING_CURRENCY, STARTING_ASSET, COMMISSION_PCT);

// long | closed
const Positions = {
  CLOSED: "CLOSED",
  LONG: "LONG"
};
let currentPosition = Positions.CLOSED;

// https://docs.bitfinex.com/reference#rest-public-ticker
const getCurrentClose = async () => {
  const { status, json } = await fetchJSON(`${API_ROOT}/ticker/${PAIR}`);

  if (status !== 200 && json[0] === "error") {
    const code = json[1];
    const msg = json[2];
    throw new Error(`Error requesting candle close - ${code}: ${msg}`);
  }

  const close = json[6];
  return close;
};

const goLong = close => {
  if (currentPosition === Positions.LONG) {
    console.log("already long");
    return;
  }

  currentPosition = Positions.LONG;

  const { amount, comm } = portfolio.long(close);
  console.log(
    `BUY: ${ASSET} @ ${round0(close)} w/ amount ${round0(amount)} ${CURRENCY} and commission ${comm} ${CURRENCY}`
  );

  portfolio.logPnL(close);
};

const closeLong = close => {
  if (currentPosition === Positions.CLOSED) {
    console.log("already closed");
    return;
  }

  currentPosition = Positions.CLOSED;

  const { amount, comm } = portfolio.close(close);
  console.log(
    `CLOSE: ${PAIR} @ ${round0(close)} w/ amount ${round4(amount)} ${ASSET} and commission ${round4(comm)} ${ASSET}`
  );

  portfolio.logPnL(close);
};

const smaFast = new SMA(1);
const smaSlow = new SMA(2);

const updateIndicators = close => {
  smaFast.update(close);
  smaSlow.update(close);
};

const areIndicatorsReady = () => {
  // no need to check smaFast, because it will be ready faster
  return smaSlow.isReady();
};

// long only strategy
const checkAction = close => {
  console.log(`checkAction: ${smaFast.result - smaSlow.result}`);
  if (smaFast.result > smaSlow.result) {
    goLong(close);
  } else {
    closeLong(close);
  }
};

const test = async () => {
  goLong(7200.12);
  closeLong(7300.44);
};

const run = async () => {
  setInterval(async () => {
    const close = await getCurrentClose();
    updateIndicators(close);

    if (!areIndicatorsReady()) {
      console.log("smaSlow not ready yet");
      return;
    }

    // console.log(`close: ${close}`);
    // console.log(`smaFast: ${smaFast.result}`);
    // console.log(`smaSlow: ${smaSlow.result}`);

    checkAction(close);
  }, INTERVAL);
};

// const runWrapped = async () => {
//   try {
//     await run();
//     process.exit();
//   } catch (err) {
//     console.log(err);
//     process.exit(1);
//   }
// };

// run();
test();
