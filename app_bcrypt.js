//USE BCRYPT library

//------------------IMPORT--------------
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds=10;


//-----------------IMPORT JS FILES-----------
const secrets = require('./secrets');
const { StringDecoder } = require('string_decoder');
const { MongoServerClosedError } = require('mongodb');


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
mongoose.connect(process.env.MONGODB_CONNECT, 
    {useNewUrlParser: true}   //mute extra  mongodb errors
);

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});



const User = new mongoose.model("User", userSchema);













//-----------------Target websites-------------
//----------HOME---------
app.get("/", function (req, res) {
    console.log("Connect to website: " + "Home");
    res.render("home");
});

//----------LOGIN---------
app.get("/login", function (req, res) {
    console.log("Connect to website: " + "Login");
    res.render("login");
});

//----------REGISTER---------
app.get("/register", function (req, res) {
    console.log("Connect to website: " + "Register");
    res.render("register");
});




app.post("/register", function(req, res){
    
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email:  req.body.username,
            password: hash
        });
        newUser.save(function (err) {
            if (err){
                console.log(err);
            }else{
                res.render("secrets");
            }
        })
    });

   
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({
        email:username
    }, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            if (foundUser){
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if (result == true) {
                        res.render("secrets");
                    }
                });
                
                
            }
        }
    })
})


//---------LOG SERVER-----------
app.listen(port, function(){
    console.log('Sever has started successfully on port: ' + port);
})