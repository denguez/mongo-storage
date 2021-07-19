var mongoose = require('mongoose')

var ObjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user: { type: String, required: true },
    timestamp: { type: Date, required: true },
    data: { type: JSON, required: false },
})

ObjectSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.user;
    delete obj.__v;
    return obj;
}

module.exports = mongoose.model('Object', ObjectSchema)