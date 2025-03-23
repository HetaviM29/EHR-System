const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const File = require('../models/fileModel');


const loadLogin = async(req,res)=>{
    res.render('login');
}

const addUser = async(req,res)=>{
    try{
        const existingUser = await User.findOne({email: req.body.email});
        if(existingUser){
            return res.send("Email already in use.");
        }

        const user = new User({
            name: req.body.name,
            email:req.body.email,
            password: req.body.password
        });

        await user.save();

        res.redirect('/');
    }catch(error){
        res.status(500).send("Error registering user");
    }
}

const loadProfile = async(req,res)=>{
    try{
        const files = await File.find().sort({uploadedAt: -1});

        res.render('patientdb1',{
                user: req.user,
                files:files
            });
    }catch(error){
        console.error('Error Fetching files: ',error);
        res.status(500).send('Error loading dashboard');
    }
};

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