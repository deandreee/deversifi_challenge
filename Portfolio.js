class Portfolio {
  constructor(currency, asset, commission_pct) {
    this.currency = currency;
    this.asset = asset;
    this.commission_pct = commission_pct;
    this.trades = 0;
  }

  getCommission(amount) {
    return amount * this.commission_pct;
  }

  long(price) {
    const comm = this.getCommission(this.currency);
    const tradeAmount = this.currency - comm;
    this.asset = tradeAmount / price;
    this.trades++;
  }

  close(price) {
    this.trades++;
  }
}

module.exports = {
  Portfolio
};
