"use strict";

const mongoose = require("mongoose"),
  Anime = mongoose.model("Anime"),
  AnimeEpisode = mongoose.model("AnimeEpisode"),
  animeEpisodeDAO = require("./animeEpisodeController");

// =========================================================
// ==================== ASYNC FUNCTIONS ====================
// =========================================================

const getAllAnimes = async function () {
  return Anime.find({}).exec();
};
const countAllAnimes = async function () {
  return Anime.count({}).exec();
};

const createAnime = async function (animeParam) {
  if (animeParam.episodeNumber > 0) {
    return createAnimeWithEp(animeParam);
  } else {
    var new_anime = new Anime(animeParam);
    return new_anime.save();
  }
};

const getAnime = async function (animeId) {
  return Anime.findOne({ anilistId: animeId }).exec();
};

const updateAnime = async function (animeId, newParam) {
  return Anime.findOneAndUpdate({ anilistId: animeId }, newParam, { new: true }).exec();
};

const deleteAnime = async function (animeId) {
  Anime.deleteOne({ anilistId: animeId }).exec();
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
        await AnimeEpisode.insertMany(episodes);
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

api.count_all_animes = function (req, res) {
  countAllAnimes()
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
  countAllAnimes,
  createAnime,
  getAnime,
  updateAnime,
  deleteAnime,
  getAnimeEpisodes,
  createAnimeWithEp,
};
