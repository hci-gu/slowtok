const jwt = require('jsonwebtoken')
const cert = require('./google-certs.json')

const verifyToken = (token) => {
  return jwt.verify(token, cert['5962e7a059c7f5c0c0d56cbad51fe64ceeca67c6'])
}

module.exports = {
  verifyToken,
}
