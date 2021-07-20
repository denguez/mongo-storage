const { LoggedInAdmin } = require('../middleware/user');
const { Token } = require('../middleware/token');
const db = require('../scripts/database');

module.exports = function (app, config) {
    // Admin read all
    app.get(`/admin/${config.path}s`, LoggedInAdmin, (_, res) => {
        db.readAllAsObject(config.model, res)
    })
    // Read all
    app.get(`${config.path}s`, Token, (req, res) => {
        db.readAll(config.model, res, { user: req.user.username })
    })
    // Read by id 
    app.get(`${config.path}/:id`, Token, (req, res) => {
        const { id } = req.params;
        db.readOne(config.model, res, { _id: id, user: req.user.username })
    })
    // Create
    app.post(config.path, Token, (req, res) => {
        let obj = req.body
        obj.timestamp = Date.now()
        obj.user = req.user.username
        db.create(config.model, res, obj, config.onCreated)
    })
    // Update
    app.put(`${config.path}/:id`, Token, (req, res) => {
        let { id } = req.params
        db.update(config.model, res, { _id: id, user: req.user.username }, req.body)
    })
    // Delete
    app.delete(`${config.path}/:id`, Token, (req, res) => {
        let { id } = req.params
        db.deleteOne(config.model, res, { _id: id, user: req.user.username }, id)
    })
}