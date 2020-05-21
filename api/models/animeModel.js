'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AnimeSchema = new Schema({
    romajiName: String,
    anilistLink: String,
    imagePath: String,
    episode: [{type: Schema.Types.ObjectId, ref: 'Download' }],
    status: {type: String, enum:["releasing", "finished", "unknown"]}
});

module.exports = mongoose.model('Anime', AnimeSchema);