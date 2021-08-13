import Head from "next/head";
import SAMPLE_TMDB_IDS from "../src/sample_tmdb_ids";
import { useEffect, useState } from "react";
import _ from "lodash";

const TMDB_API_KEY = "ca294fadd74fb6ddb4e74a12e521ceae";
const TMDB_MOVIE_API_URL = "https://api.themoviedb.org/3/movie/";
const TMDB_MOVIE_POSTER_PATH = "https://image.tmdb.org/t/p/original/";

const SAMPLE_MOVIES = [
  {
    adult: false,
    backdrop_path: "/pTzE7JsbpZ7DfMHEbZCm6kMLB6o.jpg",
    belongs_to_collection: null,
    budget: 50000000,
    genres: [
      {
        id: 18,
        name: "Drama",
      },
      {
        id: 35,
        name: "Comedy",
      },
      {
        id: 10749,
        name: "Romance",
      },
    ],
    homepage: "",
    id: 4599,
    imdb_id: "tt0350028",
    original_language: "en",
    original_title: "Raising Helen",
    overview:
      "Helen Harris has a glamorous, big-city life working for one of New York's hottest modeling agencies. But suddenly her free-spirited life gets turned upside down when she must chose between the life she's always loved, and the new loves of her life!",
    popularity: 9.161,
    poster_path: "/lH36r2wRRu7QRBSY0DYooVFAoYW.jpg",
    production_companies: [
      {
        id: 10157,
        logo_path: null,
        name: "Beacon Pictures",
        origin_country: "",
      },
      {
        id: 9195,
        logo_path: "/ou5BUbtulr6tIt699q6xJiEQTR9.png",
        name: "Touchstone Pictures",
        origin_country: "US",
      },
      {
        id: 10227,
        logo_path: "/3YfRy3DBl4abcqkzGx4RVNz12yl.png",
        name: "Mandeville Films",
        origin_country: "US",
      },
    ],
    production_countries: [
      {
        iso_3166_1: "US",
        name: "United States of America",
      },
    ],
    release_date: "2004-05-27",
    revenue: 49718611,
    runtime: 119,
    spoken_languages: [
      {
        english_name: "English",
        iso_639_1: "en",
        name: "English",
      },
    ],
    status: "Released",
    tagline: "Her uptown life gets turned inside out!",
    title: "Raising Helen",
    video: false,
    vote_average: 6.1,
    vote_count: 538,
  },
  {
    adult: false,
    backdrop_path: null,
    belongs_to_collection: null,
    budget: 0,
    genres: [
      {
        id: 18,
        name: "Drama",
      },
    ],
    homepage: "http://www.dougaitkenblackmirror.com/",
    id: 452830,
    imdb_id: "tt2492564",
    original_language: "en",
    original_title: "Black Mirror",
    overview:
      "A nameless drifter navigates a barren landscape punctuated by satellite dishes, radio towers and droning airplanes. Stopping periodically in anonymous hotel rooms, she makes attempts to connect to an unidentified second party.",
    popularity: 3.902,
    poster_path: "/fYi4BQhoj2ay3oJwT2x8kMNHpds.jpg",
    production_companies: [],
    production_countries: [
      {
        iso_3166_1: "US",
        name: "United States of America",
      },
    ],
    release_date: "2011-06-20",
    revenue: 0,
    runtime: 4,
    spoken_languages: [
      {
        english_name: "English",
        iso_639_1: "en",
        name: "English",
      },
    ],
    status: "Released",
    tagline: "",
    title: "Black Mirror",
    video: false,
    vote_average: 7.6,
    vote_count: 47,
  },
];

function generateTmdbMovieApiUrl(tmdbId) {
  return `${TMDB_MOVIE_API_URL}${tmdbId}?api_key=${TMDB_API_KEY}`;
}

function generateMoviePosterUrl(posterPath) {
  return `${TMDB_MOVIE_POSTER_PATH}${posterPath}`;
}

async function fetchMovieData(tmdbId) {
  const url = generateTmdbMovieApiUrl(tmdbId);
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function fetchMovieDatas(tmdbIds) {
  const urls = tmdbIds.map((tmdbId) => generateTmdbMovieApiUrl(tmdbId));
  console.log(urls);
  const responses = await Promise.all(urls.map((url) => fetch(url)));
  const datas = await Promise.all(responses.map((response) => response.json()));
  return datas;
}

function RecommendedMovies({ movies }) {
  return (
    <div className="bg-white">
      <div className="max-w-2xl px-4 py-16 mx-auto sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Recommended Movies
        </h2>

        <div className="grid grid-cols-1 mt-6 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {movies.map((movie) => (
            <div key={movie.id} className="relative group">
              <div className="w-full overflow-hidden bg-gray-200 rounded-md min-h-80 aspect-w-1 aspect-h-1 group-hover:opacity-75 lg:h-80 lg:aspect-none">
                <img
                  src={generateMoviePosterUrl(movie.poster_path)}
                  alt={generateMoviePosterUrl(movie.poster_path)}
                  className="object-cover object-center w-full h-full lg:w-full lg:h-full"
                />
              </div>
              <div className="flex justify-between mt-4">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href="#">
                      <span aria-hidden="true" className="absolute inset-0" />
                      {movie.title}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {movie.genres && movie.genres.map((g) => g.name).join(" ")}
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {movie.release_date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [tmdbIds, setTmdbIds] = useState(_.shuffle(SAMPLE_TMDB_IDS));
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const SAMPLING_SIZE = 4;

  useEffect(() => {
    /*
    setRecommendedMovies(SAMPLE_MOVIES);
    console.log(SAMPLE_MOVIES);
    */

    const randomIds = tmdbIds.slice(0, SAMPLING_SIZE);
    fetchMovieDatas(randomIds).then((datas) => {
      console.log(datas);
      setRecommendedMovies(datas);
    });
  }, []);

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
          <RecommendedMovies movies={recommendedMovies} />
        </main>
      </div>

      <footer></footer>
    </div>
  );
}

export default Home;
