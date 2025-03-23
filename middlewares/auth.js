const passport = require('../config/passport');

const redirectIfAuthenticated = (req,res,next)=>{
    if (req.isAuthenticated()){
        return res.redirect('/patientdb');
    }
    next();
};

const ensureAuthenticated = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
};

module.exports = {
    redirectIfAuthenticated,
    ensureAuthenticated
};

