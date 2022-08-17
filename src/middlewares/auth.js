const jwt = require("jsonwebtoken")

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY)
        req.verifiedUser = verified.user
    } catch (error) {
        
    }

    next()
}

module.exports = { authenticate }