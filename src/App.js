import React, { useState, useCallback, useEffect } from "react";
import Layout from "./components/Layout";
import ModeScreen from "./screens/ModeScreen";
import FilterTypeScreen from "./screens/FilterTypeScreen";
import FilterValueScreen from "./screens/FilterValueScreen";
import QuizScreen from "./screens/QuizScreen";
import ScoreScreen from "./screens/ScoreScreen";
import Loader from "./components/Loader";
import AuthScreen from "./screens/AuthScreen";
import {
  fetchQuestionsByMonth,
  fetchQuestionsByTopic,
  onAuthStateChange,
  signOut,
  getCurrentUser,
  fetchBookmarkIds,
  fetchQuestionsByIds,
  addBookmark,
  removeBookmark,
} from "./api/supabaseApi";

const App = () => {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [screen, setScreen] = useState("mode");
  const [activeRoute, setActiveRoute] = useState("home");
  const [mode, setMode] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [lastQuiz, setLastQuiz] = useState(null);
  const [reviewAnswers, setReviewAnswers] = useState({});
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(new Map());

  useEffect(() => {
    const fetchInitialData = async (user) => {
      if (user) {
        const bookmarkIds = await fetchBookmarkIds(user.id);
        const questionsData = await fetchQuestionsByIds(bookmarkIds);
        setBookmarkedQuestions(new Map(questionsData.map((q) => [q.id, q])));
      } else {
        setBookmarkedQuestions(new Map());
      }
    };

    const setupAuthListener = () => {
      const subscription = onAuthStateChange(async (session) => {
        setSession(session);
        await fetchInitialData(session?.user);
      });
      return subscription;
    };

    const checkCurrentUser = async () => {
      setLoadingSession(true);
      const user = await getCurrentUser();
      if (user) {
        setSession({ user });
        await fetchInitialData(user);
      }
      setLoadingSession(false);
    };

    checkCurrentUser();
    const subscription = setupAuthListener();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
      if (target === "bookmarks") {
        setActiveRoute("bookmarks");
        const bookmarkedArray = Array.from(bookmarkedQuestions.values());

        if (bookmarkedArray.length > 0) {
          setQuestions(bookmarkedArray);
          setMode("review");
          setScreen("quiz");
        } else {
          setScreen("emptyBookmarks");
        }
        return;
      }
      if (target === "emptyBookmarks") {
        setActiveRoute("bookmarks");
        setScreen("emptyBookmarks");
        return;
      }
      resetToHome();
    },
    [resetToHome, bookmarkedQuestions]
  );

  const handleBookmarkUpdate = async (question, isCurrentlyBookmarked) => {
    if (!session?.user) return;
    const { user } = session;

    const newBookmarks = new Map(bookmarkedQuestions);
    if (isCurrentlyBookmarked) {
      await removeBookmark(user.id, question.id);
      newBookmarks.delete(question.id);
    } else {
      await addBookmark(user.id, question.id);
      newBookmarks.set(question.id, question);
    }
    setBookmarkedQuestions(newBookmarks);

    // If we are on the bookmarks screen, update the live question list
    if (activeRoute === "bookmarks") {
      const newQuestions = Array.from(newBookmarks.values());
      setQuestions(newQuestions);
      if (newQuestions.length === 0) {
        handleNavigate("emptyBookmarks");
      }
    }
  };

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

  const renderAppContent = () => {
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
            key={questions.length} // Force re-mount when the number of questions changes
            questions={questions}
            mode={mode}
            onQuizEnd={handleQuizEnd}
            handleNavigate={handleNavigate}
            initialAnswers={reviewAnswers}
            activeRoute={activeRoute}
            bookmarkedQuestions={bookmarkedQuestions}
            onBookmarkUpdate={handleBookmarkUpdate}
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
      case "emptyBookmarks":
        return (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">No Bookmarks Yet</h1>
            <p className="text-gray-400 my-4">
              You can bookmark questions during any quiz.
            </p>
            <button className="nav-button bg-indigo-600" onClick={resetToHome}>
              Back to Home
            </button>
          </div>
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

  if (loadingSession) return <Loader />;
  if (!session) return <AuthScreen />;

  return (
    <Layout
      user={session.user}
      onSignOut={signOut}
      onNavigate={handleNavigate}
      activeRoute={activeRoute}
    >
      {renderAppContent()}
    </Layout>
  );
};

export default App;
