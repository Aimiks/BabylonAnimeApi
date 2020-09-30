'use strict'

const getValidFiles = function(torrent) {
    // .ass are the subtitles
    let validExt = [".mp4",".mkv",".ass"];
    function rightExtensions(name) {
        let isOk = false;
        validExt.forEach(ext => {
            if(!isOk && name.endsWith(ext)) {
                isOk = true;
            }
        });
        return isOk;
    }
    return torrent.files.filter((f) => rightExtensions(f.name));
}

/**
 * Start downloading torrent files from magnet
 * @param client : torrent client
 * @param magnet : torrent magnet
 * @return : filesPromise = files that are being downloaded | downloadDonePromise = when all dl are done or rejected on error
 */ 
exports.downloadFiles = function(client, magnet) {
    let torrent = client.add(magnet, {path:'/#Dev/AnimeDownloaderServer/BabylonAnimeApi/files'});
    let promises = {filesPromise:null, downloadDonePromise:null};

    promises.filesPromise = new Promise( (resolve) => {
        torrent.on('ready', function() {
            torrent.files.forEach(f => f.deselect());
            torrent.deselect(0,torrent.pieces.length-1,false);
            let validFiles = getValidFiles(torrent);
            validFiles.forEach(f => {
                torrent.select(f._startPiece, f._endPiece, false);
            });
            resolve(validFiles);
        });
    });
    promises.downloadDonePromise = new Promise( (resolve, reject) => {
        torrent.on('done', function() {
            resolve(true);
        });
        torrent.on('error', function(err) {
            reject(err);
        });
    });

    return promises;
}