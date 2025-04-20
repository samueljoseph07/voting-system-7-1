const mongoose = require('mongoose');

const FormDataSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    faceData: {
        descriptor: [Number],
        landmarks: [{
            x: Number,
            y: Number
        }]
    }
});

const FormDataModel = mongoose.model('log_reg_form', FormDataSchema);

module.exports = FormDataModel;
