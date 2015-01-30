var BigNumber = require('bignumber');


module.exports = function (parameters) {
  parameters = JSON.parse(parameters);

  return new Promise(function (resolve) {
    var
      aMinus,
      aPlus,
      i,
      x;

    BigNumber.config({DECIMAL_PLACES: parameters.digits});

    i = new BigNumber(parameters.i);
    x = new BigNumber(parameters.x);

    aMinus = x.toPower(i).dividedBy(i);

    i = i.plus(new BigNumber(2));

    aPlus = x.toPower(i).dividedBy(i);

    resolve(aPlus.minus(aMinus).toString());
  });
};