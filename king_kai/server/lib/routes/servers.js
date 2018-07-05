const express = require('express')
const router = express.Router()
const Server = require('../models/server')
const bodyParser = require('body-parser').json()
const handshakeAuth = require('../middleware/handshake-auth')()
const whitelist = require('../whitelist')

router
  .get('/', (req, res, next) => {
    Server.find()
      .lean()
      .then(servers => res.send(servers))
      .catch(next)
  })
  .get('/:id', (req, res, next) => {
    Server.findById(req.params.id)
      .lean()
      .then(server => res.send(server))
      .catch(next)
  })
  .post('/', bodyParser, handshakeAuth, (req, res, next) => {
    new Server(req.body.HostInfo)
      .save()
      .then(newServer => {
        // Add new server to snapshots whitelist
        whitelist.buildWhitelist()
        res.send(newServer)
      })
      .catch(next)
  })

module.exports = router
