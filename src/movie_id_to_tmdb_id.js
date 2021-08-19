import SAMPLE_MOVIE_IDS from "../src/sample_movie_ids.json";

const MOVIE_ID_TO_TMDB_ID = {};
SAMPLE_MOVIE_IDS.forEach(
  (e) => (MOVIE_ID_TO_TMDB_ID[`${e.movieId}`] = e.tmdbId)
);

export default MOVIE_ID_TO_TMDB_ID;
