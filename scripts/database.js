const http = require('./http')

module.exports = {
    create(model, response, object, callback) {
        model.create(object, (error, created) => {
            if (error) http.BadRequest(response, error)
            else {
                if (callback) callback(created)
                http.OK(response, "Successfully created", created)
            }
        })
    },
    readOne(model, response, query) {
        model.findOne(query, (error, object) => {
            if (error) http.BadRequest(response, error)
            else if (object) response.json(object)
            else http.NotFound(response)
        })
    },
    readAll(model, response, query) {
        model.find(query, (error, objects) => {
            if (error) http.BadRequest(response, error)
            else response.json(objects)
        })
    },
    readAllAsObject(model, response) {
        model.find((error, objects) => {
            if (error) http.BadRequest(response, error)
            else response.json(objects.map(o => o.toObject()))
        })
    },
    update(model, response, query, updated) {
        model.findOneAndUpdate(query, updated, { new: true },
            (error, updated) => {
                if (error) http.BadRequest(response, error)
                else if (updated) http.OK(response, "Successfully updated", updated)
                else http.NotFound(response)
            }
        )
    },
    deleteOne(model, response, query, payload) {
        model.deleteOne(query, (error, result) => {
            if (error) http.BadRequest(response, error)
            else if (result.deletedCount == 0) http.NotFound(response)
            else http.OK(response, "Successfully deleted", payload)
        });
    },
    deleteMany(model, response, query, payload) {
        model.deleteMany(query, (error, result) => {
            if (error) http.BadRequest(response, error)
            else if (result.deletedCount == 0) http.NotFound(response)
            else http.OK(response, "Successfully deleted", payload)
        });
    },
}