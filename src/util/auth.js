const jwt = require('jsonwebtoken')

const createJWtToken = (user) => {
    return jwt.sign({ user }, process.env.SECRET_KEY, {
        expiresIn: "1h"
    })
}

module.exports = { createJWtToken }