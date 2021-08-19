import Head from "next/head";
import RecommendedMovies from "../components/RecommendedMovies";

import { useEffect, useState } from "react";
import useRecommnededMovies from "../hooks/useRecommendedMovies";
import Tabs from "../components/Tabs";
import UserActions from "../components/UserActions";

const DEFAULT_TABS_DATA = [
  { name: "User Actions", href: "#", current: false },
  { name: "Recommendations", href: "#", current: true },
];

const people = [
  {
    name: "Lindsay Walton",
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80",
  },
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
];

function ReloadRecommendationsForm({ reloadRecommendations }) {
  const [userId, setUserId] = useState("random-user-id");
  console.log(userId);

  return (
    <div>
      <label htmlFor="userId" className="sr-only">
        User ID
      </label>
      <input
        type="text"
        name="userId"
        id="userId"
        className="block border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="user id"
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

function Home() {
  const [selectedTabName, setSelectedTabName] = useState("Recommendations");
  const { recommendedMovies, loadMore, reloadRecommendations } =
    useRecommnededMovies();

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
          <Tabs
            tabs={DEFAULT_TABS_DATA}
            selectedTabName={selectedTabName}
            setSelectedTabName={setSelectedTabName}
          />

          {selectedTabName === "Recommendations" && (
            <RecommendedMovies
              recommendedMovies={recommendedMovies}
              loadMore={loadMore}
              reloadRecommendations={reloadRecommendations}
            />
          )}

          {selectedTabName === "User Actions" && (
            <UserActions userActions={DEFAULT_USER_ACTIONS} />
          )}
        </main>
      </div>

      <footer></footer>
    </div>
  );
}

export default Home;
