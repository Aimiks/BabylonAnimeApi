"use strict";
module.exports = function (app) {
  var anime = require("../controllers/animeController");
  app
    .route("/animes")
    .get(anime.api.get_all_animes)
    .post(anime.api.create_anime);

  app
    .route("/animes/:animeId")
    .get(anime.api.get_anime)
    .put(anime.api.update_anime)
    .delete(anime.api.delete_anime);

  app.route("/animes/:animeId/episodes").get(anime.api.get_anime_episodes);
};
