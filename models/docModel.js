const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    specialty:{
        type:String,
        required:true
    },
    licenseNumber:{
        type: String,
        required: true
    },
    verified:{
        type: Boolean,
        default:false
    },
    patients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EHR'
    }],
    createdAt: [{
        type: Date,
        default: Date.now
    }]
});

module.exports = mongoose.model('Doctor',doctorSchema);