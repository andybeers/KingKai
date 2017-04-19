const express = require('express');
const router = express.Router();
const Snapshot = require('../models/snapshot');
const bodyParser = require('body-parser').json();

router
  .get('/', (req, res, next) => {
    Snapshot.find()
      .lean()
      .then(snapshots => res.send(snapshots))
      .catch(next);
  })
  .post('/', bodyParser, (req, res, next) => {
    new Snapshot(req.body).save()
      .then(newSnap => res.send(newSnap))
      .catch(next);
  });

module.exports = router;