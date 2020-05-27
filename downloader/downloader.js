import searchAnimeOnNya from './utils/crawlerFunctions';
import downloadFiles from './utils/crawlerFunctions';


exports.downloadAnimeEpisodes = async function(client, animeId, title, ep, quality, format) {
    // Foreach anime in the filter
    let mockAnime = {
        title: 'One piece',
        ep: 761,
        quality: '1080p',
        format: 'mkv'
    }

    let objectFound = await searchAnimeOnNya(...mockAnime);
    if(objectFound !== null) {
        let dlPromisesObj = downloadFiles(client, objectFound.magnet);
        let files = await dlPromisesObj.filesPromise;
        let animesEpisodes = [];
        files.forEach(file => {
            // get the anime with the animeId
            // create a download
            // create an animeEpisode from the file info 
            //        and ref the anime 
            //        and ref the download
            // store it to animeEpisodes
        });
        // every minutes check file dl progress
        let idIntervalCheckProgress = setInterval( () => {
            files.forEach(file => {
                // get ep from animesEpisodes
                // update download progress
            });
        }, 1 * 60 * 1000);
        await dlPromisesObj.downloadDonePromise
        animesEpisodes.forEach(animesEp => {
            // set the dowload progress to 100%
            //                    status to complete
        });

    }
}