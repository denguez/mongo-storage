var User = require('../models/user');
var passport = require('passport');
const { LoggedIn, LoggedInAdmin } = require('../middleware/user');
const { OK, BadRequest } = require('../scripts/http')

module.exports = function (app) {
    app.post('/register', (req, res) => {
        let user = req.body
        User.register({ username: user.username, email: user.email }, user.password,
            (err, newUser) => {
                if (err) BadRequest(res, err)
                else OK(res, "Succesfully registered", newUser.username)
            })
    })
    app.post('/login', passport.authenticate('local'), (req, res) => {
        User.findOne({ username: req.user.username }, (err, user) => {
            if (err) BadRequest(res, err)
            else OK(res, "Successfully logged in", user.username)
        })
    });
    app.post('/logout', LoggedIn, (req, res) => {
        let username = req.user.username
        req.logout();
        req.session.destroy(err => {
            if (err) {
                BadRequest(res, err)
            } else {
                res.clearCookie('session-id');
                OK(res, 'Successfully logged out', username)
            }
        });
    })
    app.get('/users', LoggedInAdmin, (_, res) => {
        User.find((err, users) => {
            if (err) BadRequest(res, err)
            else res.json(users)
        })
    })
}