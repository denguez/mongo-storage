var mongoose = require('mongoose');
var passportLocal = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
    }
});

UserSchema.plugin(passportLocal);

var User = mongoose.model('User', UserSchema)

User.ADMIN = process.env.ADMIN_USER

User.createAdmin = function () {
    User.findOne({ username: User.ADMIN }, (err, user) => {
        if (err) throw err
        else if (!user) {
            User.register({ username: User.ADMIN }, process.env.ADMIN_PASSWORD, (err, _) => {
                if (err) throw err
            })
        }
    })
}

module.exports = User