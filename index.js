const { fetchJSON } = require("./fetchJSON");
const SMA = require("./SMA");

const API_ROOT = "https://api-pub.bitfinex.com/v2";
const PAIR = "tBTCUSD";
const INTERVAL = 3 * 1000;

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

const goLong = () => {};

const closeLong = () => {};

const run = async () => {
  const smaFast = new SMA(1);
  const smaSlow = new SMA(2);

  setInterval(async () => {
    const close = await getCurrentClose();

    smaFast.update(close);
    smaSlow.update(close);
    console.log(close);
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

run();
