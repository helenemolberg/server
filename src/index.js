const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const cors = require('cors');
var mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const bodyParser = require('body-parser');

// Reads the .env files
require('dotenv').config();

const middlewares = require('./middlewares');
const images = require('./api/images');

const app = express();

// Set up connection to Mongo
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(morgan('common'));
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
})); // Any origin can request -> those that use 3000. 

// Trengs for form data 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.json({
        message: 'Hello Helene',     
    });
});

/*
    GridFS Configuration
*/
// create a storage engine

const storage = new GridFsStorage({
    url: process.env.DATABASE_URL,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err){
                    return reject(err);
                }
                const filename = file.originalname;
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads',
                };
                resolve(fileInfo);
            });
        });
    }
});


const upload = multer ({ storage });

app.use('/api/images', images(upload));

// Middlewares
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 1337;

app.listen(port, ()=> {
    console.log(`Listening at http://localhost:${port}`);
});