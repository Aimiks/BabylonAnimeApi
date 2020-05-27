'use strict'

exports.getValidFiles = function(torrent) {
    // .ass are the subtitles
    let validExt = [".mp4",".mkv",".ass"];
    function rightExtensions(name) {
        let isOk = false;
        validExt.forEach(ext => {
            if(name.endsWith(ext)) {
                isOk = true;
                break;
            }
        });
        return isOk;
    }
    return torrent.filter((f) => rightExtensions(f.name));
}

exports.downloadFiles = function(client, magnet) {
    let torrent = client.add(magnet);
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