'use strict';

var mongoose = require('mongoose'),
    Anime = mongoose.model('Anime');

// =========================================================
// ==================== ASYNC FUNCTIONS ====================
// =========================================================

exports.getAllAnime = async function() {
    return new Promise(( resolve, reject) => {
        Anime.find({}, function (err, anime) {
            if(err)
                reject(err);
            resolve(anime);
        });
    });
};

exports.createAnime = async function(animeParam) {
    return new Promise(( resolve, reject) => {
        var new_anime = new Anime(animeParam);
        new_anime.save(function (err, anime) {
            if (err)
                reject(err);
            resolve(anime);
        });
    });
};

exports.getAnime = async function(animeId) {
    return new Promise(( resolve, reject) => {
        Anime.findById(animeId, function (err, anime) {
            if (err)
                reject(err);
            resolve(anime);
        });
    });
};

exports.updateAnime = async function(animeId, newParam) {
    return new Promise(( resolve, reject) => {
        Anime.findOneAndUpdate({ _id: animeId }, newParam, { new: true }, function (err, anime) {
            if (err)
                reject(err);
            resolve(anime);
        });
    });
};

exports.deleteAnime = async function(animeId) {
    return new Promise(( resolve, reject) => {
        Anime.remove({_id: animeId}, function (err) {
            if (err)
                reject(err);
            resolve(true);
        });
    });
};
// =========================================================
// ==================== API FUNCTIONS ======================
// =========================================================


exports.get_all_anime = function (req, res) {
    getAllAnime().then(res.json).catch(res.send);
};


exports.create_anime = function (req, res) {
    createAnime(req.body).then(res.json).catch(res.send);
};


exports.get_anime = function (req, res) {
    getAnime(req.params.animeId).then(res.json).catch(res.send);
};

exports.update_anime = function (req, res) {
    updateAnime(req.params.animeId,req.body).then(res.json).catch(res.send);
};


exports.delete_anime = function (req, res) {
    deleteAnime(req.params.animeId).then((res) => res.json({ status: 200, message: 'Anime successfully deleted' })).catch(res.send);
};

