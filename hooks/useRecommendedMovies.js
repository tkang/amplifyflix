import { useEffect, useState } from "react";
import _ from "lodash";
import AWS from "aws-sdk";
import MOVIE_ID_TO_TMDB_ID from "../src/movie_id_to_tmdb_id";
import {
  generateTmdbMovieApiUrl,
  generateMoviePosterUrl,
  fetchMovieDatas,
} from "../src/utils";

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
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [currIdx, setCurrIdx] = useState(0);
  const PAGE_SIZE = 4;

  function reloadRecommendations(userId) {
    setRecommendedMovies([]);
    setCurrIdx(0);

    getRecommendations({ userId }).then((items) => {
      console.log(items);
      const recommendedItems = items.map((e) => {
        const tmdbId = MOVIE_ID_TO_TMDB_ID[e.itemId];
        const tmdbUrl = generateTmdbMovieApiUrl(tmdbId);
        return {
          ...e,
          tmdbId,
          tmdbUrl,
        };
      });
      setRecommendations(recommendedItems);
    });
  }

  async function fetchData(startingIdx) {
    const tmdbIds = recommendations
      .slice(startingIdx, startingIdx + PAGE_SIZE)
      .map((e) => e.tmdbId);
    setCurrIdx(startingIdx + PAGE_SIZE);

    fetchMovieDatas(tmdbIds).then((datas) => {
      const l = datas.map((e) => ({
        ...e,
        posterUrl: generateMoviePosterUrl(e.poster_path),
      }));
      setRecommendedMovies([...recommendedMovies, ...l]);
    });
  }

  console.log("recommendedMovies = ", recommendedMovies);

  function loadMore() {
    if (currIdx >= recommendations.length) {
      console.log("reached end!");
      return;
    }
    fetchData(currIdx);
  }

  return { recommendedMovies, loadMore, reloadRecommendations };
}

export default useRecommnededMovies;
