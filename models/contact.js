var mongoose = require('mongoose')

var ContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user: { type: String, required: true },
    timestamp: { type: Date, required: true },
    email: { type: String, required: true },
    message: { type: String, required: false },
})

ContactSchema.methods.toJSON = function () {
    var contact = this.toObject();
    delete contact.user;
    delete contact.__v;
    return contact;
}

module.exports = mongoose.model('Contact', ContactSchema)