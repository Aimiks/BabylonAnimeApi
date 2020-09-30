'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const AnimeEpisodeSchema = new Schema({
    episodeNumber: Number,
    anime: {type: Schema.Types.ObjectId, ref: 'Anime'},
    download: [{type: Schema.Types.ObjectId, ref:'Download'}]
});

module.exports = mongoose.model('AnimeEpisode', AnimeEpisodeSchema);