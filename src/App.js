import React, { useState, useCallback } from "react";
import Layout from "./components/Layout";
import ModeScreen from "./screens/ModeScreen";
import FilterTypeScreen from "./screens/FilterTypeScreen";
import FilterValueScreen from "./screens/FilterValueScreen";
import QuizScreen from "./screens/QuizScreen";
import ScoreScreen from "./screens/ScoreScreen";
import Loader from "./components/Loader";
import {
  fetchQuestionsByMonth,
  fetchQuestionsByTopic,
} from "./api/supabaseApi"; // <-- Import from your new Supabase API file

const App = () => {
  const [screen, setScreen] = useState("mode");
  const [activeRoute, setActiveRoute] = useState("home");
  const [mode, setMode] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [lastQuiz, setLastQuiz] = useState(null);

  const handleSelectMode = (selectedMode) => {
    setMode(selectedMode);
    setScreen("filterType");
  };

  const handleSelectFilterType = (type) => {
    setFilterType(type);
    setScreen("filterValue");
  };

  const handleSelectFilterValue = async (value) => {
    setLoading(true);
    try {
      let fetchedQuestions = [];
      if (filterType === "month") {
        // This will now correctly call the Supabase function
        fetchedQuestions = await fetchQuestionsByMonth(value);
      } else {
        fetchedQuestions = await fetchQuestionsByTopic(value);
      }

      if (fetchedQuestions.length === 0) {
        alert(`No questions found for "${value}". Please try another option.`);
        setScreen("filterValue");
      } else {
        setQuestions(fetchedQuestions);
        setScreen("quiz");
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      alert("Could not load questions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuizEnd = (results) => {
    setScore(results);
    setLastQuiz({
      questions: results.questions,
      mode,
      userAnswers: results.userAnswers,
    });
    setScreen("score");
  };

  const handleRestart = () => {
    setScreen("quiz");
  };

  const handleReview = () => {
    setQuestions(lastQuiz.questions);
    setMode("review");
    setScreen("quiz");
  };

  const handleNavigate = useCallback((target) => {
    if (target === "mode") {
      setActiveRoute("home");
      setScreen("mode");
      setMode(null);
      setFilterType(null);
      setQuestions([]);
    } else if (target === "bookmarks" || target === "emptyBookmarks") {
      setActiveRoute("bookmarks");

      if (target === "emptyBookmarks") {
        setScreen("emptyBookmarks");
        return;
      }

      const loadBookmarks = () => {
        try {
          const stored = localStorage.getItem("bookmarkedQuestions");
          if (stored) return new Map(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
        return new Map();
      };

      const bookmarks = loadBookmarks();
      const bookmarkedQuestionsArray = Array.from(bookmarks.values());

      if (bookmarkedQuestionsArray.length > 0) {
        setQuestions(bookmarkedQuestionsArray);
        setMode("review");
        setScreen("quiz");
      } else {
        setScreen("emptyBookmarks");
      }
    }
  }, []);

  const renderScreen = () => {
    if (loading) {
      return <Loader />;
    }

    switch (screen) {
      case "filterType":
        return (
          <FilterTypeScreen
            onSelectFilterType={handleSelectFilterType}
            onBack={() => setScreen("mode")}
          />
        );
      case "filterValue":
        return (
          <FilterValueScreen
            filterType={filterType}
            onSelectFilterValue={handleSelectFilterValue}
            onBack={() => setScreen("filterType")}
          />
        );
      case "quiz":
        return (
          <QuizScreen
            questions={questions}
            mode={mode}
            onQuizEnd={handleQuizEnd}
            handleNavigate={handleNavigate}
          />
        );
      case "score":
        return (
          <ScoreScreen
            score={score}
            onRestart={handleRestart}
            onReview={handleReview}
            onHome={() => handleNavigate("mode")}
          />
        );
      case "emptyBookmarks":
        return (
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              No Bookmarked Questions
            </h1>
            <p className="text-gray-400 mb-8">
              You haven't bookmarked any questions yet. Bookmark questions
              during a quiz to review them here.
            </p>
            <button
              className="nav-button bg-indigo-600"
              onClick={() => handleNavigate("mode")}
            >
              Back to Home
            </button>
          </div>
        );
      case "mode":
      default:
        return <ModeScreen onSelectMode={handleSelectMode} />;
    }
  };

  return (
    <Layout onNavigate={handleNavigate} activeRoute={activeRoute}>
      {renderScreen()}
    </Layout>
  );
};

export default App;
