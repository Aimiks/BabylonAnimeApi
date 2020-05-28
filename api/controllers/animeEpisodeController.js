'use strict';

var mongoose = require('mongoose'),
    AnimeEpisode = mongoose.model('AnimeEpisode');

// =========================================================
// ==================== ASYNC FUNCTIONS ====================
// =========================================================

exports.getAllAnimeEpisodes = async function() {
return new Promise(( resolve, reject) => {
    AnimeEpisode.find({}, function (err, animeEp) {
        if(err)
            reject(err);
        resolve(animeEp);
    });
});
};

exports.createAnimeEpisode = async function(animeEpParam) {
return new Promise(( resolve, reject) => {
    var new_animeEp = new AnimeEpisode(animeEpParam);
    new_animeEp.save(function (err, animeEp) {
        if (err)
            reject(err);
        resolve(animeEp);
    });
});
};

exports.getAnimeEpisode = async function(animeEpId) {
return new Promise(( resolve, reject) => {
    AnimeEpisode.findById(animeEpId, function (err, animeEp) {
        if (err)
            reject(err);
        resolve(animeEp);
    });
});
};

exports.updateAnimeEpisode = async function(animeEpId, newParam) {
return new Promise(( resolve, reject) => {
    AnimeEpisode.findOneAndUpdate({ _id: animeEpId }, newParam, { new: true }, function (err, animeEp) {
        if (err)
            reject(err);
        resolve(animeEp);
    });
});
};

exports.deleteAnimeEpisode = async function(animeEpId) {
return new Promise(( resolve, reject) => {
    AnimeEpisode.remove({_id: animeEpId}, function (err) {
        if (err)
            reject(err);
        resolve(true);
    });
});
};