const HandshakeSecret = process.env.HandshakeSecret || 'john_wuz_here'

module.exports = function getHandshakeAuth() {
  return function handshakeAuth(req, res, next) {
    const sekrit = req.body.HandshakeSecret
    if (!sekrit)
      return next({ code: 403, error: 'Unauthorized. No token provided.' })
    if (sekrit !== HandshakeSecret)
      return next({ code: 403, error: 'Unauthorized, bad token.' })
    next()
  }
}
