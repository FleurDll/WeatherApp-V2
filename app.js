const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const webpack = require("webpack");

module.exports = () => {
    return {
        plugins: [
            new webpack.DefinePlugin({
                "process.env.API_KEY": JSON.stringify("aCoolValue")
            })
        ]
    };
};

app.use(express.static(path.join(__dirname)));
app.use("/styles", express.static(__dirname + "/styles"));
app.use("/images", express.static(__dirname + "/images"));
app.use("/scripts", express.static(__dirname + "/scripts"));

// viewed at based directory http://localhost:8080/
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/views/index.html"));
});

// add other routes below
app.get("/error", function (req, res) {
    res.sendFile(path.join(__dirname + "/views/error.html"));
});

app.listen(process.env.PORT || 8080, () => {
    console.log("Server is running on port 8080");
});