global.Promise = require('../../../node_modules/es6-promises');


var BigNumber = require('./bignumber');


var digits = 20;

BigNumber.config({DECIMAL_PLACES: digits});


var arcTanCycle = function (x, i) {
  return new Promise(function (resolve) {
    var
      aMinus,
      aPlus;

    i = new BigNumber(i);

    aMinus = x.toPower(i).dividedBy(i);

    i = i.plus(new BigNumber(2));

    aPlus = x.toPower(i).dividedBy(i);

    resolve(aPlus.minus(aMinus));
  });
};


var arcTan = function (x, n) {
  var
    a = new BigNumber(x),
    i = 3,
    cycles = [];

  for(var j=0; j<n; j++) {
    cycles.push(arcTanCycle(x, i));

    i += 4;
  }

  return Promise.all(cycles)
    .then(function (results) {
      results.forEach(function (delta) {
        a = a.plus(delta);
      });

      return a;
    });
};


var
  n_1_5 = new BigNumber(1).dividedBy(new BigNumber(5)),
  n_1_239 = new BigNumber(1).dividedBy(new BigNumber(239)),
  four = new BigNumber(4),
  pi;

return Promise.all([arcTan(n_1_5, Math.ceil(digits/2.78)), arcTan(n_1_239, Math.ceil(digits/9.09)) ])
  .then(function (results) {
    var
      a_1_5 = results[0],
      a_1_239 = results[1];

    pi = four.times(((four.times(a_1_5)).minus(a_1_239)));

    console.log(pi.toString());
  });