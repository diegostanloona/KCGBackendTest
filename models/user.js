const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    image: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);


