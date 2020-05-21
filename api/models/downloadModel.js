'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DownloadSchema = new Schema({
    status: {type: String, enum: ["unknown", "downloading", "finished"]},
    originalFile: {type: Schema.Types.ObjectId, ref:'File'},
    downloadedFile: {type: Schema.Types.ObjectId, ref:'File'},
    fileQuality: {type: String, enum:["720p", "1080p"]}
});

module.exports = mongoose.model('Download', DownloadSchema);