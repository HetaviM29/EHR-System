const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');


const doc_route = express();
doc_route.use(bodyParser.json());
doc_route.use(bodyParser.urlencoded({extended:true}));
doc_route.set('view engine','ejs');
doc_route.set('views','./views');

const docController = require('../controllers/docController');

doc_route.get('/doctordb', docController.renderDoctorDashboard);

doc_route.get('/doc-login',(req,res)=>{
   res.render('doctor_signup')
})

doc_route.post('/doctor/register',docController.registerDoctor);
doc_route.post('/doctor/login',(req,res,next)=>{
    passport.authenticate("doctor-local",(err,user,info)=>{
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
            return res.redirect("/doctordb");
        });
    })(req,res,next);
});

doc_route.post('/doctor/search-patient', docController.searchPatient);
doc_route.post('/doctor/upload/:patientId', 
  passport.authenticate('user-local', { session: false }),
  docController.uploadMiddleware,
  docController.handleFileUpload
);

doc_route.get('/patient/files/:patientId', 
  passport.authenticate('user-local', { session: false }),
  async (req, res) => {
    try {
      const files = await File.find({ patientId: req.params.patientId })
                             .sort({ uploadedAt: -1 });
      res.json(files);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching files' });
    }
  }
);

module.exports = doc_route;