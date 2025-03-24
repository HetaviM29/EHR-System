const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
var path = require('path');
const passport = require('passport');
const session = require('express-session');
const multer = require('multer');
const File = require('./models/fileModel');

const app = express();

mongoose.connect("mongodb://localhost:27017/EHR-db");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

app.set('views' , path.join(__dirname, 'views'));
app.set("view engine","ejs");  
app.use(express.static('./public'));
app.use('/uploads', express.static('./uploads'));
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
const docRoutes = require('./routes/docRoutes');
app.use('/',userRoutes);
app.use('/',docRoutes);

const storage = multer.diskStorage({
    destination: './uploads',
    filename: function(req,file,cb){
        cb(
            null,
            file.filename + '-' + Date.now() + path.extname(file.originalname)
        );
    },
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 10 * 1024 * 1024}, // 10mb limit 
    fileFilter: function(req, file , cb ){
        checkFileType(file,cb);
    },
}).single('myfile');

function checkFileType(file,cb){
    const filetypes = /jpeg|jpg|png|gif|pdf/;
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    }
    else{
        cb('Error: Images and PDfs only');
    }
}

app.post('/upload',async(req,res)=>{
    upload(req,res,async(err)=>{
        if(err){
            res.send(`Error: ${err}`);
        }
        else{
            if(req.file === undefined){
                res.send('Error : No file Selected');
            }else{
                try{
                    const newFile = new File({
                        filename: req.file.filename,
                        path: `/uploads/${req.file.filename}`
                    });

                    await newFile.save();
                    const files = await File.find().sort({uploadedAt: -1});

                    res.render('patientdb1',{
                        user: req.user,
                        files: files
                    });
                }catch(err){
                    console.error('MongoDB Error : ',error);
                    res.send('Error saving file information to the database.');
                }
            }
        }
    });
});

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



app.listen(port,()=>{
    console.log(`Server started on Port ${port}...`);
});


