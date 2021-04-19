const mongoose = require('mongoose');

const {Schema} = mongoose;

const requiredString = {
    type: String,
    required: true,
};

const imageEntrySchema = new Schema({
    prosjekt: requiredString,
    parsell: Number,
    kommentar: String,
    kategori: String,
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
    imageURL: String,
    captureDate: {
        type: Date,
        required: true,
    },
}, {
    // For uploaded and updated dates
    timestamps: true, 
}
);

const ImageEntry = mongoose.model('ImageEntry', imageEntrySchema);

module.exports = ImageEntry;