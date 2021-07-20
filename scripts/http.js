class Http {
    OK(response, message, payload) {
        if (payload) response.send({ message: message, payload: payload })
        else response.send({ message: message })
    }
    NotFound(response) {
        response.status(404).send()
    }
    Unauthenticated(response) {
        response.status(403).send("Unauthenticated")
    }
    BadRequest(response, error) {
        console.log(error)
        let payload = error;
        let errors = error.errors
        if (errors) {
            payload = {
                errors: Object.keys(errors).map(k => errors[k])
            }
        }
        response.status(400).send(payload)
    }
    // Handlers
    handleJson(response, error, json) {
        if (error) this.BadRequest(response, error)
        else response.json(json)
    }
    handleRead(response, error, obj) {
        if (error) this.BadRequest(response, error)
        else if (obj) response.json(obj)
        else this.NotFound(response)
    }
    handleCreated(response, error, created) {
        if (error) this.BadRequest(response, error)
        else this.OK(response, "Successfully created", created)
    }
    handleUpdated(response, error, updated) {
        if (error) this.BadRequest(response, error)
        else if (updated) this.OK(response, "Successfully updated", updated)
        else this.NotFound(response)
    }
    handleDeletedId(response, error, deleted) {
        if (error) this.BadRequest(response, error)
        else if (deleted) this.OK(response, "Successfully deleted", deleted)
        else this.NotFound(response)
    }
    handleDeleted(response, error, result, payload) {
        if (error) this.BadRequest(response, error)
        else if (result.deletedCount == 0) this.NotFound(response)
        else this.OK(response, "Successfully deleted", payload)
    }
}

module.exports = new Http()