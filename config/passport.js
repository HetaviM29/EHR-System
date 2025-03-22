const LocalStrategy = require("passport-local").Strategy
const bcrypt = require('bcrypt')
const User = require('../models/userModel')

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: "email" },async(email , password , done)=>{
            try{
                //find user by email 
                const user = await User.findOne({email});
                if(!user) return done(null,false , {message : "No User found "});

                //match password
                const isMatch = await bcrypt.compare(password , user.password);
                if(!isMatch) return done(null , false , {message : "Incorrect Password"});

                return done(null , user);
            }catch(error){
                return done(error);
            }
        })
    );
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
}
