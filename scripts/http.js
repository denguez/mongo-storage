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
}

module.exports = new Http()