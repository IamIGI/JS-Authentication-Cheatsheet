//USE express-session, passport, passport-local-mongoose library
//Cookies session

//------------------IMPORT--------------
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');
//packages for authentication
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

//------------------SERVER CONFIG--------------
LAN_PORT = 5000;

const app = express();
app.set('view engine', 'ejs');
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(express.static('public'));

app.use(
    session({
        //Use the session package, init config
        secret: process.env.SECRET_EXPRESS_SESSION,
        resave: false,
        saveUninitialized: false,
    })
);

//Initialize passport, Use passport session
app.use(passport.initialize());
app.use(passport.session());

let port = process.env.PORT; //use the port form heroku website
if (port == null || port == '') {
    port = LAN_PORT;
}

//------------------DATABASE CONFIG-------------
mongoose.connect(
    process.env.MONGODB_CONNECT,
    { useNewUrlParser: true } //mute extra  mongodb errors
);
// mongoose.set('useCreateIndex', true);        //fix for deprecreation

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

userSchema.plugin(passportLocalMongoose); //Use this to salt and hash password, and save users to mongoDB

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//-----------------Target websites-------------
//----------GET---------
app.get('/', function (req, res) {
    console.log('Connect to website: ' + 'Home');
    res.render('home');
});

app.get('/login', function (req, res) {
    console.log('Connect to website: ' + 'Login');
    res.render('login');
});

app.get('/register', function (req, res) {
    console.log('Connect to website: ' + 'Register');
    res.render('register');
});

app.get('/secrets', function (req, res) {
    console.log('Connect to website: ' + 'Secret');
    if (req.isAuthenticated()) {
        res.render('secrets');
    } else {
        res.redirect('/login');
    }
});

app.get('/logout', function (req, res) {
    console.log('Processing: ' + 'Logout');
    //method from passport package
    req.logout();
    res.redirect('/');
});

//----------POST---------
app.post('/register', function (req, res) {
    //method from passport-local-mongoose package
    User.register(
        { username: req.body.username },
        req.body.password,
        function (err, user) {
            if (err) {
                console.log(err);
                res.redirect('/register');
            } else {
                passport.authenticate('local')(req, res, function () {
                    res.redirect('/secrets');
                });
            }
        }
    );
});

app.post('/login', function (req, res) {
    const user = new User({
        //created from a mongoose model
        username: req.body.username,
        password: req.body.password,
    });

    //method from passport package
    req.login(user, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate('local')(req, res, function () {
                res.redirect('/secrets');
            });
        }
    });
});

//---------LOG SERVER-----------
app.listen(port, function () {
    console.log('Sever has started successfully on port: ' + port);
});
