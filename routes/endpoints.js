const { LoggedInAdmin } = require('../middleware/user');
const { Token } = require('../middleware/token');
const db = require('../scripts/database')

module.exports = {
    build(app, path, model) {
        this.adminRead(app, path, model)
        this.readId(app, path, model)
        this.readAll(app, path, model)
        this.create(app, path, model)
        this.update(app, path, model)
        this.delete(app, path, model)
    },
    adminRead(app, path, model) {
        app.get(`/admin/${path}s`, LoggedInAdmin, (_, res) => db.readAllAsObject(model, res))
    },
    readAll(app, path, model) {
        app.get(`${path}s`, Token, (req, res) => {
            db.readAll(model, res, { user: req.user.username })
        })
    },
    readId(app, path, model) {
        app.get(`${path}/:id`, Token, (req, res) => {
            const { id } = req.params;
            db.readOne(model, res, { _id: id, user: req.user.username })
        })
    },
    create(app, path, model) {
        app.post(path, Token, (req, res) => {
            let obj = req.body
            obj.timestamp = Date.now()
            obj.user = req.user.username
            db.create(model, res, obj)
        })
    },
    update(app, path, model) {
        app.put(`${path}/:id`, Token, (req, res) => {
            let { id } = req.params
            db.update(model, res, { _id: id, user: req.user.username }, req.body)
        })
    },
    delete(app, path, model) {
        app.delete(`${path}/:id`, Token, (req, res) => {
            let { id } = req.params
            db.deleteOne(model, res, { _id: id, user: req.user.username }, id)
        })
    }
}