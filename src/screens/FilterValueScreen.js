import React from "react";
import Loader from "../components/Loader";
import { useQuery } from "@tanstack/react-query";
import { fetchTopics } from "../api/quizApi";

const FilterValueScreen = ({ filterType, onSelectFilterValue, onBack }) => {
  const {
    data: topics,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["topics"],
    queryFn: fetchTopics,
    enabled: filterType === "topic",
    staleTime: 5 * 60 * 1000,
  });

  const monthOptions = [
    { id: "september-2025", name: "September 2025" },
    { id: "august-2025", name: "August 2025" },
  ];

  const displayOptions =
    filterType === "month"
      ? monthOptions
      : topics?.map((topic) => ({ id: topic, name: topic })) || [];

  return (
    <div id="screen-filter-value" className="text-center">
      <h1
        id="filter-value-title"
        className="text-3xl md:text-4xl font-bold text-white mb-8"
      >
        {`Select a ${filterType}`}
      </h1>

      {isLoading ? (
        <Loader type={filterType} />
      ) : isError ? (
        <p className="text-red-400">Could not load topics. Please try again.</p>
      ) : (
        <div
          id="filter-value-options"
          // FIX: Restored the full grid classes here
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {displayOptions.map(({ id, name }) => (
            <button
              key={id}
              onClick={() => onSelectFilterValue(id)}
              // FIX: Restored the full button classes here
              className="filter-option bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              {name}
            </button>
          ))}
        </div>
      )}
      <button id="back-to-filter-type" className="back-button" onClick={onBack}>
        &larr; Back to Filter Type
      </button>
    </div>
  );
};

export default FilterValueScreen;
