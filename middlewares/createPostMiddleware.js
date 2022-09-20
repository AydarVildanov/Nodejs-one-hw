const jwt = require('jsonwebtoken')
const {secret} = require('../config')

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(403).json({message: 'User is not logged'})
        }
        const decodedData = jwt.verify(token, secret)
        const age = Number(decodedData.age)
        if (age < 18) {
            return res.status(400).json({message: 'You are under 18 years old'})
        }
        req.user = decodedData
        next()
    } catch (e) {
        console.log(e)
        return res.status(403).json({message: 'User is not logged'})
    }
}