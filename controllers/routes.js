// Dependencies
var axios = require("axios");
var cheerio = require("cheerio");
var express = require("express");
var app = express.Router();
var db = require("../models");

// Routes

// A GET route for scraping the HuffPost website

app.get("/scrape", function (req, res) {
  axios.get("https://www.huffpost.com/section/world-news").then(function (response) {
    var $ = cheerio.load(response.data);

    $("div.card__headline__text").each(function (i, element) {
      var result = {};

      result.title = $(element).text();
      result.link = $(element).parent("a").attr("href");
      // result.image = $(element).siblings("div.card__image__wrapper").children("div.card__image").children("img").attr("card__image__src");

      db.Article.create(result)
        .then(function (dbArticle) {
          console.log("results" + dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        });
    });

    res.render("scrape");
  
  });
});

// Route for getting all Articles
app.get("/", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (data) {
      var hbsObject = {
        scrapes: data
      };
      console.log(hbsObject);
      res.render("index", {hbsObject});

    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// Route for identifying saved articles
app.get('/save/:id', (req,res) => {
  db.Article.update({_id: req.params.id},{saved: true})
    .then(function (data){
      res.redirect('/')});
});

// Route for saving Articles
app.get("/savedArticles", function (req, res){
  db.Article.find({saved: true})
    .then(function (data){
      res.render("saved", {data});
    });
});

// Route for deleting a note
app.delete("/articles/:id", function (req, res) {

  console.log("id:" + req.params.id);
  db.Article.findByIdAndRemove(req.params.id, function (err) {
    if (err)
      res.send(err);
    else
      res.json({ message: 'Note Deleted!' });
  });
});

// Route for deleting all articles

app.delete("/articles", function (req, res){
  db.Article.remove({})
  .then(function (data){
    res.redirect('/')});
})

// Route for retrieving all Article from the db
app.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's Note
app.post("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

module.exports = app;