const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
var path = require('path');
const passport = require('passport');
const session = require('express-session');


const app = express();

mongoose.connect("mongodb://localhost:27017/");

app.set('views' , path.join(__dirname, 'views'));
app.set("view engine","ejs");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));



app.use(
    session({
        secret: "This is our pbl",
        resave: false,
        saveUninitialized:false
    })
);

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

const userRoutes = require('./routes/userRoutes');

app.use('/',userRoutes);

port = 8000;
// app.get('/login',(req,res)=>{
//     res.render('login')
// })

// app.get('/patientdb1',(req,res)=>{
//     res.render('patientdb1')
// })

// app.get('/patient-db',(req,res)=>{
//     res.render('patientdb')
// })

// app.get('/doctordb',(req,res)=>{
//     res.render('doctordb')
// })

// app.get('/doctordb1',(req,res)=>{
//     res.render('drdb')
// })


app.listen(port,()=>{
    console.log(`Server started on Port ${port}...`);
});


