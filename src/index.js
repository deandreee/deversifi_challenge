const { Exchange, Portfolio, Strategy } = require("./trading");
const { API_ROOT, PAIR, STARTING_CURRENCY, STARTING_ASSET, COMMISSION_PCT, POLLING_INTERVAL } = require("./config");

const portfolio = new Portfolio(STARTING_CURRENCY, STARTING_ASSET, COMMISSION_PCT);
const strategy = new Strategy(portfolio);
const exchange = new Exchange(API_ROOT, PAIR);

const run = async () => {
  setInterval(async () => {
    const close = await exchange.getCurrentClose();
    strategy.updateIndicators(close);

    if (!strategy.areIndicatorsReady()) {
      console.log("smaSlow not ready yet");
      return;
    }

    strategy.checkAction(close);
    portfolio.logPnL(close);
  }, POLLING_INTERVAL);
};

run();
