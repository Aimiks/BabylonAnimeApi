'use strict';

var mongoose = require('mongoose'),
    File = mongoose.model('File');

// =========================================================
// ==================== ASYNC FUNCTIONS ====================
// =========================================================

exports.getAllFiles = async function() {
    return new Promise(( resolve, reject) => {
        File.find({}, function (err, file) {
            if(err)
                reject(err);
            resolve(file);
        });
    });
};

exports.createFile = async function(fileParam) {
    return new Promise(( resolve, reject) => {
        var new_file = new File(fileParam);
        new_file.save(function (err, file) {
            if (err)
                reject(err);
            resolve(file);
        });
    });
};

exports.getFile = async function(fileId) {
    return new Promise(( resolve, reject) => {
        File.findById(fileId, function (err, file) {
            if (err)
                reject(err);
            resolve(file);
        });
    });
};

exports.updateFile = async function(fileId, newParam) {
    return new Promise(( resolve, reject) => {
        File.findOneAndUpdate({ _id: fileId }, newParam, { new: true }, function (err, file) {
            if (err)
                reject(err);
            resolve(file);
        });
    });
};

exports.deleteFile = async function(fileId) {
    return new Promise(( resolve, reject) => {
        File.remove({_id: fileId}, function (err) {
            if (err)
                reject(err);
            resolve(true);
        });
    });
};