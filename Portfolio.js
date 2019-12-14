class Portfolio {
  constructor(currency, asset, commission_pct) {
    this.initial = {
      currency,
      asset
    };
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

  getStats(price) {
    const value = this.currency + this.asset * price;
    const currency = this.currency;
    const asset = this.asset;

    const pnl = value - this.initial.currency;

    return { currency, asset, value, pnl };
  }

  logPnL(price) {
    const { value, pnl } = this.getStats(price);
    console.log(`===== PnL =====`);
    console.log(`    Current Value: `.padEnd(40), value);
    console.log(`    Difference (vs starting): `.padEnd(40), pnl);
  }
}

module.exports = {
  Portfolio
};
