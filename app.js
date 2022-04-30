//------------------IMPORT--------------
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');

//-----------------IMPORT JS FILES-----------
const secrets = require('./secrets');
const { StringDecoder } = require('string_decoder');


//------------------SERVER CONFIG--------------
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));
LAN_PORT=5000;

//------------------SERVER CONFIG ---------------------
let port = process.env.PORT; //use the port form heroku website
if (port == null || port ==''){
    port = LAN_PORT;
}

//------------------DATABASE CONFIG-------------
mongoose.connect(secrets.mongoDB_connect, 
    {useNewUrlParser: true}   //mute extra  mongodb errors
);

const userSchema = {
    email: String,
    password: String
};

const User = new mongoose.model("User", userSchema);













//-----------------Target websites-------------
//----------HOME---------
app.get("/", function (req, res) {
    console.log("Connect to website: " + "Home");
    res.render("home");
})

//----------LOGIN---------
app.get("/login", function (req, res) {
    console.log("Connect to website: " + "Login");
    res.render("login");
})

//----------REGISTER---------
app.get("/register", function (req, res) {
    console.log("Connect to website: " + "Register");
    res.render("register");
})

//----------HOME---------
app.get("/secret", function (req, res) {
    console.log("Connect to website: " + "Secret");
    res.render("secret");
})




//---------LOG SERVER-----------
app.listen(port, function(){
    console.log('Sever has started successfully on port: ' + port);
})