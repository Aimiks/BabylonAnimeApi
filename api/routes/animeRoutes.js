'use strict';
module.exports = function(app) {
  var anime = require('../controllers/animeController');

  // todoList Routes
  app.route('/animes')
    .get(anime.get_all_anime)
    .post(anime.create_anime);


  app.route('/anime/:animeId')
    .get(anime.get_anime)
    .put(anime.update_anime)
    .delete(anime.delete_anime);
};