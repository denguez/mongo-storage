const { ADMIN } = require('../models/user') 
const { Unauthenticated } = require('../scripts/http');
module.exports = {
    Admin(req, res, next) {
        if (req.user.username == ADMIN) next()
        else res.status(403).send("Unprivileged user")
    },
    LoggedIn(req, res, next) {
        if (req.user) next()
        else Unauthenticated(res)
    },
    LoggedInAdmin(req, res, next) {
        if (req.user) {
            if (req.user.username == ADMIN) next()
            else res.status(403).send("Unprivileged user")
        } else {
            Unauthenticated(res)
        }
    }
}