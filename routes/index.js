var express = require('express');
var router = express.Router();
var multer = require('multer');
var mongodb = require('mongodb');
const fs = require('fs');
var cloudinary = require('cloudinary');
var formidable = require('formidable');


/* GET home page. */
router.get('/', function(req, res, next) {

    //connect to mongodb
    var MongoClient = mongodb.MongoClient;
    var uri = 'mongodb://Kumidori:vanessa14@ds035059.mlab.com:35059/tinked';
    MongoClient.connect(uri, function (err, db) {
        if(err) {
            console.log('unable to connect to mongodb');
        }
        else {
            console.log('successfully connected');
            var collection = db.collection('tattoos');
            collection.find({}).toArray(function (err, result) {
                if (err) {
                    res.send(err);
                } else {
                    res.render('index', { title: 'tinked',tattoos: result });
                }
                //Close connection
                db.close();
            });
        }

    });

});
router.post('/', function (req, res) {

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log("upload error!!!!");
            console.log(err)
        }
        console.log('formidabler upload! :)');
        cloudinary.uploader.upload(files.fileUploaded.path, function (result) {

            //connect to mongodb and write tattoo information
            var MongoClient = mongodb.MongoClient;
            var uri = 'mongodb://Kumidori:vanessa14@ds035059.mlab.com:35059/tinked';
            MongoClient.connect(uri, function (err, db) {
                if (err) {
                    console.log('unable to connect to mongodb');
                }
                else {
                    console.log('successfully connected');
                    var collection = db.collection('tattoos');
                    var tattoo = {
                        url: result.url, artist: req.body.artist, tags: req.body.tags, category: req.body.category,
                        date: Date.now()
                    };
                    collection.insert([tattoo], function (err, result) {
                        if (err) {
                            console.log(err);
                        } else {

                            console.log("saved tattoo in database");
                            res.redirect('/');
                        }

                        // Close the database
                        db.close();
                    });
                }
            });
        });
    });


});

module.exports = router;
