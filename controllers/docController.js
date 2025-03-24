const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const File = require('../models/fileModel');
const Doctor = require('../models/docModel');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const registerDoctor = async (req, res) => {
    try {
        const { name, email, specialty, licenseNumber, password } = req.body;

        // Check if doctor already exists
        const existingDoctor = await Doctor.findOne({ 
            $or: [{ email }, { licenseNumber }] 
        });

        if (existingDoctor) {
            return res.render('doctor_signup', { 
                error: 'Doctor with this email or license number already exists' 
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new doctor
        const newDoctor = new Doctor({
            name,
            email,
            specialty,
            licenseNumber,
            password: hashedPassword
        });

        // Save doctor to database
        await newDoctor.save();

        // Redirect to login page with success message
        return res.render('doctor_signup', { 
            success: 'Registration successful. Please log in.' 
        });
    } catch (error) {
        console.error('Registration Error:', error);
        return res.render('doctor_signup', { 
            error: 'Registration failed. Please try again.' 
        });
    }
};


const renderDoctorDashboard = async (req, res) => {
    try {
        // Assume the logged-in doctor's ID is available in the session
        const doctorId = req.user._id;

        // Fetch doctor details
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).send('Doctor not found');
        }
        // Prepare doctor view model
        const doctorViewModel = {
            name: doctor.name,
            specialty: doctor.specialty,
            initials: doctor.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        };

        // Prepare patient view model (for this example, using the first patient)
        

        res.render('doctordb', { 
            doctor: doctorViewModel
        });

    } catch (error) {
        console.error('Dashboard Rendering Error:', error);
        res.status(500).send('Error loading dashboard');
    }
};

const searchPatient = async (req, res) => {
    try {
        const { patientId } = req.body;

        // Find patient by patientId
        const patient = await User.findOne({ patientId });

        if (!patient) {
            return res.status(404).json({ 
                error: 'Patient not found' 
            });
        }

        // You can add more patient details here as needed
        const patientDetails = {
            name: patient.name,
            email: patient.email,
            patientId: patient.patientId,
            // Add any other relevant patient information
        };

        res.json(patientDetails);

    } catch (error) {
        console.error('Patient Search Error:', error);
        res.status(500).json({ 
            error: 'Error searching for patient' 
        });
    }
};

// Configure file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
      
      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb('Error: Only document and image files are allowed!');
      }
    }
  }).single('doctorFile');
  
  const handleFileUpload = async (req, res) => {
    try {
      const { patientId } = req.params;
      const { fileType, notes } = req.body;
      
      // Verify patient exists
      const patient = await User.findOne({ patientId });
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      const newFile = new File({
        filename: req.file.originalname,
        path: req.file.path,
        fileType,
        uploadedBy: req.user._id,
        patientId,
        doctorNotes: notes
      });
      
      await newFile.save();
      res.json({ message: 'File uploaded successfully', file: newFile });
      
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ error: 'Error uploading file' });
    }
  };
module.exports = {
    registerDoctor,
    renderDoctorDashboard,
    searchPatient,
    handleFileUpload,
    uploadMiddleware: upload
};  