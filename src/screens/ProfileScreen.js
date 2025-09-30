import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchQuizHistory, clearQuizHistory } from "../api/supabaseApi";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const ProfileScreen = ({ user }) => {
  const queryClient = useQueryClient();
  const { data: history, isLoading } = useQuery({
    queryKey: ["quizHistory", user.id],
    queryFn: () => fetchQuizHistory(user.id),
  });
  const [isClearing, setIsClearing] = useState(false);

  const handleClearHistory = async () => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete all your quiz history? This action cannot be undone."
      )
    ) {
      setIsClearing(true);
      try {
        await clearQuizHistory(user.id);
        // This tells React Query to immediately refetch the history data.
        queryClient.invalidateQueries({ queryKey: ["quizHistory", user.id] });
        toast.success("Quiz history cleared successfully.");
      } catch (error) {
        toast.error(
          "Failed to clear history. Please check permissions and try again."
        );
        console.error("Clear history error:", error);
      } finally {
        setIsClearing(false);
      }
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  const totalQuizzes = history?.length || 0;
  const averageScore =
    totalQuizzes > 0
      ? Math.round(
          history.reduce((acc, item) => acc + item.score, 0) / totalQuizzes
        )
      : 0;

  const totalCorrect =
    history?.reduce((acc, item) => acc + item.correct_count, 0) || 0;
  const totalIncorrect =
    history?.reduce((acc, item) => acc + item.incorrect_count, 0) || 0;
  const totalQuestions = totalCorrect + totalIncorrect;
  const overallAccuracy =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return (
    <div id="screen-profile">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Your Profile & Performance
      </h1>
      <p className="text-gray-400 mb-8">
        Hello, {user.user_metadata?.full_name || user.email}!
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="score-card">
          <p>Quizzes Taken</p>
          <p id="total-quizzes">{totalQuizzes}</p>
        </div>
        <div className="score-card">
          <p>Average Score</p>
          <p id="average-score">{averageScore}%</p>
        </div>
        <div className="score-card">
          <p>Overall Accuracy</p>
          <p id="overall-accuracy">{overallAccuracy}%</p>
        </div>
        <div className="score-card">
          <p>Correct Answers</p>
          <p id="correct-count" className="text-green-400">
            {totalCorrect}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Quiz History</h2>
        {history && history.length > 0 && (
          <button
            onClick={handleClearHistory}
            disabled={isClearing}
            className="text-sm nav-button bg-red-700 text-red-200 hover:bg-red-600 disabled:opacity-50"
          >
            {isClearing ? "Clearing..." : "Clear History"}
          </button>
        )}
      </div>
      <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-700 text-xs uppercase">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Quiz Details
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Correct
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Incorrect
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {history && history.length > 0 ? (
                history.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-700 hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4">
                      {(() => {
                        const date = new Date(item.created_at);
                        const day = String(date.getDate()).padStart(2, "0");
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          "0"
                        );
                        const year = String(date.getFullYear()).slice(-2);
                        return `${day}/${month}/${year}`;
                      })()}
                    </td>
                    <td className="px-6 py-4 font-medium capitalize">
                      {item.quiz_type}: {item.quiz_filter}
                    </td>
                    <td className="px-6 py-4 text-center text-green-400">
                      {item.correct_count}
                    </td>
                    <td className="px-6 py-4 text-center text-red-400">
                      {item.incorrect_count}
                    </td>
                    <td className="px-6 py-4 text-center font-bold">
                      {item.score}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">
                    You haven't completed any quizzes yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
