import Head from "next/head";
import SAMPLE_TMDB_IDS from "../src/sample_tmdb_ids";
import { useEffect, useState } from "react";
import _ from "lodash";

const TMDB_API_KEY = "ca294fadd74fb6ddb4e74a12e521ceae";
const TMDB_MOVIE_API_URL = "https://api.themoviedb.org/3/movie/";
const TMDB_MOVIE_POSTER_PATH = "https://image.tmdb.org/t/p/original/";

function generateTmdbMovieApiUrl(tmdbId) {
  return `${TMDB_MOVIE_API_URL}${tmdbId}?api_key=${TMDB_API_KEY}`;
}

function generateMoviePosterUrl(posterPath) {
  return `${TMDB_MOVIE_POSTER_PATH}${posterPath}`;
}

console.log(generateTmdbMovieApiUrl(SAMPLE_TMDB_IDS[0]));

function Home() {
  const [tmdbIds, setTmdbIds] = useState(_.shuffle(SAMPLE_TMDB_IDS));

  useEffect(() => {}, []);

  return (
    <div>
      <Head>
        <title>AmplifyFlix</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐕</text></svg>"
        />
      </Head>

      <div className="container mx-auto">
        <main className="bg-white">
          <div className="px-4 py-16 mx-auto max-w-7xl sm:py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                AmplifyFlix
              </p>
              <p className="max-w-xl mx-auto mt-5 text-xl text-gray-500">
                Welcome to AmplifyFlix
              </p>
            </div>
          </div>
        </main>
      </div>

      <footer></footer>
    </div>
  );
}

export default Home;
