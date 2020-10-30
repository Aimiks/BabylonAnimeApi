"use strict";

const mongoose = require("mongoose"),
  AnimeEpisode = mongoose.model("AnimeEpisode");

// =========================================================
// ==================== ASYNC FUNCTIONS ====================
// =========================================================

const getAllAnimeEpisodes = async function () {
  return AnimeEpisode.find({}).exec();
};

const createAnimeEpisode = async function (animeEpParam) {
  var new_animeEp = new AnimeEpisode(animeEpParam);
  return new_animeEp.save();
};

const getAnimeEpisode = async function (animeEpId) {
  return AnimeEpisode.findById(animeEpId);
};

const updateAnimeEpisode = async function (animeEpId, newParam) {
  return AnimeEpisode.findOneAndUpdate(
    {
      _id: animeEpId,
    },
    newParam,
    {
      new: true,
    }
  ).exec();
};

const deleteAnimeEpisode = async function (animeEpId) {
  return AnimeEpisode.deleteOne({
    _id: animeEpId,
  }).exec();
};

const getEpisodesFromAnime = async function (animeId) {
  return AnimeEpisode.find({ anime: animeId }).exec();
};

const getDownloadedFile = async function (animeEpId) {
  DownloadDAO = require("../downloadController");
  let files = [];
  try {
    let anime = await getAnimeEpisode(animeEpId);
    anime.download.forEach((d_id) => {
      files.push(DownloadDAO.getFilesAssociated(d_id));
    });
  } catch (err) {
    return Promise.reject(err);
  }
  return new Promise.resolve(files);
};
// =========================================================
// ==================== API FUNCTIONS ======================
// =========================================================

let api = {};
api.get_all_animeEpisodes = function (req, res) {
  getAllAnimeEpisodes()
    .then((items) => res.json(items))
    .catch((e) => res.send(e));
};

api.create_animeEpisode = function (req, res) {
  createAnimeEpisode(req.body)
    .then((items) => res.json(items))
    .catch((e) => res.send(e));
};

api.get_animeEpisode = function (req, res) {
  getAnimeEpisode(req.params.animeEpisodeId)
    .then((items) => res.json(items))
    .catch((e) => res.send(e));
};

api.update_animeEpisode = function (req, res) {
  updateAnimeEpisode(req.params.animeEpisodeId, req.body)
    .then((items) => res.json(items))
    .catch((e) => res.send(e));
};

api.delete_animeEpisode = function (req, res) {
  deleteAnimeEpisode(req.params.animeEpisodeId)
    .then((res) => res.json({ status: 200, message: "AnimeEpisode successfully deleted" }))
    .catch((e) => res.send(e));
};

module.exports = {
  api,
  getAllAnimeEpisodes,
  createAnimeEpisode,
  getAnimeEpisode,
  updateAnimeEpisode,
  deleteAnimeEpisode,
  getEpisodesFromAnime,
  getDownloadedFile,
};
