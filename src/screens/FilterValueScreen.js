import React from "react";
import Loader from "../components/Loader";
import { useQuery } from "@tanstack/react-query";
import { fetchTopics } from "../api/supabaseApi";

const FilterValueScreen = ({
  subject,
  filterType,
  onSelectFilterValue,
  onBack,
}) => {
  const {
    data: topics,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["topics", subject],
    queryFn: () => fetchTopics(subject),
    enabled: filterType === "topic",
    staleTime: 5 * 60 * 1000,
  });

  let displayOptions = [];

  if (filterType === "month") {
    displayOptions = [
      { id: "september-2025", name: "September 2025" },
      { id: "august-2025", name: "August 2025" },
    ];
  } else if (filterType === "topic") {
    displayOptions = topics?.map((topic) => ({ id: topic, name: topic })) || [];
  } else if (filterType === "mockTest") {
    // Generate 20 mock test options, assuming their IDs are 1-20
    displayOptions = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `Mock Test ${i + 1}`,
    }));
  }

  return (
    <div id="screen-filter-value" className="text-center">
      <h1
        id="filter-value-title"
        className="text-3xl md:text-4xl font-bold text-white mb-8"
      >
        {`Select a ${filterType === "mockTest" ? "Mock Test" : filterType}`}
      </h1>

      {isLoading && filterType === "topic" ? (
        <Loader type={filterType} />
      ) : isError && filterType === "topic" ? (
        <p className="text-red-400">Could not load topics. Please try again.</p>
      ) : (
        <div
          id="filter-value-options"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {displayOptions.map(({ id, name }) => (
            <button
              key={id}
              onClick={() => onSelectFilterValue(id)}
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
