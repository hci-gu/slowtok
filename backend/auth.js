const jwt = require('jsonwebtoken')
const cert = require('./google-certs.json')
const fetch = require('node-fetch')

const getCert = async () => {
  const res = await fetch('https://www.googleapis.com/oauth2/v1/certs')
  return res.json()
}

const verifyToken = async (token) => {
  const certs = Object.values(await getCert())
  for (var i = 0; i<certs.length; i++) {
    try {
      return jwt.verify(token, certs[i])
    } catch (e) {
      // ignore
    }
  }
  throw new Error('unable to verity token')
}

module.exports = {
  verifyToken,
}
