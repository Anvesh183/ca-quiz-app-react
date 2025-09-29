import { useState, useEffect, useCallback } from "react";

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const useQuizEngine = (
  initialQuestions,
  mode,
  onQuizEnd,
  initialAnswers = {},
  activeRoute
) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [visited, setVisited] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [isQuizActive, setQuizActive] = useState(false);

  useEffect(() => {
    let questionsToLoad = [...initialQuestions];
    if (mode !== "review") {
      questionsToLoad = shuffleArray(questionsToLoad).map((q) => ({
        ...q,
        options: shuffleArray(q.options),
      }));
    }
    setQuestions(questionsToLoad);

    // Safety check: if the current index is out of bounds, reset to the last question
    if (currentQuestionIndex >= questionsToLoad.length) {
      setCurrentQuestionIndex(Math.max(0, questionsToLoad.length - 1));
    } else {
      setCurrentQuestionIndex(0);
    }

    setUserAnswers(initialAnswers);
    setVisited(new Set());

    if (mode === "exam" && Object.keys(initialAnswers).length === 0) {
      setTimeLeft(questionsToLoad.length * 30);
      setQuizActive(true);
    } else {
      setQuizActive(false);
    }
  }, [initialQuestions, mode, initialAnswers]);

  const handleQuizSubmit = useCallback(() => {
    if (!isQuizActive && mode === "exam") return;
    setQuizActive(false);

    let correct = 0,
      incorrect = 0;

    questions.forEach((q, i) => {
      if (userAnswers[i] === q.answer) {
        correct++;
      } else if (userAnswers[i]) {
        incorrect++;
      }
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
      questions: questions,
    });
  }, [isQuizActive, mode, userAnswers, onQuizEnd, questions]);

  useEffect(() => {
    if (isQuizActive && mode === "exam") {
      if (timeLeft <= 0) {
        handleQuizSubmit();
        return;
      }
      const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timerId);
    }
  }, [timeLeft, isQuizActive, mode, handleQuizSubmit]);

  const handleOptionClick = (option) => {
    if (
      mode === "review" ||
      (mode === "practice" && userAnswers[currentQuestionIndex])
    ) {
      return;
    }
    setUserAnswers((prev) => ({ ...prev, [currentQuestionIndex]: option }));
    setVisited((prev) => new Set(prev).add(currentQuestionIndex));
  };

  const handleClearAnswer = () => {
    if (mode === "exam") {
      const newAnswers = { ...userAnswers };
      delete newAnswers[currentQuestionIndex];
      setUserAnswers(newAnswers);
    }
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

  return {
    questions,
    currentQuestionIndex,
    userAnswers,
    visited,
    timeLeft,
    handleOptionClick,
    handleClearAnswer,
    goToNext,
    goToPrev,
    handlePaletteClick,
    handleQuizSubmit,
  };
};

export default useQuizEngine;
