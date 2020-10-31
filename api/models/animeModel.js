"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnimeSchema = new Schema({
  id: Number,
  episode: [{ type: Schema.Types.ObjectId, ref: "AnimeEpisode" }],
});

module.exports = mongoose.model("Anime", AnimeSchema);
