"use strict";

const mongoose = require("mongoose"),
  Anime = mongoose.model("Anime"),
  AnimeEpisode = mongoose.model("AnimeEpisode"),
  animeEpisodeDAO = require("./animeEpisodeController");

// =========================================================
// ==================== ASYNC FUNCTIONS ====================
// =========================================================

const getAllAnimes = async function () {
  return new Promise((resolve, reject) => {
    Anime.find({}, function (err, anime) {
      if (err) reject(err);
      resolve(anime);
    });
  });
};

const createAnime = async function (animeParam) {
  if (animeParam.episodeNumber > 0) {
    return createAnimeWithEp(animeParam);
  } else {
    return new Promise((resolve, reject) => {
      var new_anime = new Anime(animeParam);
      new_anime.save(function (err, anime) {
        if (err) reject(err);
        resolve(anime);
      });
    });
  }
};

const getAnime = async function (animeId) {
  return new Promise((resolve, reject) => {
    Anime.findOne({ anilistId: animeId }, function (err, anime) {
      if (err) reject(err);
      resolve(anime);
    });
  });
};

const updateAnime = async function (animeId, newParam) {
  return new Promise((resolve, reject) => {
    Anime.findOneAndUpdate({ anilistId: animeId }, newParam, { new: true }, function (err, anime) {
      if (err) reject(err);
      resolve(anime);
    });
  });
};

const deleteAnime = async function (animeId) {
  return new Promise((resolve, reject) => {
    Anime.deleteOne({ anilistId: animeId }, function (err) {
      if (err) reject(err);
      resolve(true);
    });
  });
};

const getAnimeEpisodes = async function (animeId) {
  return animeEpisodeDAO.getEpisodesFromAnime(animeId);
};

const createAnimeWithEp = async function (animeParam) {
  return new Promise(async (resolve, reject) => {
    if (animeParam.episodeNumber > 0) {
      let episodeNumber = animeParam.episodeNumber;
      delete animeParam.episodeNumber;
      try {
        let anime = await createAnime(animeParam);
        let episodes = [];
        for (let i = 1; i < episodeNumber; i++) {
          episodes.push({ episodeNumber: i, anime: anime._id });
        }
        AnimeEpisode.insertMany(episodes);
        resolve(anime);
      } catch (e) {
        reject(e);
      }
    } else {
      reject("No episode number passed in params");
    }
  });
};

// =========================================================
// ==================== API FUNCTIONS ======================
// =========================================================

let api = {};
api.get_all_animes = function (req, res) {
  getAllAnimes()
    .then((items) => res.json(items))
    .catch((e) => res.send(e));
};

api.create_anime = function (req, res) {
  createAnime(req.body)
    .then((items) => res.json(items))
    .catch((e) => res.send(e));
};

api.get_anime = function (req, res) {
  getAnime(req.params.animeId)
    .then((items) => res.json(items))
    .catch((e) => res.send(e));
};

api.update_anime = function (req, res) {
  updateAnime(req.params.animeId, req.body)
    .then((items) => res.json(items))
    .catch((e) => res.send(e));
};

api.delete_anime = function (req, res) {
  deleteAnime(req.params.animeId)
    .then((res) => res.json({ status: 200, message: "Anime successfully deleted" }))
    .catch((e) => res.send(e));
};

api.get_anime_episodes = function (req, res) {
  getAnimeEpisodes(req.params.animeId)
    .then((items) => res.json(items))
    .catch((e) => res.send(e));
};

api.create_anime_with_ep = function (req, res) {
  createAnimeWithEp(req.params)
    .then((items) => res.json(items))
    .catch((e) => res.send(e));
};

module.exports = {
  api,
  getAllAnimes,
  createAnime,
  getAnime,
  updateAnime,
  deleteAnime,
  getAnimeEpisodes,
  createAnimeWithEp,
};
