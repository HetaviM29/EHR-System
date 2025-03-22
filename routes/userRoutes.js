const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const user_route = express();
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));
user_route.set('view engine','ejs');
user_route.set('views','./views');

const userController = require('../controllers/userController');

user_route.get("/",userController.loadLogin);
user_route.post('/register',userController.addUser);
user_route.post('/login',passport.authenticate("local",{
    successRedirect: "/patientdb",
    failureRedirect:"/",
    failureFlash: true
}));
user_route.get('/patientdb',userController.isAuthenticated,userController.loadProfile);
user_route.get('/logout',userController.logout);

module.exports = user_route;