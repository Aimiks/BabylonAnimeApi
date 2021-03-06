var express = require("express"),
  app = express(),
  port = process.env.PORT || 2727,
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  WebTorrent = require("webtorrent"),
  cors = require("cors");

require("./api/models/animeEpisodeModel");
require("./api/models/animeModel");
require("./api/models/fileModel");
require("./api/models/downloadModel");

const mockFunctions = require("./api/utils/mockFunctions");
const log = require("./debug/log").log;
const downloader = require("./downloader/downloader");
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/BabylonAnime", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
const animeRoutes = require("./api/routes/animeRoutes"); //importing route
const animeEpisodeRoutes = require("./api/routes/animeEpisodeRoutes"); //importing route
animeRoutes(app); //register the route
animeEpisodeRoutes(app);

app.listen(port);
app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

console.log("AnimeAPI started on port " + port);
const client = new WebTorrent();
downloader.startDownload(client);
//mockFunctions.downloadAnimeEpisode(client);
