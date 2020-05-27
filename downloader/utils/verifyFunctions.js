'use strict'

exports.matchStrict = function(string, wantedString) {
    // regex to get string that contain TITLE and are not TITLE
    let regexNotStrict = new RegExp(`([a-zA-Z]${wantedString}[a-zA-Z])|(${wantedString}[a-zA-Z0])|([a-zA-Z0]${wantedString})`, 'gmi');
    return !string.match(regexNotStrict);
}

exports.matchEpisode = function(string, wantedEpisode) {
    // regex to get string that contain EP or 0+EP
    let regexEpisode = new RegExp(`\\D${wantedEpisode}\\D|\\D0${wantedEpisode}\\D`,'gmi');
    return string.match(regexEpisode);
}

/**
 * Get the matching score
 * 0 : no match | 1 : ep match | 2 : string match | 3 : ep & string match
 */
exports.getMatchingScore = function(string, wantedString, wantedEpisode) {
    let ms = matchStrict(string,wantedString) * 2;
    let me = matchEpisode(string,wantedEpisode) * 1;
    return ms + me;
}
