import React, { useEffect } from "react";
import useQuizEngine from "../hooks/useQuizEngine";
import QuestionPalette from "../components/QuestionPalette";
import Loader from "../components/Loader";

const QuizScreen = ({ questions, mode, onQuizEnd, handleNavigate }) => {
  // <-- Accept handleNavigate
  const {
    questions: quizQuestions,
    currentQuestionIndex,
    userAnswers,
    visited,
    timeLeft,
    bookmarkedQuestions,
    handleOptionClick,
    goToNext,
    goToPrev,
    handlePaletteClick,
    handleBookmark,
    handleQuizSubmit,
  } = useQuizEngine(questions, mode, onQuizEnd);

  // FIX: This effect will run whenever the list of quiz questions changes.
  useEffect(() => {
    // If we are in review mode and the list of questions becomes empty...
    if (mode === "review" && quizQuestions.length === 0) {
      // ...navigate the user to the empty bookmarks screen.
      handleNavigate("emptyBookmarks");
    }
  }, [quizQuestions, mode, handleNavigate]);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  // If there's no current question (e.g., the list is empty), show a loader
  // to prevent a crash before the navigation effect can run.
  if (!currentQuestion) {
    return <Loader />;
  }

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div id="screen-quiz">
      <main className="w-full flex flex-col-reverse md:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div
            id="quiz-panel"
            className="w-full bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8"
          >
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
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 border-2 flex justify-between items-center 
                   ${
                     userAnswers[currentQuestionIndex] === option
                       ? "bg-indigo-500/50 border-indigo-400"
                       : "bg-gray-700 hover:bg-gray-600 border-transparent"
                   }`}
                >
                  {option}
                </button>
              ))}
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
