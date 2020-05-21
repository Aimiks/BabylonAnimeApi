'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AnimeSchema = new Schema({
    romajiName: {
        type: String
    },
    anilistLink : {
        type: String
    },
    imagePath : {
        type: String
    }
});

module.exports = mongoose.model('Anime', AnimeSchema);