'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AnimeEpisodeSchema = new Schema({
    episodeNumber: Number,
    anime: {type: Schema.Types.ObjectId, ref: 'Anime'},
    download: [{type: Schema.Types.ObjectId, ref:'Download'}]
});

module.exports = mongoose.model('AnimeEpisode', AnimeEpisodeSchema);