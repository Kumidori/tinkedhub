var express = require('express');
var router = express.Router();
var multer = require('multer');
var mongodb = require('mongodb');
const fs = require('fs');


function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name ='/uploads/' + files[i];

        files_.push(name);

    }
    return files_;
}




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


    var tattoolist=getFiles('public/uploads');



});


//Upload

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
});

var upload = multer({ storage: storage }).single('fileUploaded');


router.post('/', function (req, res) {

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
                var tattoo = {url: '/uploads/'+req.file.filename, artist: req.body.artist, tags: req.body.tags, category: req.body.category,
                    date: Date.now()};
                collection.insert([tattoo], function (err, result){
                    if (err) {
                        console.log(err);
                    } else {

                        console.log("saved tattoo in database");
                    }

                    // Close the database
                    db.close();
            });
            }

    });

    upload(req, res, function (err) {
        if (err) {
            console.log("upload error!!!!");
            // An error occurred when uploading
        }
        var tattoolist=getFiles('public/uploads');
        res.redirect('/');

        // Everything went fine
    })
});

module.exports = router;
