import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import Card from "./components/Card";
import { useDebounce } from "react-use";
import updateSearchCount, { getTrendingMovies } from "./appwrite";

const API_BASE_URL = `https://api.themoviedb.org/3`;
const API_KEY = import.meta.env.VITE_TMBD_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: `application/json`,
    Authorization: `Bearer ${API_KEY}`,
  },
};

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [trendingErrMsg, setTrendingErrMsg] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 600, [searchTerm]);

  async function fetchMovies(query = "") {
    try {
      const endPoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;
      const response = await fetch(endPoint, API_OPTIONS);
      if (!response.ok) throw new Error("Failed To Fetch Movies");
      const movies = await response.json();
      console.log("Movie: ", movies);
      if (movies.response === false) {
        setErrorMsg(movies.error || "Failed To Fetch Movies");
        setMovieList([]);
        return;
      }
      setMovieList(movies.results || []);
      if (query && movies.results.length > 0) {
        await updateSearchCount(query, movies.results[0]);
      }
    } catch (error) {
      console.error(`Error In Fetching Movies: ${error.message}`);
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadTrendingMovies() {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(error);
      setTrendingErrMsg(error.message);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
   <main className="min-h-screen bg-hero relative text-white">
  
  <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-0" />

  <div className="relative z-10 max-w-7xl mx-auto px-4 py-10">
    {/* Header */}
    <header className="text-center mb-12">
      <img src="/hero.png" className="mx-auto w-24 h-24 rounded-full shadow-xl mb-4" alt="Movie Logo" />
      <h1 className="text-4xl sm:text-5xl font-extrabold">
        Welcome To <span className="bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">Movie.PK</span>
      </h1>
      <p className="text-gray-300 mt-2">Search and discover trending movies!</p>
      <div className="mt-6">
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
    </header>

    {/* Trending Movies */}
    {trendingMovies.length > 0 && (
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4">🔥 Trending Movies</h2>
        {trendingErrMsg ? (
          <p className="text-red-500">{trendingErrMsg}</p>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {trendingMovies.map((movie, index) => (
              <li key={movie.$id} className="bg-white/10 rounded-lg p-3 shadow-lg hover:scale-105 transition-transform">
                <img src={movie.poster_url} alt={movie.title} className="rounded-lg w-full aspect-[2/3] object-cover" />
                <p className="text-sm text-center mt-2">{index + 1}. {movie.title}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    )}

    {/* All Movies */}
    <section>
      <h2 className="text-2xl font-bold mb-4">🎬 All Movies</h2>
      {loading ? (
        <Spinner />
      ) : errorMsg ? (
        <p className="text-red-500">{errorMsg}</p>
      ) : (
        
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movieList.map((movie) => (
            <Card key={movie.id} movie={movie} />
          ))}
        </ul>
      )}
    </section>
  </div>
</main>


  );
}
