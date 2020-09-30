"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WantedAnimeSchema = new Schema({
  anime: { type: Schema.Types.ObjectId, ref: "Anime" },
});

module.exports = mongoose.model("WantedAnime", WantedAnimeSchema);
