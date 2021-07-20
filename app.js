// Imports
var mongoose = require('mongoose')
var express = require('express')
var cors = require('cors')
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;

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

// Index 
app.get('/', (_, res) => res.send("CTMRE"));

// Routes
require('./routes/user')(app)
require('./routes/token')(app)

var endpoints = require('./routes/endpoints')
endpoints.build(app, '/object', require('./models/object'))
endpoints.build(app, '/contact', require('./models/contact'))

// Start express
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})