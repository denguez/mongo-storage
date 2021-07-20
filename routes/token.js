var Tokens = require('../models/token');
var uuid = require('uuid-random');
const db = require('../scripts/database')
const { LoggedIn, LoggedInAdmin } = require('../middleware/user');

module.exports = function (app) {
    // Read all user's tokens
    app.get('/admin/tokens', LoggedInAdmin, (_, res) => db.readAllAsObject(Tokens, res))
    // Create token by username
    app.post('/admin/token/user/:user', LoggedInAdmin, (req, res) => {
        const { user } = req.params
        db.create(Tokens, res, {
            user: user,
            uuid: uuid(),
            name: "test",
            timestamp: Date.now(),
        })
    })
    // Read tokens by username
    app.get('/admin/tokens/user/:user', LoggedInAdmin, (req, res) => {
        const { user } = req.params
        db.readAll(Tokens, res, { user: user })
    })
    // Delete token by username
    app.delete('/admin/token/user/:user', LoggedInAdmin, (req, res) => {
        const { user } = req.params
        db.deleteMany(Tokens, res, { user: user }, user)
    })
    // Delete token by uuid
    app.delete('/admin/token/:uuid', LoggedInAdmin, (req, res) => {
        const { uuid } = req.params
        db.deleteOne(Tokens, res, { uuid: uuid }, uuid)
    })

    // Read current user's token
    app.get('/tokens', LoggedIn, (req, res) => {
        db.readAll(Tokens, res, { user: req.user.username })
    })
    // Create token with current user and name
    app.post('/token/:name', LoggedIn, (req, res) => {
        const { name } = req.params
        db.create(Tokens, res, {
            name: name,
            uuid: uuid(),
            timestamp: Date.now(),
            user: req.user.username,
        })
    })
    // Delete current user's token by uuid
    app.delete('/token/:uuid', LoggedIn, (req, res) => {
        const { uuid } = req.params
        db.deleteOne(Tokens, res, { uuid: uuid, user: req.user.username }, uuid)
    })
}