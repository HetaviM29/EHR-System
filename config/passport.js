const LocalStrategy = require("passport-local").Strategy
const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const Doctor = require('../models/docModel')

module.exports = (passport) => {
    // User Local Strategy
    passport.use('user-local', new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                // Find user by email 
                const user = await User.findOne({ email });
                if (!user) return done(null, false, { message: "No User found" });

                // Match password
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) return done(null, false, { message: "Incorrect Password" });

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    // Doctor Local Strategy
    passport.use('doctor-local', new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                // Find doctor by email 
                const doctor = await Doctor.findOne({ email });
                if (!doctor) return done(null, false, { message: "No Doctor found" });

                // Match password
                const isMatch = await bcrypt.compare(password, doctor.password);
                if (!isMatch) return done(null, false, { message: "Incorrect Password" });

                return done(null, doctor);
            } catch (error) {
                return done(error);
            }
        }
    ));

    // Serialization for both user and doctor
    passport.serializeUser((entity, done) => {
        // Determine if it's a user or doctor and save accordingly
        const isDoctor = entity.licenseNumber !== undefined;
        done(null, { 
            id: entity.id, 
            type: isDoctor ? 'doctor' : 'user' 
        });
    });
    
    // Deserialization for both user and doctor
    passport.deserializeUser(async (sessionData, done) => {
        try {
            let entity;
            if (sessionData.type === 'user') {
                entity = await User.findById(sessionData.id);
            } else if (sessionData.type === 'doctor') {
                entity = await Doctor.findById(sessionData.id);
            }

            done(null, entity);
        } catch (error) {
            done(error);
        }
    });
}