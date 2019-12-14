const round0 = value => {
  return Math.round(value);
};

const round2 = value => {
  return Math.round(value * 100) / 100;
};

const round4 = value => {
  return Math.round(value * 10000) / 10000;
};

module.exports = {
  round0,
  round2,
  round4
};
