import { useState, useEffect, useCallback } from "react";

// Helper functions (shuffleArray, loadBookmarks, saveBookmarks) remain the same
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const loadBookmarks = () => {
  try {
    const stored = localStorage.getItem("bookmarkedQuestions");
    if (stored) return new Map(JSON.parse(stored));
  } catch (e) {
    console.error("Failed to parse bookmarks from localStorage", e);
  }
  return new Map();
};

const saveBookmarks = (bookmarks) => {
  localStorage.setItem(
    "bookmarkedQuestions",
    JSON.stringify(Array.from(bookmarks.entries()))
  );
};

const useQuizEngine = (initialQuestions, mode, onQuizEnd) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [visited, setVisited] = useState(new Set());
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(loadBookmarks);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isQuizActive, setQuizActive] = useState(false); // To track if quiz is running

  // Effect to set up questions when the quiz starts
  useEffect(() => {
    let questionsToLoad = [...initialQuestions];
    if (mode !== "review") {
      questionsToLoad = shuffleArray(questionsToLoad).map((q) => ({
        ...q,
        options: shuffleArray(q.options),
      }));
    }
    setQuestions(questionsToLoad);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setVisited(new Set());

    // Initialize timer and set quiz to active
    if (mode === "exam") {
      setTimeLeft(questionsToLoad.length * 30);
      setQuizActive(true);
    } else {
      setQuizActive(false);
    }
  }, [initialQuestions, mode]);

  // Centralized callback for submitting the quiz
  const handleQuizSubmit = useCallback(() => {
    if (!isQuizActive && mode !== "exam") return; // Prevent multiple submissions

    setQuizActive(false); // Stop the quiz and timer

    let correct = 0;
    let incorrect = 0;
    questions.forEach((q, i) => {
      if (userAnswers[i] === q.answer) correct++;
      else if (userAnswers[i]) incorrect++;
    });
    const unattempted = questions.length - (correct + incorrect);
    const score =
      questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

    onQuizEnd({
      correct,
      incorrect,
      unattempted,
      score,
      userAnswers,
      questions,
    });
  }, [isQuizActive, mode, questions, userAnswers, onQuizEnd]);

  // Single, robust useEffect for the timer countdown
  useEffect(() => {
    // Only run the timer if the quiz is active in exam mode
    if (isQuizActive && mode === "exam") {
      if (timeLeft <= 0) {
        handleQuizSubmit(); // Auto-submit when time runs out
        return;
      }

      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      // Cleanup function to clear the interval
      return () => clearInterval(timerId);
    }
  }, [timeLeft, isQuizActive, mode, handleQuizSubmit]);

  const handleOptionClick = (option) => {
    setUserAnswers((prev) => ({ ...prev, [currentQuestionIndex]: option }));
    setVisited((prev) => new Set(prev).add(currentQuestionIndex));
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setVisited((prev) => new Set(prev).add(currentQuestionIndex));
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handlePaletteClick = (index) => {
    setVisited((prev) => new Set(prev).add(currentQuestionIndex));
    setCurrentQuestionIndex(index);
  };

  const handleBookmark = () => {
    const question = questions[currentQuestionIndex];
    if (!question) return;
    const newBookmarks = new Map(bookmarkedQuestions);

    if (newBookmarks.has(question.question)) {
      newBookmarks.delete(question.question);
      if (mode === "review") {
        const newQuestions = questions.filter(
          (q, index) => index !== currentQuestionIndex
        );
        setQuestions(newQuestions);
        if (currentQuestionIndex >= newQuestions.length) {
          setCurrentQuestionIndex(Math.max(0, newQuestions.length - 1));
        }
      }
    } else {
      newBookmarks.set(question.question, question);
    }
    setBookmarkedQuestions(newBookmarks);
    saveBookmarks(newBookmarks);
  };

  return {
    questions,
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
    handleQuizSubmit, // The manual submit button now uses the same logic
  };
};

export default useQuizEngine;
