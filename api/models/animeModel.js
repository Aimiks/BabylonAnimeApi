"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnimeSchema = new Schema({
  romajiName: String,
  anilistId: Number,
  imagePath: String,
  episode: [{ type: Schema.Types.ObjectId, ref: "AnimeEpisode" }],
  status: { type: String, enum: ["RELEASING", "FINISHED", "UNKNOWN"] },
});

module.exports = mongoose.model("Anime", AnimeSchema);
