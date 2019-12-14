class Portfolio {
  constructor(currency, asset, commission_pct) {
    this.currency = currency;
    this.asset = asset;
    this.commission_pct = commission_pct;
    this.trades = 0;
  }

  getCommission(amount) {
    return (amount * this.commission_pct) / 100;
  }

  long(price) {
    const amount = this.currency;
    const comm = this.getCommission(amount);
    const tradeAmount = amount - comm;

    this.asset = tradeAmount / price;
    this.currency = 0;

    this.trades++;

    return { amount, comm };
  }

  close(price) {
    const amount = this.asset;
    const comm = this.getCommission(amount);
    const tradeAmount = amount - comm;

    this.currency = tradeAmount * price;
    this.asset = 0;

    this.trades++;

    return { amount, comm };
  }
}

module.exports = {
  Portfolio
};
