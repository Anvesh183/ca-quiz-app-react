import React, { useState, useCallback, useEffect } from "react";
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
} from "./api/supabaseApi";

const App = () => {
  const [screen, setScreen] = useState("mode");
  const [activeRoute, setActiveRoute] = useState("home");
  const [mode, setMode] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [lastQuiz, setLastQuiz] = useState(null);
  const [reviewAnswers, setReviewAnswers] = useState({});

  const resetToHome = useCallback(() => {
    setActiveRoute("home");
    setScreen("mode");
    setMode(null);
    setFilterType(null);
    setReviewAnswers({});
  }, []);

  const handleNavigate = useCallback(
    (target) => {
      setReviewAnswers({});
      if (target === "home") {
        resetToHome();
        return;
      }
      // Fallback for any other navigation target
      resetToHome();
    },
    [resetToHome]
  );

  const handleSelectFilterValue = async (value) => {
    setLoading(true);
    try {
      let fetchedQuestions = [];
      if (filterType === "month") {
        fetchedQuestions = await fetchQuestionsByMonth(value);
      } else {
        fetchedQuestions = await fetchQuestionsByTopic(value);
      }
      if (fetchedQuestions.length === 0) {
        alert(`No questions found.`);
        setScreen("filterValue");
      } else {
        setQuestions(fetchedQuestions);
        setScreen("quiz");
      }
    } catch (error) {
      alert("Could not load questions.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizEnd = (results) => {
    setScore(results);
    setLastQuiz({
      questions: results.questions,
      userAnswers: results.userAnswers,
    });
    setScreen("score");
  };

  const handleReview = () => {
    setQuestions(lastQuiz.questions);
    setMode("review");
    setReviewAnswers(lastQuiz.userAnswers);
    setScreen("quiz");
  };

  const renderScreen = () => {
    if (loading) return <Loader />;

    switch (screen) {
      case "mode":
        return (
          <ModeScreen
            onSelectMode={(m) => {
              setMode(m);
              setScreen("filterType");
            }}
          />
        );
      case "filterType":
        return (
          <FilterTypeScreen
            onSelectFilterType={(f) => {
              setFilterType(f);
              setScreen("filterValue");
            }}
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
            initialAnswers={reviewAnswers}
            activeRoute={activeRoute}
          />
        );
      case "score":
        return (
          <ScoreScreen
            score={score}
            onRestart={() => {
              setReviewAnswers({});
              setScreen("quiz");
            }}
            onReview={handleReview}
            onHome={resetToHome}
          />
        );
      default:
        return (
          <ModeScreen
            onSelectMode={(m) => {
              setMode(m);
              setScreen("filterType");
            }}
          />
        );
    }
  };

  return (
    <Layout onNavigate={handleNavigate} activeRoute={activeRoute}>
      {renderScreen()}
    </Layout>
  );
};

export default App;
