var mongoose = require('mongoose')

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var ContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user: { type: String, required: true },
    timestamp: { type: Date, required: true, default: Date.now() },
    email: {
        type: String, required: true,
        validate: {
            message: "Provide a valid email",
            validator(email) {
                return EMAIL_REGEX.test(email.toLowerCase());
            }
        }
    },
    message: { type: String, required: false },
})

ContactSchema.methods.toJSON = function () {
    var contact = this.toObject();
    delete contact.user;
    delete contact.__v;
    return contact;
}

module.exports = mongoose.model('Contact', ContactSchema)