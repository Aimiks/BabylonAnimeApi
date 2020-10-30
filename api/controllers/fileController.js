"use strict";

const mongoose = require("mongoose"),
  File = mongoose.model("File");

// =========================================================
// ==================== ASYNC FUNCTIONS ====================
// =========================================================

const getAllFiles = async function () {
  return File.find({}).exec();
};

const createFile = async function (fileParam) {
  const new_file = new File(fileParam);
  return new_file.save();
};

const getFile = async function (fileId) {
  return File.findById(fileId).exec();
};

const updateFile = async function (fileId, newParam) {
  return File.findOneAndUpdate(
    {
      _id: fileId,
    },
    newParam,
    {
      new: true,
    }
  ).exec();
};

const deleteFile = async function (fileId) {
  return File.deleteOne({
    _id: fileId,
  }).exec();
};

module.exports = {
  getAllFiles,
  createFile,
  getFile,
  updateFile,
  deleteFile,
};
