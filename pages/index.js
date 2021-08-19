import Head from "next/head";
import RecommendedMovies from "../components/RecommendedMovies";

import { useEffect, useState } from "react";
import useRecommnededMovies from "../hooks/useRecommendedMovies";
import Tabs from "../components/Tabs";
import LikedMovies from "../components/LikedMovies";
import useLikedMovies from "../hooks/useLikedMovies";

const DEFAULT_TABS_DATA = [
  { name: "Liked Movies", href: "#", current: false },
  { name: "Recommendations", href: "#", current: true },
];

function RealodUserForm({ handleReloadButtonClick, userId, setUserId }) {
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
        onClick={handleReloadButtonClick}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Reload User
      </button>
    </div>
  );
}

function Home() {
  const [selectedTabName, setSelectedTabName] = useState("Recommendations");
  const [userId, setUserId] = useState("1");
  const {
    recommendedMovies,
    loadMore: loadMoreRecommendations,
    reloadRecommendations,
  } = useRecommnededMovies();

  const {
    reloadUserActions,
    likedMovies,
    loadMore: loadMoreLikedMovies,
  } = useLikedMovies();

  useEffect(() => {
    reloadData();
  }, []);

  function reloadData() {
    console.log("userId = ", userId);
    reloadRecommendations(userId);
    reloadUserActions(userId);
  }

  return (
    <div>
      <Head>
        <title>AmplifyFlix</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎥</text></svg>"
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
          <RealodUserForm
            userId={userId}
            setUserId={setUserId}
            handleReloadButtonClick={() => reloadData()}
          />

          <div className="mt-4">
            <Tabs
              tabs={DEFAULT_TABS_DATA}
              selectedTabName={selectedTabName}
              setSelectedTabName={setSelectedTabName}
            />
          </div>

          {selectedTabName === "Recommendations" && (
            <RecommendedMovies
              userId={userId}
              recommendedMovies={recommendedMovies}
              loadMore={loadMoreRecommendations}
            />
          )}

          {selectedTabName === "Liked Movies" && (
            <LikedMovies
              userId={userId}
              likedMovies={likedMovies}
              loadMore={loadMoreLikedMovies}
            />
          )}
        </main>
      </div>

      <footer></footer>
    </div>
  );
}

export default Home;
