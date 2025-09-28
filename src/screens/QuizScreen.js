import React, { useEffect } from "react";
import useQuizEngine from "../hooks/useQuizEngine";
import QuestionPalette from "../components/QuestionPalette";
import Loader from "../components/Loader";

const QuizScreen = ({ questions, mode, onQuizEnd, handleNavigate }) => {
  const {
    questions: quizQuestions,
    currentQuestionIndex,
    userAnswers,
    visited,
    timeLeft,
    bookmarkedQuestions,
    handleOptionClick,
    handleClearAnswer,
    goToNext,
    goToPrev,
    handlePaletteClick,
    handleBookmark,
    handleQuizSubmit,
  } = useQuizEngine(questions, mode, onQuizEnd);

  useEffect(() => {
    if (mode === "review" && quizQuestions.length === 0) {
      handleNavigate("emptyBookmarks");
    }
  }, [quizQuestions, mode, handleNavigate]);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const selectedAnswer = userAnswers[currentQuestionIndex];

  if (!currentQuestion) {
    return <Loader />;
  }

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // --- NEW: Calculate the progress percentage ---
  const progressPercentage =
    ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  return (
    <div id="screen-quiz">
      <main className="w-full flex flex-col-reverse md:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div
            id="quiz-panel"
            className="w-full bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8"
          >
            {/* --- NEW: VISUAL PROGRESS BAR --- */}
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
              <div
                className="bg-indigo-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <p id="progress-text" className="text-sm text-gray-400">
                {`Question ${currentQuestionIndex + 1} of ${
                  quizQuestions.length
                }`}
              </p>
              {mode === "exam" && (
                <p id="timer-text" className="text-sm text-gray-400">
                  Time: {formatTime(timeLeft)}
                </p>
              )}
            </div>

            <div id="question-container" className="w-full text-left">
              <p
                id="question-text"
                className="text-xl md:text-2xl font-semibold mb-6 leading-relaxed"
              >
                {currentQuestion.question}
              </p>
            </div>

            <div
              id="options-container"
              className="w-full flex flex-col space-y-4"
            >
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = currentQuestion.answer === option;
                let buttonClass =
                  "bg-gray-700 hover:bg-gray-600 border-transparent";

                if (isSelected) {
                  if (
                    mode === "practice" ||
                    mode === "exam" ||
                    mode === "review"
                  ) {
                    buttonClass = isCorrect
                      ? "bg-green-500/20 border-green-500"
                      : "bg-red-500/20 border-red-500";
                  } else {
                    buttonClass = "bg-indigo-500/50 border-indigo-400";
                  }
                } else if (
                  selectedAnswer &&
                  (mode === "practice" || mode === "review") &&
                  isCorrect
                ) {
                  buttonClass = "bg-green-500/20 border-green-500";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    disabled={selectedAnswer && mode === "practice"}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 border-2 flex justify-between items-center ${buttonClass}`}
                  >
                    {option}
                    {isSelected &&
                      mode === "exam" &&
                      (isCorrect ? (
                        <i className="fas fa-check-circle text-green-400"></i>
                      ) : (
                        <i className="fas fa-times-circle text-red-400"></i>
                      ))}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 w-full">
              <div
                id="navigation-buttons"
                className="flex flex-wrap w-full mt-6 gap-3 justify-between"
              >
                <button
                  onClick={goToPrev}
                  disabled={currentQuestionIndex === 0}
                  id="prev-button"
                  className="nav-button bg-gray-600"
                >
                  Previous
                </button>

                {selectedAnswer && mode !== "review" && (
                  <button
                    onClick={handleClearAnswer}
                    id="clear-button"
                    className="nav-button bg-gray-700"
                  >
                    Clear Answer
                  </button>
                )}

                <button
                  onClick={goToNext}
                  disabled={currentQuestionIndex === quizQuestions.length - 1}
                  id="next-button"
                  className="nav-button bg-indigo-600"
                >
                  Next
                </button>
                <button
                  onClick={handleBookmark}
                  id="bookmark-button"
                  className={`nav-button ${
                    bookmarkedQuestions.has(currentQuestion.question)
                      ? "bg-yellow-600"
                      : "bg-blue-600"
                  }`}
                >
                  {mode === "review"
                    ? "Remove Bookmark"
                    : bookmarkedQuestions.has(currentQuestion.question)
                    ? "Bookmarked"
                    : "Bookmark"}
                </button>
                {currentQuestionIndex === quizQuestions.length - 1 &&
                  mode !== "practice" &&
                  mode !== "review" && (
                    <button
                      onClick={handleQuizSubmit}
                      id="submit-button"
                      className="nav-button bg-red-600"
                    >
                      Submit
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
        {mode !== "review" && (
          <QuestionPalette
            questions={quizQuestions}
            currentQuestionIndex={currentQuestionIndex}
            userAnswers={userAnswers}
            visited={visited}
            onPaletteClick={handlePaletteClick}
            mode={mode}
          />
        )}
      </main>
    </div>
  );
};

export default QuizScreen;
