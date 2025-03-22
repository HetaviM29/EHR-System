const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const session = require('express-session');


const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

app.use(
    session({
        secret: "This is our pbl",
        resave: false,
        saveUninitialized:false
    })
);

port = 8000;

app.set("view engine","ejs")
app.use(express.static('./public'))

app.get('/login',(req,res)=>{
    res.render('login')
})

app.get('/patientdb1',(req,res)=>{
    res.render('patientdb1')
})

app.get('/patient-db',(req,res)=>{
    res.render('patientdb')
})

app.get('/doctordb',(req,res)=>{
    res.render('doctordb')
})

app.get('/doctordb1',(req,res)=>{
    res.render('drdb')
})


app.listen(port,()=>{
    console.log(`Server started on Port ${port}...`);
});


