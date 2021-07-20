var Tokens = require('../models/token');
var User = require('../models/user');
const { Unauthenticated } = require('../scripts/http');
module.exports = {
    Token(req, res, next) {
        let tokenUUID = req.body.token
        if (tokenUUID) {
            Tokens.findOne({ uuid: tokenUUID }, (_, token) => {
                if (token) {
                    User.findOne({ username: token.user }, (_, user) => {
                        if (user) {
                            req.user = {
                                username: user.username,
                                email: user.email
                            }
                            next()
                        } else {
                            Unauthenticated(res)
                        }
                    })
                } else {
                    Unauthenticated(res)
                }
            })
        } else {
            Unauthenticated(res)
        }
    }
}