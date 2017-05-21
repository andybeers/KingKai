const Server = require('../models/server');

//TODO if performance sucks, this is stop #1 -- store separate whitelist in db
module.exports = function getWhitelist() {
  return function whitelist(req, res, next) {
    const incomingID = req.body.HOST_ID;
    if (!incomingID) return next({ code: 403, error: 'Unauthorized. No token provided.'});

    Server.find({ hostid: incomingID })
      .then(servers => {
        if (servers.length === 0) return next({ code: 403, error: 'Unauthorized, bad token.'});
        next();
      })
      .catch(err => next(err));
  };
};