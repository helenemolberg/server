const express = require("express");
const imageRouter = express.Router();
const mongoose = require("mongoose");
const ImageEntry = require("../models/ImageEntry");
const Grid = require('gridfs-stream');

//reads the env file
require("dotenv").config();

module.exports = (upload) => {
  const connect = mongoose.createConnection(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  let gfs;

  connect.once("open", () => {
    // initialize stream
    //gfs = new mongoose.mongo.GridFSBucket(connect.db, {
    //  bucketName: "uploads",
    //});

    gfs = Grid(connect.db, mongoose.mongo);
    gfs.collection('uploads');
  });

  imageRouter
    .route("/")
    .post(upload.single("bildefil"), async (req, res, next) => {
    
      // Check for existing images
      ImageEntry.findOne({ imageName: req.body.imageName })
        .then((image) => {
          console.log(image);
          if (image) {
            return res.status(200).json({
              success: false,
              message: "Fil eksisterer allerede",
            });
          }
            
          let newImage = new ImageEntry({
            prosjekt: req.body.prosjekt,
            parsell: req.body.parsell,
            profilnr: req.body.profilnr,
            objektnr: req.body.objektnr,
            kommentar: req.body.kommentar,
            kategori: req.body.kategori,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            GPSAltitude: req.body.GPSAltitude,
            GPSImgDirection: req.body.GPSImgDirection,
            imageName: req.body.imageName,
            imageType: req.body.imageType,
            captureDate: req.body.captureDate
          });

          newImage
            .save()
            .then((image) => {
              res.status(200).json({
                success: true,
                image,
              });
            })
            .catch((err) => res.status(500).json(err));
        })
        .catch((err) => res.status(500).json(err));
    })
    .get((req, res, next) => {
      ImageEntry.find({})
        .then((images) => {
          res.status(200).json({
            images,
          });
        })
        .catch((err) => res.status(500).json(err));
    });

  /*
        GET: Fetches files from a particular project
        Funker!  
    */
  
   imageRouter.route('/:prosjekt')
        .get((req, res, next) => {
            ImageEntry.find({ prosjekt: req.params.prosjekt}, (err, files) => {
                if (!files || files.length === 0) {
                    return res.status(200).json({
                        success: false,
                        message: 'No files available',
                    });
                }

                res.status(200).json({
                    success: true,
                    files,
                });
            });
        });

    /*
        Display image 
    */
    imageRouter.route('/image/:filename')
        .get((req, res) => {
            // Må se i gfs siden bildet er lagret i bucket
            gfs.files.findOne({filename: req.params.filename}, (err, file) => {
                // Check if file
                if(!file || file.length === 0){
                    return res.status(404).json({
                        err: 'No file exists'
                    });
                }
                
                // Check if image
                if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/heic') {
                    // Read output to browser
                    const readstream = gfs.createReadStream(file.filename);
                    var bufs = [];

                    readstream.on('data', function(chunk) {
                        bufs.push(chunk);
                    }).on('end', function(){ // done
                        var fbuf = Buffer.concat(bufs);
                        var base64 = (fbuf.toString('base64'));

                        res.send('"data:'+ file.contentType + ';base64,' + base64 + '"');
                        // Shows the picture in the browser for server
                        //res.send('<img src="data:image/jpeg;base64,' + base64 + '">') 
                    })
                } else {
                    res.status(404).json({
                    err: 'Not an image'
                    });
                }
            });
        });
        /*
          GET: Search on parsellnumber
        */
    
    imageRouter.route("/:parsell").get((req, res, next) => {
      ImageEntry.find({ parsell: req.params.parsell }, (err, files) => {
        if (!files || files.length === 0) {
          return res.status(200).json({
            success: false,
            message: "No files available",
          });
        }

        res.status(200).json({
          success: true,
          files,
        });
      });
    });

        /*
            GET: Data between dates - not working??
        */
    imageRouter.route('/daterange/:value')
        .get((req, res) => {
            ImageEntry.find({
                captureDate: {
                    $gte: new Date(req.params.value[0]).toISOString,
                    $lt: new Date(req.params.value[1]).toISOString 
            }}, (err, files) => {
                if (!files || files.length === 0) {
                    return res.status(200).json({
                        success: false,
                        message: 'No files available',
                    });
                }

                res.status(200).json({
                    success: true,
                    files,
                });
            });
        });

  return imageRouter;
};
