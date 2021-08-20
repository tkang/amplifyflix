import USER_ACTIONS from "./user_actions.json";
import MOVIE_ID_TO_TMDB_ID from "./movie_id_to_tmdb_id";
import { generateTmdbMovieApiUrl, generateMoviePosterUrl } from "./utils";

const USER_ACTIONS_BY_USER_ID = {};
USER_ACTIONS.forEach((e) => {
  const key = `${e.userId}`;
  if (!USER_ACTIONS_BY_USER_ID[key]) USER_ACTIONS_BY_USER_ID[key] = [];

  const tmdbId = MOVIE_ID_TO_TMDB_ID[e.itemId];
  const tmdbUrl = generateTmdbMovieApiUrl(tmdbId);

  USER_ACTIONS_BY_USER_ID[key].push({
    itemId: e.itemId,
    timestamp: e.timestamp,
    tmdbId,
    tmdbUrl,
  });
});

export default USER_ACTIONS_BY_USER_ID;
