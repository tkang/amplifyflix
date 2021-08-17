import Head from "next/head";
import SAMPLE_TMDB_IDS from "../src/sample_tmdb_ids";
import { useEffect, useState } from "react";
import _ from "lodash";
import SAMPLE_MOVIES from "../src/sample_movies";

const TMDB_API_KEY = "ca294fadd74fb6ddb4e74a12e521ceae";
const TMDB_MOVIE_API_URL = "https://api.themoviedb.org/3/movie/";
const TMDB_MOVIE_POSTER_PATH = "https://image.tmdb.org/t/p/original/";

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

function RecommendedMovies({ movies, handleNext, handlePrev }) {
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
        <div className="mt-6">
          <button
            onClick={handleNext}
            type="button"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Recommend More
          </button>
        </div>
      </div>
    </div>
  );
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const DEFAULT_TABS = [
  { name: "User Actions", href: "#", current: false },
  { name: "Recommendations", href: "#", current: true },
];

function Tabs({ tabs, selectedTabName, setSelectedTabName }) {
  console.log("selectedTabName=", selectedTabName);

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          defaultValue={tabs.find((tab) => tab.current).name}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                onClick={() => setSelectedTabName(tab.name)}
                className={classNames(
                  tab.name === selectedTabName
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                  "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                )}
                aria-current={tab.current ? "page" : undefined}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

const people = [
  {
    name: "Lindsay Walton",
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80",
  },
  // More people...
];
const DEFAULT_USER_ACTIONS = [
  {
    id: 1,
    person: people[0],
    project: "Workcation",
    commit: "2d89f0c8",
    environment: "production",
    time: "1h",
  },
  // More items...
];

function UserActions({ userActions }) {
  return (
    <div className="bg-white">
      <div className="max-w-2xl px-4 py-16 mx-auto sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          User Actions
        </h2>

        <div className="grid grid-cols-1 mt-6 gap-y-10 gap-x-6 sm:grid-cols-1 lg:grid-cols-1 xl:gap-x-8">
          <ul role="list" className="divide-y divide-gray-200">
            {userActions.map((activityItem) => (
              <li key={activityItem.id} className="py-4">
                <div className="flex space-x-3">
                  <img
                    className="w-6 h-6 rounded-full"
                    src={activityItem.person.imageUrl}
                    alt=""
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">
                        {activityItem.person.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {activityItem.time}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      Deployed {activityItem.project} ({activityItem.commit} in
                      master) to {activityItem.environment}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [tmdbIds, setTmdbIds] = useState(_.shuffle(SAMPLE_TMDB_IDS));
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [currIdx, setCurrIdx] = useState(0);
  const [selectedTabName, setSelectedTabName] = useState("Recommendations");
  const [userActions, setUserActions] = useState(DEFAULT_USER_ACTIONS);
  const SAMPLING_SIZE = 4;

  useEffect(() => {
    //setRecommendedMovies(SAMPLE_MOVIES);
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

  function handleNext() {
    const nextIdx = Math.min(tmdbIds.length - 1, currIdx + SAMPLING_SIZE);
    if (nextIdx === currIdx) return;

    fetchData(nextIdx);
    setCurrIdx(nextIdx);
  }

  console.log("currIdx = ", currIdx);

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
          <Tabs
            tabs={DEFAULT_TABS}
            selectedTabName={selectedTabName}
            setSelectedTabName={setSelectedTabName}
          ></Tabs>

          {selectedTabName === "Recommendations" && (
            <RecommendedMovies
              movies={recommendedMovies}
              handleNext={handleNext}
            />
          )}

          {selectedTabName === "User Actions" && (
            <UserActions userActions={userActions} />
          )}
        </main>
      </div>

      <footer></footer>
    </div>
  );
}

export default Home;
