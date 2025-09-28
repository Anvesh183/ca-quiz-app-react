import React from "react";

const QuestionPalette = ({
  questions,
  currentQuestionIndex,
  userAnswers,
  visited,
  onPaletteClick,
  mode,
}) => {
  return (
    <div
      id="palette-container"
      className="w-full md:w-80 bg-gray-800 rounded-xl shadow-2xl p-6 flex-shrink-0 flex flex-col"
    >
      <h3 className="text-lg font-bold text-white mb-4 flex-shrink-0">
        Question Palette
      </h3>
      <div id="question-palette" className="grid grid-cols-5 gap-3">
        {questions.map((q, i) => {
          let baseClass = "palette-unvisited";
          const answer = userAnswers[i];
          if (answer) {
            baseClass = "palette-answered";
            if (mode === "review") {
              baseClass += answer === q.answer ? " correct" : " incorrect";
            }
          } else if (visited.has(i)) {
            baseClass = "palette-skipped";
          }

          return (
            <button
              key={i}
              className={`${baseClass} ${
                i === currentQuestionIndex ? "palette-current" : ""
              }`}
              onClick={() => onPaletteClick(i)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionPalette;
