'use strict';

var mongoose = require('mongoose'),
    Download = mongoose.model('Download');

// =========================================================
// ==================== ASYNC FUNCTIONS ====================
// =========================================================

exports.getAllDownloads = async function() {
    return new Promise(( resolve, reject) => {
        Download.find({}, function (err, download) {
            if(err)
                reject(err);
            resolve(download);
        });
    });
};

exports.createDownload = async function(downloadParam) {
    return new Promise(( resolve, reject) => {
        var new_download = new Download(downloadParam);
        new_download.save(function (err, download) {
            if (err)
                reject(err);
            resolve(download);
        });
    });
};

exports.getDownload = async function(downloadId) {
    return new Promise(( resolve, reject) => {
        Download.findById(downloadId, function (err, download) {
            if (err)
                reject(err);
            resolve(download);
        });
    });
};

exports.updateDownload = async function(downloadId, newParam) {
    return new Promise(( resolve, reject) => {
        Download.findOneAndUpdate({ _id: downloadId }, newParam, { new: true }, function (err, download) {
            if (err)
                reject(err);
            resolve(download);
        });
    });
};

exports.deleteDownload = async function(downloadId) {
    return new Promise(( resolve, reject) => {
        Download.remove({_id: downloadId}, function (err) {
            if (err)
                reject(err);
            resolve(true);
        });
    });
};