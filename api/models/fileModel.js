'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var FileSchema = new Schema({
    name: String,
    path: String,
    type: String,
    size: Number,
    resolution: Number
});

module.exports = mongoose.model('File', FileSchema);