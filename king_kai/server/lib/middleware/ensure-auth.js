const whitelist = require('../whitelist');

// TODO potential performance problems here.
// still vastly improved from a database fetch with each request ¯\_(ツ)_/¯
module.exports = function getEnsureAuth() {
  // Construct whitelisted server hash on singleton
  whitelist.buildWhitelist();

  return function ensureAuth(req, res, next) {
    const incomingID = req.body.HOST_ID;

    if (!incomingID) return next({ code: 403, error: 'Unauthorized. No token provided.'});

    // Server doesn't match any ids on our hash? GTFO with that gambage
    if (!whitelist.getWhitelist()[incomingID]) return next({ code: 403, error: 'Unauthorized, bad token.'});

    // Auth succeeds: proceed.
    next();
  };
};