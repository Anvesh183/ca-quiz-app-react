import React from "react";

const FilterTypeScreen = ({ onSelectFilterType, onBack }) => {
  return (
    <div id="screen-filter-type" className="text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
        Filter Your Questions
      </h1>
      <p className="text-gray-400 mb-8">
        Choose to practice by month or by a specific topic.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <button
          data-filter="month"
          className="selection-card bg-gray-800 p-8 rounded-xl"
          onClick={() => onSelectFilterType("month")}
        >
          <h2 className="text-2xl font-bold mb-2">Month-wise</h2>
          <p className="text-gray-400">
            Test your knowledge from a specific month.
          </p>
        </button>
        <button
          data-filter="topic"
          className="selection-card bg-gray-800 p-8 rounded-xl"
          onClick={() => onSelectFilterType("topic")}
        >
          <h2 className="text-2xl font-bold mb-2">Topic-wise</h2>
          <p className="text-gray-400">Concentrate on a single subject area.</p>
        </button>
      </div>
      <button id="back-to-mode" className="back-button" onClick={onBack}>
        &larr; Back to Mode Selection
      </button>
    </div>
  );
};

export default FilterTypeScreen;
