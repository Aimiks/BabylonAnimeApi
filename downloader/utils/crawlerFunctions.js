'use strict'

exports.searchAnimeOnNya = async function(title, ep, quality, format) {
    let v = require('./verifyFunctions');
    /**
     * TODO : Search for multi-lang
     */

    /* Building the query */
    let query = title.replace(/\s/gmi,"+");
    query += '+' + ep;
    query += quality ? '+' + quality : '';
    query += format ? '+' + format : '';
    // Only Non-English-Translated
    let category = '1_2';

    
    /* Fetching Nya */
    let opt = {
        method: 'GET'
    }
    let domain = 'https://nyaa.si';
    let response, html; 
    try {
        response = await fetch(`${domain}/?f=1&c=${category}&q=${query}&p=1&o=desc&s=seeders`, opt);
        html = await response.text();
    } catch(error) {
        throw error;
    }

    let tr = $(html).find("table:first-child tbody tr");
    // Used to avoid/allow searching deeper when we already have a wanted result
    let foundWithStrict = false;
    let foundObject = null;
    $(tr).each(function() {
        if(!foundWithStrict) {
            let name = $(this).find("td:nth-child(2) a:not(.comments)").text();
            let dlLink = domain + $(this).find("td:nth-child(3) a:nth-child(2)").attr("href");
            let magnet = $(this).find("td:nth-child(3) a:nth-child(2)").attr("href");
            if(name) {
                let score = v.getMatchingScore(name,title,ep);
                // If the matched element isn't strict and match the wanted episode 
                if(score === 1) {
                    // If no object have already been found
                    if(!foundObject) {
                        foundObject = {name, dlLink, magnet, strict: false}
                    }
                } 
                // Or it's strict and match the wanted episode
                else if(score === 3) {
                    foundObject = {name, dlLink, magnet, strict: true}
                    foundWithStrict = true;
                }
            }
        }
    });
    return foundObject;
}