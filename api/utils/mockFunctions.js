"use strict";

var mongoose = require("mongoose"),
  Anime = mongoose.model("Anime"),
  AnimeFile = mongoose.model("File"),
  AnimeEpisode = mongoose.model("AnimeEpisode"),
  Download = mongoose.model("Download"),
  clientDLController = require("../../downloader/downloader"),
  animeController = require("../../api/controllers/animeController");

const log = require("../../debug/log").log;

exports.createCompleteAnime = async function () {
  console.log("Creating mock anime...");

  let mockAnimeInfos = {
    romajiName: "Black Clover",
    anilistLink: "https://anilist.co/anime/97940/Black-Clover/",
    imagePath: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/nx97940-cmgkiM9APwu6.jpg",
    episode: [],
    status: "releasing",
  };
  let mockAnime = new Anime({ ...mockAnimeInfos });
  console.log("Saving mock anime...");
  let res = await mockAnime.save().catch((err) => {
    return console.error(err);
  });
  if (res === mockAnime) console.log("Anime saved with success !");
  /*
    console.log("Finding all anime...");
    await Anime.find(function (err, animes) {
        if (err) return console.error(err);
        console.log(animes);
    })

    console.log("Finding mock anime...");
    await Anime.find({romajiName: mockAnimeInfos.romajiName}, function(err, res) {
        if(err) return console.error(err);
        console.log("Anime found with success !");
        console.log(res);
    });*/

  /*console.log("Deleting mock anime...");
    await Anime.deleteOne({romajiName: mockAnimeInfos.romajiName}, function(err) {
        if(err) return console.error(err);
        console.log("Deleted with success ! ");
    });*/

  console.log("Creating mock torrent file...");
  let mockTorrentFileInfos = {
    name: "mock torrent file",
    path: "/path/to/mock",
    type: "torrent",
    size: 1048,
  };

  let mockTorrentFile = new AnimeFile({ ...mockTorrentFileInfos });

  console.log("Saving mock file...");
  res = await mockTorrentFile.save().catch((err) => {
    return console.error(err);
  });
  if (res === mockTorrentFile) console.log("Torrent file saved with success !");

  console.log("Creating mock download...");
  let downloadFileInfos = {
    status: "unknown",
    originalFile: mockTorrentFileInfos._id,
  };

  let mockDownload = new Download({ ...downloadFileInfos });

  console.log("Saving mock download...");
  res = await mockDownload.save().catch((err) => {
    return console.error(err);
  });
  if (res === mockDownload) console.log("Download saved with success !");

  console.log("Creating mock anime file...");
  let animeFileInfos = {
    name: "mock anime file",
    path: "/path/to/anime/mock",
    type: "mkv",
    size: 10559,
  };

  let mockAnimeFile = new File({ ...animeFileInfos });

  console.log("Saving mock anime file...");
  res = await mockAnimeFile.save().catch((err) => {
    return console.error(err);
  });
  if (res === mockAnimeFile) console.log("Anime file saved with success !");

  res = await Download.updateOne(
    { _id: mockDownload._id },
    {
      downloadedFile: mockAnimeFile._id,
      fileQuality: "1080p",
      status: "finished",
    }
  ).catch((err) => {
    if (err) return console.error(err);
  });
  console.log("Download updated with success !");

  console.log("Creating mock anime episode...");
  let mockAnimeEpisodeInfos = {
    episodeNumber: 139,
    anime: mockAnime._id,
    download: mockDownload._id,
  };

  let mockAnimeEpisode = new AnimeEpisode({ ...mockAnimeEpisodeInfos });

  console.log("Saving mock anime file...");
  res = await mockAnimeEpisode.save().catch((err) => {
    return console.error(err);
  });
  if (res === mockAnimeEpisode) console.log("Anime episode file saved with success !");

  res = await Anime.updateOne({ _id: mockAnime._id }, { $push: { episode: mockAnimeEpisode._id } }).catch((err) => {
    if (err) return console.error(err);
  });

  let animeFromBDD = await Anime.findById(mockAnime._id).exec();
  let episodeFromBDD = await AnimeEpisode.findById(mockAnimeEpisode._id).exec();
  let downloadFromBDD = await Download.findById(mockDownload._id).exec();
  let torrentFileFromBDD = await File.findById(mockTorrentFile._id).exec();
  let animeFileFromBDD = await File.findById(mockAnimeFile._id).exec();

  console.log("---- Results ----");
  console.log(animeFromBDD);
  console.log(episodeFromBDD);
  console.log(downloadFromBDD);
  console.log(torrentFileFromBDD);
  console.log(animeFileFromBDD);

  await Anime.deleteOne({ _id: mockAnime._id }).exec();
  await AnimeEpisode.deleteOne({ _id: mockAnimeEpisode._id }).exec();
  await Download.deleteOne({ _id: mockDownload._id }).exec();
  await File.deleteOne({ _id: mockTorrentFile._id }).exec();
  await File.deleteOne({ _id: mockAnimeFile._id }).exec();
};

exports.downloadAnimeEpisode = async function (client) {
  log("Begin");
  await Anime.deleteMany({}).exec();
  await AnimeEpisode.deleteMany({}).exec();
  await Download.deleteMany({}).exec();
  await AnimeFile.deleteMany({}).exec();
  let mockAnimeInfos = {
    romajiName: "Dogeza de Tanondemita",
    anilistLink: "https://anilist.co/anime/97940/Black-Clover/",
    imagePath: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/nx97940-cmgkiM9APwu6.jpg",
    episode: [],
    status: "releasing",
  };
  log("Creating anime");
  let mockAnime = await animeController.createAnime(mockAnimeInfos);
  const mockAnimeFilter = {
    animeId: mockAnime._id,
    title: "Dogeza de Tanondemita",
    ep: 3,
    quality: 480,
    format: "mkv",
    lang: "Multiple+Subtitle",
  };
  log("Downloading anime...");
  await clientDLController.downloadAnimeEpisode(
    client,
    mockAnimeFilter.animeId,
    mockAnimeFilter.title,
    mockAnimeFilter.ep,
    mockAnimeFilter.quality,
    mockAnimeFilter.format,
    mockAnimeFilter.lang
  );
  //log(await animeController.getAllAnimes());
  log("End");
};
