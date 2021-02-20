const config = require("../config");
const fetch = require("node-fetch");

global.Headers = global.Headers || require("node-fetch").Headers;

const anilist = {};
const def_headers = new Headers({
  "Content-Type": "application/json",
  Accept: "application/json",
});
const def_options = {
  method: "POST",
  cache: "no-cache",
  credentials: "same-origin",
  headers: def_headers,
};

anilist.getAnimes = async function (ids) {
  if (Array.isArray(ids) === false) {
    ids = [ids];
  }
  const variables = {
    idPage: 0,
    perPage: ids.length,
    ids,
  };
  const query = `
  query ($idPage: Int, $perPage: Int, $ids: [Int]) {
    Page (page: $idPage, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media (id_in:$ids, type:ANIME, isAdult: false) {
          id
          title {
            romaji
            english
            native
          },
          status,
          nextAiringEpisode {
          timeUntilAiring
          airingAt
          episode
          }
          airingSchedule {
            nodes {
              episode
              airingAt
            }
          }
          episodes,
          synonyms
        }
     }
   }`;
  const options = { ...def_options };
  options.body = JSON.stringify({
    query: query,
    variables: variables,
  });
  let res = [];
  try {
    const response = await fetch(config.ANILIST_API_URL, options);
    const json = await response.json();
    if (json.data && json.data.Page && json.data.Page.media) {
      res = json.data.Page.media;
    }
  } catch (e) {
    throw e;
  }
  return res;
};

module.exports = anilist;
