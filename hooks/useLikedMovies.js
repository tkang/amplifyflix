import { useEffect, useState } from "react";
import USER_ACTIONS_BY_USER_ID from "../src/user_actions_by_user_id";
import {
  generateTmdbMovieApiUrl,
  generateMoviePosterUrl,
  fetchMovieDatas,
} from "../src/utils";

function useLikedMovies() {
  const [userActions, setUserActions] = useState([]);
  const [currIdx, setCurrIdx] = useState(0);
  const [likedMovies, setLikedMovies] = useState([]);

  const PAGE_SIZE = 4;

  useEffect(() => {
    loadMore();
  }, [userActions]);

  function reloadUserActions(userId) {
    setCurrIdx(0);
    setLikedMovies([]);

    const l = USER_ACTIONS_BY_USER_ID[userId].sort(
      (a, b) => b.timestamp - a.timestamp
    );
    console.log(`userActions for ${userId} = `, l);
    setUserActions(l);
  }

  async function fetchData(startingIdx) {
    const paginatedUserActions = userActions.slice(
      startingIdx,
      startingIdx + PAGE_SIZE
    );

    const tmdbIds = paginatedUserActions.map((e) => e.tmdbId);
    setCurrIdx(startingIdx + PAGE_SIZE);

    fetchMovieDatas(tmdbIds).then((datas) => {
      const movieDatas = datas.map((e) => ({
        ...e,
        posterUrl: generateMoviePosterUrl(e.poster_path),
      }));

      setLikedMovies([...likedMovies, ...movieDatas]);
    });
  }

  console.log("likedMovies = ", likedMovies);

  function loadMore() {
    if (currIdx >= userActions.length) {
      console.log("userActions reached end!");
      return;
    }
    fetchData(currIdx);
  }

  return { userActions, likedMovies, reloadUserActions, loadMore };
}

export default useLikedMovies;
