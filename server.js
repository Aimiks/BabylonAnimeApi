var express = require("express"),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  WebTorrent = require("webtorrent");

require("./api/models/animeEpisodeModel");
require("./api/models/animeModel");
require("./api/models/fileModel");
require("./api/models/downloadModel");

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/BabylonAnime", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var animeRoutes = require("./api/routes/animeRoutes"); //importing route
var animeEpisodeRoutes = require("./api/routes/animeEpisodeRoutes"); //importing route
animeRoutes(app); //register the route
animeEpisodeRoutes(app);

app.listen(port);
app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

console.log("AnimeAPI started on port " + port);
const client = new WebTorrent();
//mockFunctions.downloadAnimeEpisode(client);
