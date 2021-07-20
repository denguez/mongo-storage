var mongoose = require('mongoose')

var TokenSchema = new mongoose.Schema({
    uuid: { type: String, required: true },
    user: { type: String, required: true },
    timestamp: { type: Date, required: true },
})

TokenSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.user;
    delete obj.__v;
    return obj;
}

module.exports = mongoose.model('Token', TokenSchema)