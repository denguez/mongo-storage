var Tokens = require('../models/token');
const { Unauthenticated } = require('../scripts/http');
module.exports = {
    Token(req, res, next) {
        let tokenUUID = req.body.token
        if (tokenUUID) {
            Tokens.findOne({ uuid: tokenUUID }, (_, token) => {
                if (token) {
                    req.user = { username: token.user }
                    next()
                } else {
                    Unauthenticated(res)
                }
            })
        } else {
            Unauthenticated(res)
        }
    }
}