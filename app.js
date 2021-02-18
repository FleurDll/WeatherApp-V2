const express = require("express");
const path = require("path");
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
const persPort = 3000;

const app = express();

app.use(express.static(path.join(__dirname)));
app.use("/styles", express.static(__dirname + "/styles"));
app.use("/images", express.static(__dirname + "/images"));
app.use("/scripts", express.static(__dirname + "/scripts"));
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://localhost/weatherDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Mongoose working !");
});

const citySchema = new mongoose.Schema({
    city: String
});

const City = mongoose.model("City", citySchema);


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/index.html"));
});

app.post("/", (req, res) => {
    console.log("POST ACTION");

    const city = new City({
        city: req.body.cityName
    });

    city.save((err) => {
        if (!err) {
            console.log("city saved");
            res.redirect("/");
        } else {
            console.console.log((err));
        }
    });
});

app.get("/error", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/error.html"));
});

app.listen(process.env.PORT || persPort, () => {
    console.log("Server is running on port " + persPort);
});