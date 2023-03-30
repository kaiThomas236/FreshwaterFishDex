const express = require("express");
const bodyParser = require("body-parser");
const http = require('http');
const path = require("path");

const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({
    storage: storage, fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    }
}).single('image');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const fs = require('fs');

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://admin-kai:test123@cluster0.dyrs9ij.mongodb.net/fishdexDB");

const fishSchema = new mongoose.Schema({
    _id: Number,
    summary: String,
    commonName: String,
    scientificName: String,
    pH: String, 
    temperature: String,
    tankSize: String,
    social: String,
    diet: String,
    maxSize: String
});

const Fish = mongoose.model("Fish", fishSchema);



app.get("/", function (req, res) {
    
    Fish.find({}, function (err, fishList) {
        if (fishList.length === 0) {
            uploadFish();
            res.redirect("/");
        } else {
            res.render('home', { fishes: fishList });
        };
    });  

});

app.get("/fish/:fishID", function (req, res) {
    Fish.countDocuments({}, function (err, numDocs) {
        let k = 0;
        var fishes = []; 
        var mainFish;
        try {
            Fish.find({ _id: req.params.fishID }, function (err, fishList) {
                if (err) {
                    console.log(err);
                } else {
                    mainFish = fishList[0];
                };
            });
        } finally {
            while (k < 5) {
                const rand = (Math.ceil(Math.random() * numDocs));

                Fish.find({ _id: rand }, function (err, fishList) {
                    if (err) {
                        console.log(err);
                    } else {
                        fishes.push(fishList[0]);
                        if (fishes.length == 5) {

                            res.render('fishdetails', { fishes, mainFish });
                        };
                    };
                });
                k++;
            };
        };
    });    
});


app.post("/search", function (req, res) {
    // console.log(req.body.searchItem);
    async function run() {
        const agg = [
            {
                '$search': {
                    'index': 'fishindex',
                    'text': {
                        'query': req.body.searchItem,
                        'path': {
                            'wildcard': '*'
                        }
                    }
                }
            }
        ];
        const cursor = Fish.aggregate(agg);
        const results = await cursor;
        if (results.length != 0) {
            res.render('searchresults', { fishes: results });
        } else {
            res.render('noresults');
        };
        
    }
    run();
    //if this is ever failing check mongodb atlas first, ensure the search index exists
});


app.post('/suggest', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).send(err.message);
        } else {
            // copy the uploaded image to the public directory
            console.log(req.file);
            if (!req.file) {
                // Handle error when file is not uploaded
                return res.status(400).send('No file uploaded');
            }
            fs.copySync(req.file.path, `public/${req.file.filename}`);
            res.send('Image uploaded successfully');
        }
    });
});


http.createServer(app, function (req, res) {
}).listen(3000, '127.0.0.1');
console.log('Server running at http://127.0.0.1:3000/');


function uploadFish() {
    fs.readFile('collection.json', 'utf8', (err, jsonString) => {
        var k = 0;
        if (err) {
            console.log("File read failed:", err);
            return;
        }
        try {
            const fishList = JSON.parse(jsonString);
            for (k in fishList) {
                const tempFish = fishList[k];
                const fish = new Fish({
                    _id: Number(k)+1,
                    summary: tempFish.summary,
                    commonName: tempFish.commonName,
                    scientificName: tempFish.scientificName,
                    pH: tempFish.pH,
                    temperature: tempFish.temperature,
                    tankSize: tempFish.tankSize,
                    social: tempFish.social,
                    diet: tempFish.diet,
                    maxSize: tempFish.maxSize
                });
                fish.save()
            };

        } catch (err) {
            console.log('Error parsing JSON string:', err);
        };
    });
};



// to update db: del all docs thru cmd line, pull csv -> json, insert json to collection, run app locally

/* TODO:  

get pictures! add fish!


*/

/* DONE:
a search function, a search results page   !!!! done!   ...broken for some reason. fix it.
show database info on fish details page
flesh out fish details page
add ID to db manually so it is not so messy
change from 6 cards to infinite cards with for loop
use ID to call fish details page
finish variables on fishdetails
figure out how to bulk upload fish
work out display fish name over image on home page
fix temperature, fix size, is " an escape character?
 */


