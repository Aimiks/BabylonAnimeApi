import searchAnimeOnNya from './utils/crawlerFunctions';
import downloadFiles from './utils/crawlerFunctions';
var AnimeDAO = require('../api/controllers/animeController');
    AnimeEpisodeDAO = require('../api/controllers/animeEpisodeController'),
    DownloadDAO = require('../api/controllers/downloadController'),
    FileDAO = require('../api/controllers/fileController');

exports.downloadAnimeEpisode = async function(client, animeId, title, ep, quality, format) {
    let animeToSearch = {title, ep, quality, format};
    let objectFound = await searchAnimeOnNya(...animeToSearch);
    if(objectFound !== null) {
        try {
            let dlPromisesObj = downloadFiles(client, objectFound.magnet);
            let files = await dlPromisesObj.filesPromise;
            let animesEpisodes = [];
            // get the anime with the animeId
            let anime = await AnimeDAO.getAnime(animeId);
            files.forEach(file => {
                // create a file
                let fileInfo = {
                    name: file.name,
                    path: file.path,
                    type: file.name.split('.').slice(-1)[0],
                    size: file.length,
                    resolution: typeof quality === String ? 
                    parseInt(quality.replace(new RegExp(/\D/g),'')) : quality
                };
                let file = await FileDAO.createAnime(fileInfo);
                // create a download
                let downloadInfo = {
                    status: "unknown",
                    originalFile: file._id,
                    downloadedFile: null
                };
                let download = await DownloadDAO.createDownload(downloadInfo);
                // create an animeEpisode from the file info 
                //        and ref the anime 
                //        and ref the download
                let animeEpisodeInfo = {
                    episodeNumber: ep,
                    anime: anime._id,
                    download = download._id
                }
                // store it to animeEpisodes
                animesEpisodes.push({
                    fileName: file.name,
                    ep: await AnimeEpisodeDAO.createAnimeEpisode(animeEpisodeInfo)
                });
            });
            // every minutes check file dl progress
            let idIntervalCheckProgress = setInterval( () => {
                files.forEach(file => {
                    // get ep from animesEpisodes
                    let animeEp = animesEpisodes.filter((ep) => ep.fileName === file.name).ep;
                    // update download progress
                    Download.updateDownload(animeEp.download, {progress: file.progress});
                });
            }, 1 * 60 * 1000);
            await dlPromisesObj.downloadDonePromise;
            animesEpisodes.forEach(animeEp => {
                // set the dowload progress to 100%
                //                 status to complete
                Download.updateDownload(animeEp.download, {progress: file.progress, status:'complete'});
                clearInterval(idIntervalCheckProgress);
            });
        } catch(error) {
            console.error(error);
        }

    }
}