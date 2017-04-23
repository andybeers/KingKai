const express = require('express');
const router = express.Router();
const Server = require('../models/server');
const bodyParser = require('body-parser').json();

router
  .get('/', (req, res, next) => {
    Server.find()
      .lean()
      .then(servers => res.send(servers))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Server.findById(req.params.id)
      .lean()
      .then(server => res.send(server))
      .catch(next);
  })
  .post('/', bodyParser, (req, res, next) => {
    // TODO: this should be a system wide settings
    if (req.body.HandshakeSecret === "john_wuz_here") {
      new Server(req.body.HostInfo).save()
        .then(newServer => res.send(newServer))
        .catch(next);
    } else {
      res.send(500)
    }

  });

module.exports = router;
