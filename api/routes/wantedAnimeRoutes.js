'use strict';
module.exports = function(app) {
  var wantedAnime = require('../controllers/wantedAnimeController');
  app.route('/wantedAnimes')
    .get(wantedAnime.api.get_all_wantedAnimes)
    .post(wantedAnime.api.create_wantedAnime);


  app.route('/wantedAnime/:wantedAnimeId')
    .get(wantedAnime.api.get_wantedAnime)
    .put(wantedAnime.api.update_wantedAnime)
    .delete(wantedAnime.api.delete_wantedAnime);
};