'use strict'

exports.searchAnimeOnNya = async function(title, ep, quality, format) {
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

    // regex to get string that contain TITLE and are not TITLE
    let regexNotStrictQuery = `([a-zA-Z]${title}[a-zA-Z])|(${title}[a-zA-Z0])|([a-zA-Z0]${title})`;
    let regexNotStrict = new RegExp(regexNotStrictQuery, 'gmi');
    // regex to get string that contain EP or 0+EP
    let regexEpisode = new RegExp(`\\D${ep}\\D|\\D0${ep}\\D`,'gmi');
    
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
                // If the matched element isn't strict and match the wanted episode 
                if(name.match(regexNotStrict) && name.match(regexEpisode)) {
                    // If no object have already been found
                    if(!foundObject) {
                        foundObject = {name, dlLink, magnet, strict: false}
                    }
                } 
                // Or it's strict and match the wanted episode
                else if(name.match(regexEpisode)) {
                    foundObject = {name, dlLink, magnet, strict: true}
                    foundWithStrict = true;
                }
            }
        }
    });
    return foundObject;
}