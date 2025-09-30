import React from "react";

const ScoreScreen = ({
  score,
  onRestart,
  onReview,
  onHome,
  onReviewMistakes,
}) => {
  // <-- Add onReviewMistakes prop
  if (!score) {
    return (
      <div className="text-center">
        <p>No score to display.</p>
        <button onClick={onHome} className="nav-button bg-indigo-600 mt-4">
          Back to Home
        </button>
      </div>
    );
  }

  const { correct, incorrect, unattempted, score: finalScore } = score;
  const hasMistakes = incorrect > 0; // Check if there are mistakes to review

  return (
    <div id="screen-score" className="text-center">
      <h1
        id="final-score"
        className="text-4xl md:text-5xl font-extrabold text-white mb-4"
      >
        Quiz Complete!
      </h1>
      <p className="text-2xl font-bold text-indigo-400 mb-8">
        Your Score: {finalScore}%
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
        <div className="score-card">
          <p>Correct</p>
          <p id="correct-count">{correct}</p>
        </div>
        <div className="score-card">
          <p>Incorrect</p>
          <p id="incorrect-count">{incorrect}</p>
        </div>
        <div className="score-card">
          <p>Unattempted</p>
          <p id="unattempted-count">{unattempted}</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <button onClick={onRestart} className="nav-button bg-gray-700">
          Restart Quiz
        </button>
        <button onClick={onReview} className="nav-button bg-blue-600">
          Review All Answers
        </button>
        {/* --- NEW BUTTON --- */}
        {/* This button only shows if there are incorrect answers */}
        {hasMistakes && (
          <button
            onClick={onReviewMistakes}
            className="nav-button bg-yellow-600"
          >
            Review Mistakes
          </button>
        )}
        <button onClick={onHome} className="nav-button bg-indigo-600">
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ScoreScreen;
