'use strict';
module.exports = function(app) {
  var animeEpisode = require('../controllers/animeEpisodeController');
  app.route('/animeEpisodes')
    .get(animeEpisode.api.get_all_animeEpisodes)
    .post(animeEpisode.api.create_animeEpisode);


  app.route('/animeEpisode/:animeEpisodeId')
    .get(animeEpisode.api.get_animeEpisode)
    .put(animeEpisode.api.update_animeEpisode)
    .delete(animeEpisode.api.delete_animeEpisode);
};