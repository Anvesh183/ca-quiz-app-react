import React from "react";

const ModeScreen = ({ onSelectMode }) => {
  return (
    <div id="screen-mode" className="text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
        Start a New Quiz
      </h1>
      <p className="text-gray-400 mb-8">
        First, select a mode for your session.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <button
          data-mode="practice"
          className="selection-card bg-gray-800 p-8 rounded-xl"
          onClick={() => onSelectMode("practice")}
        >
          <h2 className="text-2xl font-bold mb-2">Practice Mode</h2>
          <p className="text-gray-400">
            Review answers and explanations instantly. No time pressure.
          </p>
        </button>
        <button
          data-mode="exam"
          className="selection-card bg-gray-800 p-8 rounded-xl"
          onClick={() => onSelectMode("exam")}
        >
          <h2 className="text-2xl font-bold mb-2">Exam Mode</h2>
          <p className="text-gray-400">
            Timed session to simulate real test conditions.
          </p>
        </button>
      </div>
    </div>
  );
};

export default ModeScreen;
