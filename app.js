// Imports
var mongoose = require('mongoose')
var express = require('express')
var cors = require('cors')
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var uuid = require('uuid-random');

// Server
const PORT = 9000
var app = express()

// Database
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

// Middleware
app.use(cors())
app.use(express.json())
app.use(session({
    name: 'session-id',
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Authentication 
var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Admin
User.createAdmin()

// Responses
function OK(response, message, payload) {
    if (payload) {
        response.send({ message: message, payload: payload })
    } else {
        response.send({ message: message })
    }
}

function NotFound(response) {
    response.status(404).send()
}

function BadRequest(response, error) {
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
function handleJson(response, error, json) {
    if (error) BadRequest(response, error)
    else response.json(json)
}

function handleCreated(response, error, created) {
    if (error) BadRequest(response, error)
    else OK(response, "Successfully created", created)
}

function handleUpdated(response, error, updated) {
    if (error) BadRequest(response, error)
    else if (updated) OK(response, "Successfully updated", updated)
    else NotFound(response)
}

function handleDelete(response, error, deleted) {
    if (error) BadRequest(response, error)
    else if (deleted) OK(response, "Successfully deleted", deleted)
    else NotFound(response)

}

// Index 
app.get('/', (_, res) => {
    res.send("CTMRE")
});

// User
app.post('/login', passport.authenticate('local'), (req, res) => {
    User.findOne({
        username: req.user.username
    }, (err, user) => {
        if (err) BadRequest(res, err)
        else OK(res, "Successfully logged in", user.username)
    })
});
app.post('/logout', User.LoggedIn, (req, res) => {
    let username = req.user.username
    req.logout();
    req.session.destroy(err => {
        if (err) {
            BadRequest(res, err)
        } else {
            res.clearCookie('session-id');
            OK(res, 'Successfully logged out', username)
        }
    });
})
app.post('/register', User.LoggedIn, User.Admin, (req, res) => {
    User.register({ username: req.body.username }, req.body.password, (err, user) => {
        if (err) BadRequest(res, err)
        else OK(res, "Succesfully registered", user)
    })
})

// Token
app.get('/tokens', User.LoggedIn, User.Admin, (_, res) => {
    User.find(
        { username: { $ne: User.ADMIN } },
        (err, users) => handleJson(res, err, users.map(u => u.username))
    )
})
app.post('/token', User.LoggedIn, User.Admin, (_, res) => {
    let secret = uuid()
    User.register(
        { username: `token-${uuid()}` }, secret,
        (err, user) => handleCreated(res, err, {
            token: user.username,
            secret: secret,
        })
    )
})
app.delete('/token/delete/:id', User.LoggedIn, User.Admin, (req, res) => {
    let { id } = req.params
    User.deleteOne({ username: id }, (err, result) => {
        if (err) BadRequest(res, err)
        else if (result.deletedCount == 0) NotFound(res)
        else OK(res, "Successfully deleted token", id)
    });
})

// Methods
function ReadAdmin(path, model) {
    app.get(`${path}s/all`, User.LoggedIn, User.Admin, (_, res) => {
        model.find((err, objs) => handleJson(res, err, objs.map(o => o.toObject())))
    })
}

function ReadAll(path, model) {
    app.get(`${path}s`, User.LoggedIn, (req, res) => {
        model.find(
            { user: req.user.username },
            (err, objs) => handleJson(res, err, objs)
        )
    })
}

function ReadId(path, model) {
    app.get(`${path}/:id`, User.LoggedIn, (req, res) => {
        const { id } = req.params;
        model.findOne(
            { _id: id, user: req.user.username },
            (err, obj) => {
                if (obj) handleJson(res, err, obj)
                else NotFound(res)
            }
        )
    })
}

function Create(path, model) {
    app.post(path, User.LoggedIn, (req, res) => {
        let obj = req.body
        obj.timestamp = Date.now()
        obj.user = req.user.username
        model.create(obj, (err, created) => handleCreated(res, err, created))
    })
}

function Update(path, model) {
    app.put(`${path}/:id`, User.LoggedIn, (req, res) => {
        let { id } = req.params
        model.findOneAndUpdate(
            { _id: id, user: req.user.username }, req.body, { new: true },
            (err, updated) => handleUpdated(res, err, updated)
        )
    })
}

function Delete(path, model) {
    app.delete(`${path}/:id`, User.LoggedIn, (req, res) => {
        let { id } = req.params
        model.findOneAndRemove(
            { _id: id, user: req.user.username }, 
            (err, deleted) => handleDelete(res, err, deleted)
        )
    })
}

// Builder
function RoutingBuilder(path, model) {
    ReadAdmin(path, model)
    ReadAll(path, model)
    ReadId(path, model)
    Create(path, model)
    Update(path, model)
    Delete(path, model)
}

RoutingBuilder('/object', require('./models/object'))
RoutingBuilder('/contact', require('./models/contact'))

// Start express
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})