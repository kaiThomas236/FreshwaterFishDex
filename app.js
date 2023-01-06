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
    commonName: String,
    scientificName: String,
    pH: String, 
    temp: String,
    tankSize: String
});

const Fish = mongoose.model("Fish", fishSchema);

app.get("/", function (req, res) {
    const fish = new Fish({
        commonName: "Betta",
        scientificName: "Betta Splendens",
        pH: "6.8 - 7.8",
        temp: "75degF - 82degF",
        tankSize: "5gal"
    });
    fish.save();
    res.render('home');

});

app.get("/fish", function(req, res) {
    res.render('fishdetails');
});


app.listen(3000, function () {
    console.log("Server is running on port 3000!");
});

/* TODO:  
change from 6 cards to infinite cards with for loop
figure out how to bulk upload fish
flesh out fish details page
add ID to db manually so it is not so messy
use ID to call fish details page
search function? */