const { Exchange, Portfolio, Strategy } = require("./trading");
const { API_ROOT, PAIR, STARTING_CURRENCY, STARTING_ASSET, COMMISSION_PCT, POLLING_INTERVAL } = require("./config");

const portfolio = new Portfolio(STARTING_CURRENCY, STARTING_ASSET, COMMISSION_PCT);
const strategy = new Strategy(portfolio);
const exchange = new Exchange(API_ROOT, PAIR);

const test = async () => {
  strategy.goLong(7200.12);
  strategy.closeLong(7300.44);
};

const run = async () => {
  setInterval(async () => {
    const close = await exchange.getCurrentClose();
    strategy.updateIndicators(close);

    if (!strategy.areIndicatorsReady()) {
      console.log("smaSlow not ready yet");
      return;
    }

    // console.log(`close: ${close}`);
    // console.log(`smaFast: ${smaFast.result}`);
    // console.log(`smaSlow: ${smaSlow.result}`);

    strategy.checkAction(close);
    portfolio.logPnL(close);
  }, POLLING_INTERVAL);
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
// test();
