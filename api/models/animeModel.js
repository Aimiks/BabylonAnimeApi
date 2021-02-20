"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnimeSchema = new Schema({
  id: Number,
  episodes: [{ type: Schema.Types.ObjectId, ref: "AnimeEpisode" }],
});

module.exports = mongoose.model("Anime", AnimeSchema);
