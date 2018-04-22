const express = require('express');
const router = express.Router();
const Snapshot = require('../models/snapshot');
const bodyParser = require('body-parser').json();
const ensureAuth = require('../middleware/ensure-auth')();

router
  .get('/', (req, res, next) => {
    let query = {};
    Snapshot.find(query)
      .lean()
      .then(snapshots => res.send(snapshots))
      .catch(next);
  })
  .post('/', bodyParser, ensureAuth, (req, res, next) => {
    new Snapshot(req.body).save()
      .then(newSnap => res.send(newSnap))
      .catch(next);
  });

module.exports = router;