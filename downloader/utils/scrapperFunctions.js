"use strict";

exports.searchAnimeOnNya = async function (title, ep, quality = 480, format = "", lang = "VOSTFR") {
  let v = require("./verifyFunctions");
  const fetch = require("node-fetch");
  const cheerio = require("cheerio");
  const log = require("../../debug/log").log;

  /**
   * TODO : Search for multi-lang
   */

  /* Building the query */
  title = title.replace(/\s/gim, "+");
  format = format.replace(/\s/gim, "+");
  lang = lang.replace(/\s/gim, "+");

  let query = title;
  query += "+" + ep;
  query += quality ? "+" + quality : "";
  query += format ? "+" + format : "";
  query += lang ? "+" + lang : "";
  // Only Non-English-Translated
  let category = "1_2";

  /* Fetching Nya */
  let opt = {
    method: "GET",
  };
  let domain = "https://nyaa.si";
  let response, html;
  log("=== Fetching nya ===");
  log("> Query : " + query);
  log("> FullQuery : " + `${domain}/?f=1&c=${category}&q=${query}&p=1&o=desc&s=seeders`);
  log("====================");
  try {
    response = await fetch(`${domain}/?f=1&c=${category}&q=${query}&p=1&o=desc&s=seeders`, opt);
    html = await response.text();
  } catch (error) {
    throw error;
  }
  const $ = cheerio.load(html);

  let tr = $(html).find("table:first-child tbody tr");
  // Used to avoid/allow searching deeper when we already have a wanted result
  let foundWithStrict = false;
  let foundObject = null;
  $(tr).each(function () {
    if (!foundWithStrict) {
      let name = $(this).find("td:nth-child(2) a:not(.comments)").text();
      let dlLink = domain + $(this).find("td:nth-child(3) a:nth-child(2)").attr("href");
      let magnet = $(this).find("td:nth-child(3) a:nth-child(2)").attr("href");
      if (name) {
        let score = v.getMatchingScore(name, title, ep);
        // If the matched element isn't strict and match the wanted episode
        if (score === 1) {
          // If no object have already been found
          if (!foundObject) {
            foundObject = { name, dlLink, magnet, strict: false };
          }
        }
        // Or it's strict and match the wanted episode
        else if (score === 3) {
          foundObject = { name, dlLink, magnet, strict: true };
          foundWithStrict = true;
        }
      }
    }
  });
  return foundObject;
};

exports.searchAnimeOnNyaEnhanced = async function (titles, ep, quality, format, lang) {
  let v = require("./verifyFunctions");
  const fetch = require("node-fetch");
  const cheerio = require("cheerio");
  const log = require("../../debug/log").log;

  let query = "";
  /* Building the query */
  if (Array.isArray(titles)) {
    query += "(" + titles.join(")|(") + ")" + " " + ep + " " + lang + " " + quality;
  } else {
    query += title;
    query += " " + ep;
    query += quality ? " " + quality : "";
    query += format ? " " + format : "";
    query += lang ? " " + lang : "";
  }
  query = encodeURIComponent(query).replace(/%20/g, "+");
  // Only Non-English-Translated
  let category = "1_3";

  /* Fetching Nya */
  let opt = {
    method: "GET",
  };
  let domain = "https://nyaa.si";
  let response, html;
  log("Fetching nya...");
  log("> Query : " + query);
  log("> FullQuery : " + `${domain}/?f=1&c=${category}&q=${query}&p=1&o=desc&s=seeders`);
  try {
    response = await fetch(`${domain}/?f=1&c=${category}&q=${query}&p=1&o=desc&s=seeders`, opt);
    html = await response.text();
  } catch (error) {
    throw error;
  }
  const $ = cheerio.load(html);

  let tr = $(html).find("table:first-child tbody tr");
  // Used to avoid/allow searching deeper when we already have a wanted result
  let foundWithStrict = false;
  let foundObject = null;
  $(tr).each(function () {
    if (!foundWithStrict) {
      let name = $(this).find("td:nth-child(2) a:not(.comments)").text();
      let dlLink = domain + $(this).find("td:nth-child(3) a:nth-child(2)").attr("href");
      let magnet = $(this).find("td:nth-child(3) a:nth-child(2)").attr("href");
      if (name) {
        let score = v.getMatchingScore(name, titles, ep);
        // If the matched element isn't strict and match the wanted episode
        if (score === 1) {
          // If no object have already been found
          if (!foundObject) {
            foundObject = { name, dlLink, magnet, strict: false };
          }
        }
        // Or it's strict and match the wanted episode
        else if (score === 3) {
          foundObject = { name, dlLink, magnet, strict: true };
          foundWithStrict = true;
        }
      }
    }
  });
  if (foundObject) {
    log("Found : " + foundObject.name);
  }
  return foundObject;
};
