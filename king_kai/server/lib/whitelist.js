const Server = require('./models/server')

// Server hostid hash map for servers that have passed the handshake auth
let whitelist = {}

module.exports = {
  getWhitelist: () => whitelist,

  buildWhitelist: () => {
    Server.find()
      .lean()
      .then(servers => {
        whitelist = servers.reduce((acc, curr) => {
          acc[curr.hostid] = true
          return acc
        }, {})
      })
  },
}
