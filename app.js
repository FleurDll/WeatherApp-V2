const express = require("express");
const app = express();
const path = require("path");
const persPort = 3000;

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

app.listen(process.env.PORT || persPort, () => {
    console.log("Server is running on port " + persPort);
});