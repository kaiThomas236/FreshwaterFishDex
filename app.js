const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://admin-kai:test123@cluster0.dyrs9ij.mongodb.net/fishdexDB");

const fishSchema = new mongoose.Schema({
    _id: Number,
    commonName: String,
    scientificName: String,
    imagePath: String,
    pH: String, 
    temp: String,
    tankSize: String
});

const Fish = mongoose.model("Fish", fishSchema);

const fish1 = new Fish({
    _id: 1,
    commonName: "Betta",
    scientificName: "Betta Splendens",
    imagePath: "images/black-square.png",
    pH: "6.8 - 7.8",
    temp: "75degF - 82degF",
    tankSize: "5gal"
});
const fish2 = new Fish({
    _id: 2,
    commonName: "Betta",
    scientificName: "Betta Splendens",
    imagePath: "images/black-square.png",
    pH: "6.8 - 7.8",
    temp: "75degF - 82degF",
    tankSize: "5gal"
});
const fish3 = new Fish({
    _id: 3,
    commonName: "Betta",
    scientificName: "Betta Splendens",
    imagePath: "images/black-square.png",
    pH: "6.8 - 7.8",
    temp: "75degF - 82degF",
    tankSize: "5gal"
});
const fish4 = new Fish({
    _id: 4,
    commonName: "Betta",
    scientificName: "Betta Splendens",
    imagePath: "images/black-square.png",
    pH: "6.8 - 7.8",
    temp: "75degF - 82degF",
    tankSize: "5gal"
});
const fish5 = new Fish({
    _id: 5,
    commonName: "Betta",
    scientificName: "Betta Splendens",
    imagePath: "images/black-square.png",
    pH: "6.8 - 7.8",
    temp: "75degF - 82degF",
    tankSize: "5gal"
});
const fish6 = new Fish({
    _id: 6,
    commonName: "Betta",
    scientificName: "Betta Splendens",
    imagePath: "images/black-square.png",
    pH: "6.8 - 7.8",
    temp: "75degF - 82degF",
    tankSize: "5gal"
});

const defaultFish = [fish1, fish2, fish3, fish4, fish5, fish6];

app.get("/", function (req, res) {
    
    Fish.find({}, function (err, fishList) {
        if (fishList.length === 0) {
            Fish.insertMany(defaultFish, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Saved all the default fish.");
                };
            });
            res.redirect("/");
        } else {
            res.render('home', { fishes: fishList });
        };
    });    

});

app.get("/fish/:fishID", function (req, res) {
    
    Fish.find({ _id: req.params.fishID}, function(err, fishList) {
        if (err) {
            console.log(err);
        } else {
            var fish = fishList[0];
            res.render('fishdetails', {fish});
        };
        
    });
});

app.get("/fish", function(req, res) {
    res.render('fishdetails');
});


app.listen(3000, function () {
    console.log("Server is running on port 3000!");
});

/* TODO:  
figure out how to bulk upload fish
finish variables on fishdetails
work out display fish name over image on home page
search function? keywords? what about typos?
you might also like...? a similarity algorithm? could be random to start*/

/* DONE:
show database info on fish details page
flesh out fish details page
add ID to db manually so it is not so messy
change from 6 cards to infinite cards with for loop
use ID to call fish details page
 */
