"use strict";

const mongoose = require("mongoose"),
  File = mongoose.model("File");

// =========================================================
// ==================== ASYNC FUNCTIONS ====================
// =========================================================

const getAllFiles = async function () {
  return new Promise((resolve, reject) => {
    File.find({}, function (err, file) {
      if (err) reject(err);
      resolve(file);
    });
  });
};

const createFile = async function (fileParam) {
  return new Promise((resolve, reject) => {
    var new_file = new File(fileParam);
    new_file.save(function (err, file) {
      if (err) reject(err);
      resolve(file);
    });
  });
};

const getFile = async function (fileId) {
  return new Promise((resolve, reject) => {
    File.findById(fileId, function (err, file) {
      if (err) reject(err);
      resolve(file);
    });
  });
};

const updateFile = async function (fileId, newParam) {
  return new Promise((resolve, reject) => {
    File.findOneAndUpdate(
      {
        _id: fileId,
      },
      newParam,
      {
        new: true,
      },
      function (err, file) {
        if (err) reject(err);
        resolve(file);
      }
    );
  });
};

const deleteFile = async function (fileId) {
  return new Promise((resolve, reject) => {
    File.deleteOne(
      {
        _id: fileId,
      },
      function (err) {
        if (err) reject(err);
        resolve(true);
      }
    );
  });
};

module.exports = {
  getAllFiles,
  createFile,
  getFile,
  updateFile,
  deleteFile,
};
