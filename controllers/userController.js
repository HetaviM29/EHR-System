const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const loadLogin = async(req,res)=>{
    res.render('login');
}

const addUser = async(req,res)=>{
    try{
        const existingUser = await User.findOne({email: req.body.email});
        if(exisitingUser){
            return res.send("Email already in use.");
        }

        const user = new User({
            name: req.body.name,
            email:req.body.email,
            password: req.body.password
        });

        await user.save();

        res.redirect('/login');
    }catch(error){
        res.status(500).send("Error registering user");
    }
}

const loadProfile = async(req,res)=>{
    res.render('patientdb1',{user: req.user});
}

const isAuthenticated = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
};

const logout = (req,res)=>{
    req.logout((err)=>{
        if (err) return next(err);
        res.redirect("/");
    });
};

module.exports ={ 
    loadLogin,
    addUser,
    loadProfile,
    logout,
    isAuthenticated
}