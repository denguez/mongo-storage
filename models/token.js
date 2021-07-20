var mongoose = require('mongoose')

var TokenSchema = new mongoose.Schema({
    name: { type: String, required: true },
    uuid: { type: String, unique: true, required: true },
    user: { type: String, required: true },
    timestamp: { type: Date, required: true, default: Date.now() },
})

TokenSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.user;
    delete obj._id;
    delete obj.__v;
    return obj;
}

module.exports = mongoose.model('Token', TokenSchema)