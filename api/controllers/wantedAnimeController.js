'use strict';

const mongoose = require('mongoose'),
    WantedAnime = mongoose.model('WantedAnime')
// =========================================================
// ==================== ASYNC FUNCTIONS ====================
// =========================================================

const getAllWantedAnimes = async function() {
    return new Promise(( resolve, reject) => {
        WantedAnime.find({}, function (err, wantedAnime) {
            if(err)
                reject(err);
            resolve(wantedAnime);
        });
    });
};

const createWantedAnime = async function(wantedAnimeParam) {
    return new Promise(( resolve, reject) => {
        var new_wantedAnime = new WantedAnime(wantedAnimeParam);
        new_wantedAnime.save(function (err, wantedAnime) {
            if (err)
                reject(err);
            resolve(wantedAnime);
        });
    });
};

const getWantedAnime = async function(wantedAnimeId) {
    return new Promise(( resolve, reject) => {
        WantedAnime.findById(wantedAnimeId, function (err, wantedAnime) {
            if (err)
                reject(err);
            resolve(wantedAnime);
        });
    });
};

const updateWantedAnime = async function(wantedAnimeId, newParam) {
    return new Promise(( resolve, reject) => {
        WantedAnime.findOneAndUpdate({ _id: wantedAnimeId }, newParam, { new: true }, function (err, wantedAnime) {
            if (err)
                reject(err);
            resolve(wantedAnime);
        });
    });
};

const deleteWantedAnime = async function(wantedAnimeId) {
    return new Promise(( resolve, reject) => {
        WantedAnime.remove({_id: wantedAnimeId}, function (err) {
            if (err)
                reject(err);
            resolve(true);
        });
    });
};

// =========================================================
// ==================== API FUNCTIONS ======================
// =========================================================

let api = {};
api.get_all_wantedAnimes = function (req, res) {
    getAllWantedAnimes().then(res.json).catch(res.send);
};


api.create_wantedAnime = function (req, res) {
    createWantedAnime(req.body).then(res.json).catch(res.send);
};


api.get_wantedAnime = function (req, res) {
    getWantedAnime(req.params.wantedAnimeId).then(res.json).catch(res.send);
};

api.update_wantedAnime = function (req, res) {
    updateWantedAnime(req.params.wantedAnimeId,req.body).then(res.json).catch(res.send);
};


api.delete_wantedAnime = function (req, res) {
    deleteWantedAnime(req.params.wantedAnimeId).then((res) => res.json({ status: 200, message: 'WantedAnime successfully deleted' })).catch(res.send);
};
module.exports = {api, getAllWantedAnimes, createWantedAnime, getWantedAnime, updateWantedAnime, deleteWantedAnime};

