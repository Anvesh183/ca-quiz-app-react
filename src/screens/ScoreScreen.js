import React from "react";

const ScoreScreen = ({ score, onRestart, onReview, onHome }) => {
  return (
    <div id="screen-score" className="text-center">
      <h2 className="text-4xl font-bold text-green-400 mb-4">Quiz Complete!</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
        <div className="score-card bg-gray-800">
          <p>Correct</p>
          <p id="correct-count">{score.correct}</p>
        </div>
        <div className="score-card bg-gray-800">
          <p>Incorrect</p>
          <p id="incorrect-count">{score.incorrect}</p>
        </div>
        <div className="score-card bg-gray-800">
          <p>Unattempted</p>
          <p id="unattempted-count">{score.unattempted}</p>
        </div>
      </div>
      <p id="final-score" className="text-3xl font-semibold mb-8">
        {`You scored ${score.score}%`}
      </p>
      <div className="flex items-center justify-center gap-4">
        <button
          id="restart-quiz-button"
          className="nav-button bg-indigo-600"
          onClick={onRestart}
        >
          Restart Quiz
        </button>
        <button
          id="review-answers-button"
          className="nav-button bg-blue-600"
          onClick={onReview}
        >
          Review
        </button>
        <button
          id="back-to-home-button"
          className="nav-button bg-gray-700"
          onClick={onHome}
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default ScoreScreen;
