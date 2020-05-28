'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DownloadSchema = new Schema({
    status: {type: String, enum: ["unknown", "downloading", "finished"]},
    originalFile: {type: Schema.Types.ObjectId, ref:'File'},
    downloadedFile: {type: Schema.Types.ObjectId, ref:'File'},
    progress: Number
});

module.exports = mongoose.model('Download', DownloadSchema);