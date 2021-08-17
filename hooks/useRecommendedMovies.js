import SAMPLE_TMDB_IDS from "../src/sample_tmdb_ids";
import { useEffect, useState } from "react";
import _ from "lodash";

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

function useRecommnededMovies() {
  const [tmdbIds, setTmdbIds] = useState(_.shuffle(SAMPLE_TMDB_IDS));
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [currIdx, setCurrIdx] = useState(0);
  const SAMPLING_SIZE = 4;

  useEffect(() => {
    fetchData(currIdx);
  }, []);

  async function fetchData(startingIdx) {
    const ids = tmdbIds.slice(startingIdx, startingIdx + SAMPLING_SIZE);
    setCurrIdx(startingIdx + SAMPLING_SIZE);

    fetchMovieDatas(ids).then((datas) => {
      console.log(datas);
      setRecommendedMovies([...recommendedMovies, ...datas]);
    });
  }

  function loadMore() {
    const nextIdx = Math.min(tmdbIds.length - 1, currIdx + SAMPLING_SIZE);
    if (nextIdx === currIdx) return;

    fetchData(nextIdx);
    setCurrIdx(nextIdx);
  }

  return { recommendedMovies, loadMore };
}

export default useRecommnededMovies;
