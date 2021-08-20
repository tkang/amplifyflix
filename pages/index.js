/* pages/index.js */
import Head from "next/head";
import { useEffect, useState } from "react";
import ReloadUserForm from "../components/ReloadUserForm";
import Tabs from "../components/Tabs";
import useRecommnededMovies from "../hooks/useRecommendedMovies";
import MovieList from "../components/MovieList";
import useLikedMovies from "../hooks/useLikedMovies";

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
    reloadUser();
  }, []);

  function reloadUser() {
    console.log("reloading userId = ", userId);
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
            <ReloadUserForm
              userId={userId}
              setUserId={setUserId}
              handleReloadButtonClick={() => reloadUser()}
            />

            <div className="mt-4">
              <Tabs
                selectedTabName={selectedTabName}
                setSelectedTabName={setSelectedTabName}
              />
            </div>

            {selectedTabName === "Recommendations" && (
              <MovieList
                title={`Recommended Movies for ${userId}`}
                movies={recommendedMovies}
                loadMore={loadMoreRecommendations}
              />
            )}

            {selectedTabName === "Liked Movies" && (
              <MovieList
                title={`Movies Liked by ${userId}`}
                movies={likedMovies}
                loadMore={loadMoreLikedMovies}
              />
            )}
          </div>
        </main>
      </div>

      <footer></footer>
    </div>
  );
}

export default Home;
