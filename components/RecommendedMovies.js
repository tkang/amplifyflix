import { useEffect, useState } from "react";

const TMDB_MOVIE_POSTER_PATH = "https://image.tmdb.org/t/p/original/";

function generateMoviePosterUrl(posterPath) {
  return `${TMDB_MOVIE_POSTER_PATH}${posterPath}`;
}

function ReloadRecommendationsForm({
  reloadRecommendations,
  userId,
  setUserId,
}) {
  return (
    <div>
      <label htmlFor="userId" className="sr-only">
        User ID
      </label>
      <input
        type="text"
        name="userId"
        id="userId"
        className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="user id"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button
        type="button"
        onClick={() => reloadRecommendations(userId)}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Reload Recommendations
      </button>
    </div>
  );
}

function RecommendedMovies({
  recommendedMovies,
  loadMore,
  reloadRecommendations,
}) {
  const [userId, setUserId] = useState("unauth-user-id");
  console.log(userId);

  return (
    <div className="bg-white">
      <div className="max-w-2xl px-4 py-16 mx-auto sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Recommended Movies
          <ReloadRecommendationsForm
            reloadRecommendations={reloadRecommendations}
            userId={userId}
            setUserId={setUserId}
          />
        </h2>

        <div className="grid grid-cols-1 mt-6 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {recommendedMovies.map((movie) => (
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
            onClick={loadMore}
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

export default RecommendedMovies;
