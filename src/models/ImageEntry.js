const mongoose = require('mongoose');

const {Schema} = mongoose;

// Made a variable for the strings that is required
const requiredString = {
    type: String,
    required: true,
};

const imageEntrySchema = new Schema({
    prosjekt: requiredString,
    parsell: String,
    profilnr: Number,
    objektnr: Number,
    kategori: String,
    kommentar: String,
    // Latitude is a number between -90 and 90 degrees
    latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90,
    },
    // Longitude is a number between -180 and 180 degrees
    longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180,
    },
    GPSAltitude: Number,
    GPSImgDirection: Number,
    imageName: requiredString,
    imageType: requiredString,
    captureDate: {
        type: String,
        required: true,
    },
}, {
    // Date of upload
    timestamps: true, 
}
);

const ImageEntry = mongoose.model('ImageEntry', imageEntrySchema);

module.exports = ImageEntry;