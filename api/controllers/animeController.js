'use strict';

var mongoose = require('mongoose'),
    Anime = mongoose.model('Anime');

exports.get_all_anime = function (req, res) {
    Anime.find({}, function (err, anime) {
        if (err)
            res.send(err);
        res.json(anime);
    });
};


exports.create_anime = function (req, res) {
    var new_anime = new Anime(req.body);
    new_anime.save(function (err, anime) {
        if (err)
            res.send(err);
        res.json(anime);
    });
};


exports.get_anime = function (req, res) {
    Anime.findById(req.params.animeId, function (err, anime) {
        if (err)
            res.send(err);
        res.json(anime);
    });
};


exports.update_anime = function (req, res) {
    Anime.findOneAndUpdate({ _id: req.params.animeId }, req.body, { new: true }, function (err, anime) {
        if (err)
            res.send(err);
        res.json(anime);
    });
};


exports.delete_anime = function (req, res) {
    Anime.remove({
        _id: req.params.animeId
    }, function (err, anime) {
        if (err)
            res.send(err);
        res.json({ status: 200, message: 'Anime successfully deleted' });
    });
};

