const { fetchJSON } = require("../utils");

class Exchange {
  constructor(apiRoot, pair) {
    this.apiRoot = apiRoot;
    this.pair = pair;
  }

  // https://docs.bitfinex.com/reference#rest-public-ticker
  async getCurrentClose() {
    const { status, json } = await fetchJSON(`${this.apiRoot}/ticker/${this.pair}`);

    if (status !== 200 && json[0] === "error") {
      const code = json[1];
      const msg = json[2];
      throw new Error(`Error requesting candle close - ${code}: ${msg}`);
    }

    const close = json[6];
    return close;
  }
}

module.exports = {
  Exchange
};
