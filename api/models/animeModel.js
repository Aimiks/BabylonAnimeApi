"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnimeSchema = new Schema({
  romajiName: String,
  anilistLink: String,
  imagePath: String,
  episode: [{ type: Schema.Types.ObjectId, ref: "AnimeEpisode" }],
  status: { type: String, enum: ["releasing", "finished", "unknown"] },
});

module.exports = mongoose.model("Anime", AnimeSchema);
