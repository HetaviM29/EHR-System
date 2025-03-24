const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    patientId: {
        type: String,
        unique: true
    }
});

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Generate patientId only when it's a new user
    if (this.isNew) {
        this.patientId = await generatePatientId(this.name);
    }
    
    next();
});

// Function to generate unique patient ID
async function generatePatientId(name) {
    const firstThreeLetters = name.slice(0, 3).toUpperCase();
    let patientId;
    let isUnique = false;
    
    while (!isUnique) {
        // Generate a 3-digit random number (100-999)
        const randomNum = Math.floor(100 + Math.random() * 900);
        patientId = `${firstThreeLetters}${randomNum}`;
        
        // Check if this ID already exists
        const existingUser = await mongoose.model('EHR').findOne({ patientId });
        if (!existingUser) {
            isUnique = true;
        }
    }
    
    return patientId;
}

module.exports = mongoose.model('EHR', userSchema);