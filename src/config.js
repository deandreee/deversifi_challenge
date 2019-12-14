const ASSET = "BTC";
const CURRENCY = "USD";

module.exports = {
  API_ROOT: "https://api-pub.bitfinex.com/v2",

  ASSET,
  CURRENCY,
  PAIR: `t${ASSET}${CURRENCY}`,

  STARTING_ASSET: 0,
  STARTING_CURRENCY: 50000,
  COMMISSION_PCT: 0.1,

  POLLING_INTERVAL: 3 * 1000
};
