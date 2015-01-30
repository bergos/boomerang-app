var BigNumber = require('./bignumber');


var digits = 20;

BigNumber.config({DECIMAL_PLACES: digits});


var arcTanCycle = function (x, i) {
  var
    aMinus,
    aPlus;

  i = new BigNumber(i);

  aMinus = x.toPower(i).dividedBy(i);

  i = i.plus(new BigNumber(2));

  aPlus = x.toPower(i).dividedBy(i);

  return aPlus.minus(aMinus);
};


var arcTan = function (x, n) {
  var
    a = new BigNumber(x),
    i = 3;

  for(var j=0; j<n; j++) {
    a = a.plus(arcTanCycle(x, i));

    i += 4;
  }

  return a;
};


var
  n_1_5 = new BigNumber(1).dividedBy(new BigNumber(5)),
  n_1_239 = new BigNumber(1).dividedBy(new BigNumber(239)),
  a_1_5,
  a_1_239,
  four = new BigNumber(4),
  pi;

a_1_5 = arcTan(n_1_5, Math.ceil(digits/2.78));
a_1_239 = arcTan(n_1_239, Math.ceil(digits/9.09));

pi = four.times(((four.times(a_1_5)).minus(a_1_239)));

console.log(pi.toString());