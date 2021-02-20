"use strict";

const matchStrict = function (string, wantedString) {
  // regex to get string that contain TITLE and are not TITLE
  let regexNotStrict = new RegExp(
    `([a-zA-Z]${wantedString}[a-zA-Z])|(${wantedString}[a-zA-Z0])|([a-zA-Z0]${wantedString})`,
    "gmi"
  );
  return !(string.match(regexNotStrict) && string.match(regexNotStrict).length > 0);
};

const matchEpisode = function (string, wantedEpisode) {
  // regex to get string that contain EP or 0+EP
  let regexEpisode = new RegExp(`\\D${wantedEpisode}\\D|\\D0${wantedEpisode}\\D`, "gmi");
  return string.match(regexEpisode) && string.match(regexEpisode).length > 0;
};

/**
 * Get the matching score
 * 0 : no match | 1 : ep match | 2 : string match | 3 : ep & string match
 */
const getMatchingScore = function (strings, wantedString, wantedEpisode) {
  let ms = 0,
    me = 0;
  if (Array.isArray(strings)) {
    strings.forEach((s) => {
      let t_ms = matchStrict(s, wantedString) * 2;
      let t_me = matchEpisode(s, wantedEpisode) * 1;
      if (t_ms > ms) {
        ms = t_ms;
      }
      if (t_me > me) {
        me = t_me;
      }
    });
  } else {
    ms = matchStrict(strings, wantedString) * 2;
    me = matchEpisode(strings, wantedEpisode) * 1;
  }
  return ms + me;
};

module.exports = { matchStrict, matchEpisode, getMatchingScore };
