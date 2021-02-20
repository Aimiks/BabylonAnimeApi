const getLastEpisodeUp = function (anime) {
  return anime.nextAiringEpisode ? anime.nextAiringEpisode : anime.episode;
};

module.exports = { getLastEpisodeUp };
