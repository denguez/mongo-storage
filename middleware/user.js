const { ADMIN } = require('../models/user') 
module.exports = {
    Admin(req, res, next) {
        if (req.user.username == ADMIN) next()
        else res.status(403).send("Unprivileged user")
    },
    LoggedIn(req, res, next) {
        if (req.user) next()
        else res.status(403).send("Unauthenticated user")
    },
    LoggedInAdmin(req, res, next) {
        if (req.user) {
            if (req.user.username == ADMIN) next()
            else res.status(403).send("Unprivileged user")
        } else {
            res.status(403).send("Unauthenticated user")
        }
    }
}