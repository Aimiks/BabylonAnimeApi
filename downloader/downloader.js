const AnimeDAO = require('../api/controllers/animeController'),
    AnimeEpisodeDAO = require('../api/controllers/animeEpisodeController'),
    DownloadDAO = require('../api/controllers/downloadController'),
    FileDAO = require('../api/controllers/fileController'),
    {searchAnimeOnNya} = require('./utils/scrapperFunctions'),
    {downloadFiles} = require('./utils/torrentFunctions'),
    {asyncForEach} = require('./utils/asyncFunctions'); 

exports.downloadAnimeEpisode = async function(client, animeId, title, ep, quality, format) {
    console.log("[downloadAnimeEpisode] - Searching anime on Nya...");
    try {
        let objectFound = await searchAnimeOnNya(title,ep,quality,format);
        if(objectFound !== null) {
            console.log("[downloadAnimeEpisode] - Anime found !");
                let dlPromisesObj = downloadFiles(client, objectFound.magnet);
                console.log("[downloadAnimeEpisode] - Waiting files meta-data");
                let files = await dlPromisesObj.filesPromise;
                let animesEpisodes = [];
                // get the anime with the animeId
                console.log("[downloadAnimeEpisode] - Getting anime from animeId");
                let anime = await AnimeDAO.getAnime(animeId);
                await asyncForEach(files,async (file) => {
                    // create a file
                    let fileInfo = {
                        name: file.name,
                        path: file.path,
                        type: file.name.split('.').slice(-1)[0],
                        size: file.length,
                        resolution: typeof quality === String ? 
                        parseInt(quality.replace(new RegExp(/\D/g),'')) : quality
                    };
                    console.log("[downloadAnimeEpisode] - Creating a file");
                    let realFile = await FileDAO.createFile(fileInfo);
                    // create a download
                    let downloadInfo = {
                        status: "unknown",
                        originalFile: realFile._id,
                        downloadedFile: null
                    };
                    console.log("[downloadAnimeEpisode] - Creating a download");
                    let download = await DownloadDAO.createDownload(downloadInfo);
                    // create an animeEpisode from the file info 
                    //        and ref the anime 
                    //        and ref the download
                    let animeEpisodeInfo = {
                        episodeNumber: ep,
                        anime: anime._id,
                        download: download._id
                    }
                    // store it to animeEpisodes
                    console.log("[downloadAnimeEpisode] - Creating an anime ep");
                    let animeEp = await AnimeEpisodeDAO.createAnimeEpisode(animeEpisodeInfo);
                    animesEpisodes.push({
                        fileName: file.name,
                        ep: animeEp
                    });
                });
                // every minutes check file dl progress
                let idIntervalCheckProgress = setInterval( () => {
                    files.forEach(file => {
                        console.log("[downloadAnimeEpisode] - Updating progress of download");
                        // get ep from animesEpisodes
                        let animeEp = animesEpisodes.filter((ep) => ep.fileName === file.name).ep;
                        // update download progress
                        console.log("[downloadAnimeEpisode] - progress : "+file.progress);
                        DownloadDAO.updateDownload(animeEp.download, {progress: file.progress});
                    });
                }, 1 * 60 * 1000);
                console.log("[downloadAnimeEpisode] - Waiting end of the download(s)");
                await dlPromisesObj.downloadDonePromise;
                animesEpisodes.forEach(animeEp => {
                    // set the dowload progress to 100%
                    //                 status to complete
                    console.log("[downloadAnimeEpisode] - Set downloads status to complete");
                    DownloadDAO.updateDownload(animeEp.download, {progress: file.progress, status:'complete'});
                    clearInterval(idIntervalCheckProgress);
                });

        } else {
            console.log("[downloadAnimeEpisode] - Anime not found !");
        }
    } catch(error) {
        console.error(error);
        throw error;
    }
}