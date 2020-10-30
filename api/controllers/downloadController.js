"use strict";

const mongoose = require("mongoose"),
  Download = mongoose.model("Download");

// =========================================================
// ==================== ASYNC FUNCTIONS ====================
// =========================================================

const getAllDownloads = async function () {
  return Download.find({}).exec();
};

const createDownload = async function (downloadParam) {
  const new_download = new Download(downloadParam);
  return new_download.save();
};

const getDownload = async function (downloadId) {
  return Download.findById(downloadId).exec();
};

const updateDownload = async function (downloadId, newParam) {
  return Download.findOneAndUpdate(
    {
      _id: downloadId,
    },
    newParam,
    {
      new: true,
    }
  ).exec();
};

const deleteDownload = async function (downloadId) {
  return Download.deleteOne({
    _id: downloadId,
  }).exec();
};

const getFilesAssociated = async function (downloadId) {
  try {
    const dlFiles = getDownload(downloadId);
    return Promise.resolve(dlFiles);
  } catch (e) {
    return Promise.reject(e);
  }
};

module.exports = {
  getAllDownloads,
  createDownload,
  getDownload,
  updateDownload,
  deleteDownload,
  getFilesAssociated,
};
