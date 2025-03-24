const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const File = require('../models/fileModel');
const Doctor = require('../models/docModel');

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


module.exports = {
    registerDoctor
};  