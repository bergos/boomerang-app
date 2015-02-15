var BigNumber = require('./bignumber');


module.exports = function (app) {
  var digits = 100;

  BigNumber.config({DECIMAL_PLACES: digits});

  var arcTanCycle = function (x, i) {
    var
      id = 'arctancycle-' + x.toString().substr(0, 5) + '-' + i + '#task',
      application = 'arctan.js',
      dependencies = [ 'bignumber.js'],
      parameters = JSON.stringify({digits: digits, x: x.toString(), i: i});

    return app.runTask(id, application, dependencies, parameters)
      .then(function (result) {
        return new BigNumber(result);
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

      app.setResult(pi.toString());
    })
};
