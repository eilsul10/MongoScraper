// Set up dependencies
var express = require("express");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var express = require("express");
var axios = require("axios");

// Set up port
var PORT = 3000;

// Require all models
var db = require("./models");

// Initialize Express
var app = express();

// Configure middleware

var routes = require("./controllers/routes.js");

// Parse request body as JSON
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Set Handlebars
var exphbs = require ("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use(routes);

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/huffheadline", { useNewUrlParser: true });

// Start the server
app.listen(PORT, function(){
    console.log("App running on port " + PORT + "!");
});