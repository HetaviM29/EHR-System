const File = require('../models/fileModel');
const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Configure storage
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

const upload = multer({ storage: storage });

const handleFileUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const newFile = new File({
            filename: req.file.originalname,
            path: req.file.path,
            fileType: req.body.fileType || 'other',
            uploadedBy: req.user._id,
            patientId: req.user.patientId
        });

        await newFile.save();
        res.redirect('/patientdb');

    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Error uploading file' });
    }
};

const getPatientFiles = async (req, res) => {
    try {
        const { patientId } = req.params;
        
        // Verify patient exists
        const patient = await User.findOne({ patientId });
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Get files for this patient
        const files = await File.find({ patientId }).sort({ uploadedAt: -1 });
        
        res.json(files);
    } catch (error) {
        console.error('File Fetch Error:', error);
        res.status(500).json({ error: 'Error fetching files' });
    }
};

const uploadFileForPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { notes } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Verify patient exists
        const patient = await User.findOne({ patientId });
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const newFile = new File({
            filename: req.file.originalname,
            path: req.file.path,
            fileType: req.body.fileType || 'other',
            uploadedBy: req.user._id, // doctor's ID
            patientId: patientId,
            doctorNotes: notes
        });

        await newFile.save();
        res.json({ message: 'File uploaded successfully', file: newFile });

    } catch (error) {
        console.error('Doctor Upload Error:', error);
        res.status(500).json({ error: 'Error uploading file for patient' });
    }
};

module.exports = {
    uploadMiddleware: upload.single('myfile'),
    handleFileUpload,
    getPatientFiles,
    uploadFileForPatient: [upload.single('doctorFile'), uploadFileForPatient]
};