// models/recommendationModel.js
const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    doctorName: {
        type: String,
        required: true
    },
    patientId: {
        type: String,
        ref: 'EHR',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Recommendation', recommendationSchema);