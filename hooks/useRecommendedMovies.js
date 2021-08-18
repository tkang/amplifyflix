import { useEffect, useState } from "react";
import _ from "lodash";
import AWS from "aws-sdk";
import SAMPLE_MOVIE_IDS from "../src/sample_movie_ids.json";

const MOVIE_ID_TO_TMDB_ID = {};
SAMPLE_MOVIE_IDS.forEach(
  (e) => (MOVIE_ID_TO_TMDB_ID[`${e.movieId}`] = e.tmdbId)
);

const TMDB_API_KEY = "ca294fadd74fb6ddb4e74a12e521ceae";
const TMDB_MOVIE_API_URL = "https://api.themoviedb.org/3/movie/";

function generateTmdbMovieApiUrl(tmdbId) {
  return `${TMDB_MOVIE_API_URL}${tmdbId}?api_key=${TMDB_API_KEY}`;
}

async function fetchMovieDatas(tmdbIds) {
  const urls = tmdbIds.map((tmdbId) => generateTmdbMovieApiUrl(tmdbId));
  console.log(urls);
  const responses = await Promise.all(urls.map((url) => fetch(url)));
  const datas = await Promise.all(responses.map((response) => response.json()));
  return datas;
}

async function getRecommendations({ userId, numResults = 48 }) {
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

function useRecommnededMovies() {
  const [recommendedTmdbIds, setRecommendedTmdbIds] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [currIdx, setCurrIdx] = useState(0);
  const SAMPLING_SIZE = 4;

  useEffect(() => {
    reloadRecommendations();
  }, []);

  function reloadRecommendations(userId = "unauthenticated-user") {
    setRecommendedMovies([]);
    setCurrIdx(0);

    getRecommendations({ userId }).then((recommendations) => {
      console.log(recommendations);
      const movieIds = recommendations.map((e) => e.itemId);
      const tmdbIds = movieIds
        .map((movieId) => MOVIE_ID_TO_TMDB_ID[movieId])
        .filter((e) => e !== undefined); // NOTE : some data missing
      setRecommendedTmdbIds(tmdbIds);
    });
  }

  useEffect(() => {
    loadMore();
  }, [recommendedTmdbIds]);

  async function fetchData(startingIdx) {
    const ids = recommendedTmdbIds.slice(
      startingIdx,
      startingIdx + SAMPLING_SIZE
    );
    setCurrIdx(startingIdx + SAMPLING_SIZE);

    fetchMovieDatas(ids).then((datas) => {
      console.log(datas);
      setRecommendedMovies([...recommendedMovies, ...datas]);
    });
  }

  function loadMore() {
    if (currIdx >= recommendedTmdbIds.length) {
      console.log("reached end!");
      return;
    }
    fetchData(currIdx);
    setCurrIdx(currIdx + SAMPLING_SIZE);
  }

  return { recommendedMovies, loadMore, reloadRecommendations };
}

export default useRecommnededMovies;
