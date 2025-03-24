const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const multer = require('multer');
const File = require('../models/fileModel');
const upload = require('../config/uploadConfig'); 
const user_route = express();
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));
user_route.set('view engine','ejs');
user_route.set('views','./views');

const userController = require('../controllers/userController');
const fileController = require('../controllers/fileController');
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


// Get patient files (for doctor)
user_route.get('/patient/files/:patientId', 
    passport.authenticate('user-local', { session: false }), 
    fileController.getPatientFiles
);

// Doctor upload for patient
user_route.post('/doctor/upload/:patientId', 
    passport.authenticate('user-local', { session: false }), 
    fileController.uploadFileForPatient
);
user_route.post('/upload', 
    userController.isAuthenticated,
    upload.single('myfile'), // Using multer middleware
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).send('No file uploaded');
            }

            const newFile = new File({
                filename: req.file.originalname,
                path: req.file.path,
                fileType: req.body.fileType,
                uploadedBy: req.user._id,
                patientId: req.user.patientId
            });

            await newFile.save();
            res.redirect('/patientdb');
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).send('Error uploading file');
        }
    }
);

module.exports = user_route;