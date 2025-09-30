import React, { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import Layout from "./components/Layout";
import ModeScreen from "./screens/ModeScreen";
import FilterTypeScreen from "./screens/FilterTypeScreen";
import FilterValueScreen from "./screens/FilterValueScreen";
import QuizScreen from "./screens/QuizScreen";
import ScoreScreen from "./screens/ScoreScreen";
import Loader from "./components/Loader";
import AuthScreen from "./screens/AuthScreen";
import ProfileScreen from "./screens/ProfileScreen";
import {
  fetchQuestionsByMonth,
  fetchQuestionsByTopic,
  fetchComputerMockTestQuestions,
  onAuthStateChange,
  signOut,
  getCurrentUser,
  fetchBookmarkIds,
  fetchQuestionsByIds,
  addBookmark,
  removeBookmark,
  saveQuizResult,
  clearQuizHistory,
} from "./api/supabaseApi";

const App = () => {
  const queryClient = useQueryClient();
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [screen, setScreen] = useState("mode");
  const [activeRoute, setActiveRoute] = useState("currentAffairs");
  const [subject, setSubject] = useState("currentAffairs");
  const [mode, setMode] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [lastQuiz, setLastQuiz] = useState(null);
  const [reviewAnswers, setReviewAnswers] = useState({});
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(new Map());
  const [lastQuizFilterValue, setLastQuizFilterValue] = useState(null);

  // ... (useEffect, resetToHome, handleNavigate, etc. remain the same)
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
    const subscription = onAuthStateChange((session) => {
      setSession(session);
      fetchInitialData(session?.user);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const resetToHome = useCallback(() => {
    setActiveRoute("currentAffairs");
    setSubject("currentAffairs");
    setScreen("mode");
    setMode(null);
    setFilterType(null);
    setReviewAnswers({});
  }, []);

  const handleNavigate = useCallback(
    (target) => {
      setReviewAnswers({});
      if (target === "currentAffairs") {
        setActiveRoute("currentAffairs");
        setSubject("currentAffairs");
        setScreen("mode");
        return;
      }
      if (target === "computerAwareness") {
        setActiveRoute("computerAwareness");
        setSubject("computerAwareness");
        setScreen("mode");
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
      if (target === "profile") {
        setActiveRoute("profile");
        setScreen("profile");
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
    setLastQuizFilterValue(value);
    try {
      let fetchedQuestions = [];

      if (filterType === "month") {
        fetchedQuestions = await fetchQuestionsByMonth(value);
      } else if (filterType === "topic") {
        fetchedQuestions = await fetchQuestionsByTopic(value, subject);
      } else if (filterType === "mockTest") {
        fetchedQuestions = await fetchComputerMockTestQuestions(value);
      }

      if (fetchedQuestions.length === 0) {
        toast.error("No questions found for this selection.");
        setScreen("filterValue");
      } else {
        setQuestions(fetchedQuestions);
        setScreen("quiz");
      }
    } catch (error) {
      toast.error("Could not load questions.");
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
    if (session?.user && mode !== "review") {
      saveQuizResult({
        user_id: session.user.id,
        score: results.score,
        correct_count: results.correct,
        incorrect_count: results.incorrect,
        unattempted_count: results.unattempted,
        quiz_type: filterType,
        quiz_filter: lastQuizFilterValue,
      });
      queryClient.invalidateQueries({
        queryKey: ["quizHistory", session.user.id],
      });
    }
  };

  const handleReview = () => {
    setQuestions(lastQuiz.questions);
    setMode("review");
    setReviewAnswers(lastQuiz.userAnswers);
    setScreen("quiz");
  };

  const handleReviewMistakes = () => {
    const incorrectQuestions = lastQuiz.questions.filter((q, index) => {
      return (
        lastQuiz.userAnswers[index] && lastQuiz.userAnswers[index] !== q.answer
      );
    });
    if (incorrectQuestions.length > 0) {
      setQuestions(incorrectQuestions);
      setMode("review");
      setReviewAnswers(lastQuiz.userAnswers);
      setScreen("quiz");
    } else {
      toast.success("You had no incorrect answers to review!");
    }
  };

  const handleClearHistory = async () => {
    if (!session?.user) return;
    try {
      await clearQuizHistory(session.user.id);
      queryClient.invalidateQueries({
        queryKey: ["quizHistory", session.user.id],
      });
      toast.success("Quiz history cleared successfully.");
    } catch (error) {
      toast.error("Failed to clear history. Please try again.");
      console.error("Clear history error:", error);
    }
  };

  const renderAppContent = () => {
    if (loading) return <Loader />;

    switch (screen) {
      case "mode":
        return (
          <ModeScreen
            subject={subject} // Pass the subject to the screen
            onSelectMode={(m) => {
              setMode(m);
              setScreen("filterType");
            }}
          />
        );
      case "filterType":
        return (
          <FilterTypeScreen
            subject={subject}
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
            subject={subject}
            filterType={filterType}
            onSelectFilterValue={handleSelectFilterValue}
            onBack={() => setScreen("filterType")}
          />
        );
      case "quiz":
        return (
          <QuizScreen
            key={questions.map((q) => q.id).join("-")}
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
            onReviewMistakes={handleReviewMistakes}
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
              Go to Quizzes
            </button>
          </div>
        );
      case "profile":
        return (
          <ProfileScreen
            user={session.user}
            onClearHistory={handleClearHistory}
          />
        );
      default:
        return (
          <ModeScreen
            subject={subject}
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
