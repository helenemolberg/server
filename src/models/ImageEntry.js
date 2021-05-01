const mongoose = require('mongoose');

const {Schema} = mongoose;

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
    latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90,
    },
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
    // For uploaded and updated dates
    timestamps: true, 
}
);

const ImageEntry = mongoose.model('ImageEntry', imageEntrySchema);

module.exports = ImageEntry;