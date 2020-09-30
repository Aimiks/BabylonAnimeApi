"use strict";

const mongoose = require("mongoose"),
  Download = mongoose.model("Download");

// =========================================================
// ==================== ASYNC FUNCTIONS ====================
// =========================================================

const getAllDownloads = async function () {
  return new Promise((resolve, reject) => {
    Download.find({}, function (err, download) {
      if (err) reject(err);
      resolve(download);
    });
  });
};

const createDownload = async function (downloadParam) {
  return new Promise((resolve, reject) => {
    var new_download = new Download(downloadParam);
    new_download.save(function (err, download) {
      if (err) reject(err);
      resolve(download);
    });
  });
};

const getDownload = async function (downloadId) {
  return new Promise((resolve, reject) => {
    Download.findById(downloadId, function (err, download) {
      if (err) reject(err);
      resolve(download);
    });
  });
};

const updateDownload = async function (downloadId, newParam) {
  return new Promise((resolve, reject) => {
    Download.findOneAndUpdate(
      {
        _id: downloadId,
      },
      newParam,
      {
        new: true,
      },
      function (err, download) {
        if (err) reject(err);
        resolve(download);
      }
    );
  });
};

const deleteDownload = async function (downloadId) {
  return new Promise((resolve, reject) => {
    Download.deleteOne(
      {
        _id: downloadId,
      },
      function (err) {
        if (err) reject(err);
        resolve(true);
      }
    );
  });
};

const getFilesAssociated = async function (downloadId) {
  return getDownload(downloadId)
    .then((dl) => dl.downloadedFile)
    .catch((err) => err);
};

module.exports = {
  getAllDownloads,
  createDownload,
  getDownload,
  updateDownload,
  deleteDownload,
  getFilesAssociated,
};
