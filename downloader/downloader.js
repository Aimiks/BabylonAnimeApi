/*const AnimeDAO = require("../api/controllers/animeController"),
  AnimeEpisodeDAO = require("../api/controllers/animeEpisodeController"),
  DownloadDAO = require("../api/controllers/downloadController"),
  FileDAO = require("../api/controllers/fileController"),*/
const { searchAnimeOnNya, searchAnimeOnNyaEnhanced } = require("./utils/scrapperFunctions"),
  { downloadFiles } = require("./utils/torrentFunctions"),
  { asyncForEach } = require("./utils/asyncFunctions"),
  log = require("../debug/log").log,
  anilist = require("../services/anilist"),
  { getLastEpisodeUp } = require("./utils/animesFunctions");

const ctrl = require("../prisma/controllers/all");

let current_downloading = {};

exports.startDownload = function (client) {
  tryDownloadAnimes(client);
  setInterval(() => tryDownloadAnimes(client), 1 * 1000 * 60);
};

let tryDownloadAnimes = async function (client) {
  log("Try downloading");
  // Get all animes that needs to be downloaded
  const animes = await ctrl.anime.getAll();
  // Get all the infos form anilist
  const animesInfos = await anilist.getAnimes(animes.map((a) => a.id));
  const animesRequest = [];
  await asyncForEach(animesInfos, async (a) => {
    let wantedEpisodesList = [];
    const MAX_EP = a.nextAiringEpisode ? a.nextAiringEpisode.episode : a.episodes;
    let downloadedEp = (await ctrl.anime.getEpisodes(a.id)).episodes.map((e) => e.episodeNumber);
    // This check allow us to not trying to dowload ep
    // that are / will be tried
    if (current_downloading[a.id]) {
      let tmp = [...downloadedEp];
      tmp.push(...current_downloading[a.id]);
      downloadedEp = [...new Set(tmp)];
    }
    if (MAX_EP < 24) {
      if (downloadedEp.length) {
        wantedEpisodesList = Array.from({ length: MAX_EP }, (v, k) =>
          downloadedEp.findIndex((de) => de == k + 1) > -1 ? 0 : k + 1
        ).filter((ep) => ep !== 0);
      } else {
        wantedEpisodesList = Array.from({ length: MAX_EP }, (v, k) => k + 1);
      }
    } else {
      let t_ep = getLastEpisodeUp(a).episode;
      if (downloadedEp.findIndex((de) => de == t_ep) === -1) {
        wantedEpisodesList.push(t_ep);
      }
    }
    if (wantedEpisodesList.length) {
      animesRequest.push({
        id: a.id,
        title: [a.title.romaji, ...a.synonyms, a.title.english],
        wantedEp: wantedEpisodesList,
        quality: 1080,
        format: ["mkv", "mp4"],
        lang: "VOSTFR",
      });
    }
  });
  downloadMultipleAnimesEpisodes(client, animesRequest);
};

// TODO : Make a function that search multiple episodes in one download

let downloadMultipleAnimesEpisodes = async function (client, animesRequest) {
  let promisesList = [];
  animesRequest.forEach(async (an) => {
    try {
      if (typeof current_downloading[an.id] === "undefined") {
        current_downloading[an.id] = [...an.wantedEp];
      } else {
        current_downloading[an.id].push(...an.wantedEp);
      }
      asyncForEach(an.wantedEp, async (ep) => {
        await downloadAnimeEpisode(client, an.id, an.title, ep, an.quality, an.format, an.lang);
        current_downloading[an.id] = current_downloading[an.id].filter((e) => e === ep);
      });
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  });
  //let results = await Promise.allSettled(promisesList);
  //return results;
};

let downloadAnimeEpisode = async function (client, animeId, title, ep, quality, format, lang) {
  /*
   * Only 1 episode is allowed
   * But multiple files for this episode is allowed
   */
  let animeFound = false;
  const titleStr = Array.isArray(title) ? title[0] : title;

  log(`[${titleStr} - ${ep}] Searching anime on Nya...`);
  try {
    let objectFound = await searchAnimeOnNyaEnhanced(title, ep, quality, format, lang);
    if (objectFound !== null) {
      animeFound = true;
      log(`[${titleStr} - ${ep}] Anime found !`);
      let dlPromisesObj = downloadFiles(client, objectFound.magnet, titleStr);
      log(`[${titleStr} - ${ep}] Waiting files meta-data`);
      /* ============================================================================
       * Files Meta Data READY
        ==============================================================================*/
      let files = await dlPromisesObj.filesPromise;
      let animesEpisodeFiles = [];
      // get the anime with the animeId
      log(`[${titleStr} - ${ep}] Getting anime from animeId`);
      let anime = await ctrl.anime.get(animeId);
      // create an animeEpisode from the file info
      let animeEpisodeInfo = {
        episodeNumber: ep,
      };
      let animeEp = await ctrl.animeepisode.create(animeEpisodeInfo);
      log(`[${titleStr} - ${ep}] Creating an anime ep`);
      await ctrl.anime.addEpisode(animeId, animeEp.id);
      let downloadByFiles = [];
      /* ============================================================================
       * Creation of download, files and update progress
        ==============================================================================*/
      await asyncForEach(files, async (file) => {
        // create a download
        let downloadInfo = {
          status: "UNKNOWN",
        };
        log(`[${titleStr} - ${ep}] Creating a download`);
        let download = await ctrl.download.create(downloadInfo);
        // Add the download to the current ep
        await ctrl.animeepisode.addDownload(animeEp.id, download.id);
        // store it to animeEpisodes
        animesEpisodeFiles.push({
          fileName: file.name,
          ep: animeEp,
        });
        downloadByFiles.push({ file, downloadId: download.id });
      });
      // every minutes check file dl progress
      let idIntervalCheckProgress = setInterval(() => {
        downloadByFiles.forEach((obj) => {
          // update download progress
          log(`[${titleStr} - ${ep}] progress : ` + obj.file.progress);
          ctrl.download.update(obj.downloadId, {
            progress: obj.file.progress,
          });
        });
      }, 10 * 1000);

      log(`[${titleStr} - ${ep}] Waiting end of the download(s)`);
      /* ============================================================================
       * Download DONE !
        ==============================================================================*/
      await dlPromisesObj.downloadDonePromise;
      clearInterval(idIntervalCheckProgress);
      downloadByFiles.forEach(async (obj) => {
        try {
          log(`[${titleStr} - ${ep}] Creating a file`);
          let file = obj.file;
          // create a file
          let fileInfo = {
            name: file.name,
            path: file.path,
            type: file.name.split(".").slice(-1)[0],
            size: file.length,
            resolution: typeof quality === String ? parseInt(quality.replace(new RegExp(/\D/g), "")) : quality,
          };
          let realFile = await ctrl.file.create(fileInfo);
          // set the dowload progress to 100%
          //                    status to complete
          log(`[${titleStr} - ${ep}] Set downloads status to complete`);
          await ctrl.download.update(obj.downloadId, {
            progress: 1,
            status: "COMPLETE",
            downloadedFileId: realFile.id,
          });
        } catch (e) {
          console.error(e);
        }
      });
    } else {
      log(`[${titleStr} - ${ep}] Anime not found !`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
  return animeFound;
};
