import React from "react";

const FilterTypeScreen = ({ subject, onSelectFilterType, onBack }) => {
  const isComputerAwareness = subject === "computerAwareness";

  return (
    <div id="screen-filter-type" className="text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
        Filter Your Questions
      </h1>
      <p className="text-gray-400 mb-8">
        {isComputerAwareness
          ? "Choose to practice by topic or take a mock test."
          : "Choose to practice by month or by a specific topic."}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* This button is Topic for Computer, Month for Current Affairs */}
        <button
          data-filter={isComputerAwareness ? "topic" : "month"}
          className="selection-card bg-gray-800 p-8 rounded-xl"
          onClick={() =>
            onSelectFilterType(isComputerAwareness ? "topic" : "month")
          }
        >
          <h2 className="text-2xl font-bold mb-2">
            {isComputerAwareness ? "Topic-wise" : "Month-wise"}
          </h2>
          <p className="text-gray-400">
            {isComputerAwareness
              ? "Concentrate on a single subject area."
              : "Test your knowledge from a specific month."}
          </p>
        </button>

        {/* This button is Mock Test for Computer, Topic for Current Affairs */}
        <button
          data-filter={isComputerAwareness ? "mockTest" : "topic"}
          className="selection-card bg-gray-800 p-8 rounded-xl"
          onClick={() =>
            onSelectFilterType(isComputerAwareness ? "mockTest" : "topic")
          }
        >
          <h2 className="text-2xl font-bold mb-2">
            {isComputerAwareness ? "Mock Tests" : "Topic-wise"}
          </h2>
          <p className="text-gray-400">
            {isComputerAwareness
              ? "Take a full-length mock exam."
              : "Concentrate on a single subject area."}
          </p>
        </button>
      </div>
      <button id="back-to-mode" className="back-button" onClick={onBack}>
        &larr; Back to Mode Selection
      </button>
    </div>
  );
};

export default FilterTypeScreen;
