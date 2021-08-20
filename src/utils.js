import AWS from "aws-sdk";

const TMDB_API_KEY = "ca294fadd74fb6ddb4e74a12e521ceae";
const TMDB_MOVIE_API_URL = "https://api.themoviedb.org/3/movie/";
const TMDB_MOVIE_POSTER_PATH = "https://image.tmdb.org/t/p/original/";

export function generateTmdbMovieApiUrl(tmdbId) {
  return `${TMDB_MOVIE_API_URL}${tmdbId}?api_key=${TMDB_API_KEY}`;
}

export function generateMoviePosterUrl(posterPath) {
  return `${TMDB_MOVIE_POSTER_PATH}${posterPath}`;
}

export async function fetchMovieDatas(tmdbIds) {
  const urls = tmdbIds.map((tmdbId) => generateTmdbMovieApiUrl(tmdbId));
  console.log(urls);
  const responses = await Promise.all(urls.map((url) => fetch(url)));
  const datas = await Promise.all(responses.map((response) => response.json()));
  return datas;
}

export async function getRecommendations({ userId, numResults = 48 }) {
  const personalizeParams = {
    campaignArn:
      "arn:aws:personalize:ap-northeast-2:652351719285:campaign/movie-recommendations",
    numResults,
    userId,
  };

  const personalizeRuntime = new AWS.PersonalizeRuntime();

  const data = await personalizeRuntime
    .getRecommendations(personalizeParams)
    .promise();
  const itemList = data.itemList;
  return itemList;
}
