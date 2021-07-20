const http = require('./http')

module.exports = {
    create(model, response, object) {
        model.create(object, (error, created) => http.handleCreated(response, error, created))
    },
    readOne(model, response, query) {
        model.findOne(query, (error, object) => {
            if (object) http.handleJson(response, error, object)
            else http.NotFound(response)
        })
    },
    readAll(model, response, query) {
        model.find(query, (error, objects) => http.handleJson(response, error, objects))
    },
    readAllAsObject(model, response) {
        model.find((error, objects) => http.handleJson(response, error, objects.map(o => o.toObject())))
    },
    update(model, response, query, updated) {
        model.findOneAndUpdate(query, updated, { new: true },
            (error, updated) => http.handleUpdated(response, error, updated)
        )
    },
    deleteOne(model, response, query, payload) {
        model.deleteOne(query, (error, result) => {
            http.handleDeleted(response, error, result, payload)
        });
    },
    deleteMany(model, response, query, payload) {
        model.deleteMany(query, (error, result) => {
            http.handleDeleted(response, error, result, payload)
        });
    },
}