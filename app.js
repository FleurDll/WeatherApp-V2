const express = require("express");
const path = require("path");
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
const persPort = 8080;

const app = express();

app.use(express.static(path.join(__dirname)));
app.use("/styles", express.static(__dirname + "/styles"));
app.use("/images", express.static(__dirname + "/images"));
app.use("/scripts", express.static(__dirname + "/scripts"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://fleur_db:9JxlKd0pteQxDr37@cities.jtwqi.mongodb.net/weatherDB', {
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
    cityName: String
}, {
    timestamps: { createdAt: true, updatedAt: false }
  });

const City = mongoose.model("City", citySchema);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/index.html"));
});

app.post("/", (req, res) => {

    console.log(req.body);

    const city = new City({
        cityName: req.body.city.cityName
    });

    city.save((err) => {
        if (!err) {
            console.log("city saved");
            res.redirect("/");
        } else {
            console.log((err));
        }
    });
});

app.get("/error", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/error.html"));
});

app.listen(process.env.PORT || persPort, () => {
    console.log("Server is running on port " + persPort);
});