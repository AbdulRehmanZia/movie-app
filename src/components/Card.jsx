import React from "react";

const Card = ({
  movie: { title, poster_path, release_date, vote_average },
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 overflow-hidden">
      <img
        className="w-full h-64 object-cover"
        src={`https://image.tmdb.org/t/p/w500${poster_path}`}
        alt={title}
      />
      <div className="p-4">
        <h5 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h5>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Release Date: {release_date}
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Rating: {vote_average}
        </p>
      </div>
    </div>
  );
};

export default Card;
