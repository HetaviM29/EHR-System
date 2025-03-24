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
user_route.post('/login',(req,res,next)=>{
    passport.authenticate("user-local",(err,user,info)=>{
        if(err){
            console.error("Passport Error: ",err);
            return next(err);
        }
        if(!user){
            console.log("Authentication Failed : ",info);
            return res.render("login",{error: info.message , success: null})
        }

        req.logIn(user,(err)=>{
            if(err){
                console.error("Login Error: ",err);
                return next(err);
            }
            return res.redirect("/patientdb");
        });
    })(req,res,next);
});

user_route.get('/patientdb',userController.isAuthenticated,userController.loadProfile);
user_route.get('/logout',userController.logout);


//file upload routes

module.exports = user_route;