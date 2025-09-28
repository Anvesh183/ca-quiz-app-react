import { supabase } from "../supabaseClient";

/**
 * Fetches a unique, sorted list of all topics from the database.
 */
export const fetchTopics = async () => {
  const { data, error } = await supabase.from("questions").select("topic");

  if (error) {
    console.error("Error fetching topics:", error);
    throw new Error(error.message);
  }

  // Use a Set to get unique topic names and then sort them
  const uniqueTopics = [...new Set(data.map((item) => item.topic))].sort();
  return uniqueTopics;
};

/**
 * Fetches all questions for a specific topic.
 * @param {string} topicName - The name of the topic to fetch questions for.
 */
export const fetchQuestionsByTopic = async (topicName) => {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("topic", topicName);

  if (error) {
    console.error("Error fetching questions by topic:", error);
    throw new Error(error.message);
  }
  return data;
};

/**
 * Fetches all questions for a specific month.
 * @param {string} monthId - The identifier for the month (e.g., 'september-2025').
 */
export const fetchQuestionsByMonth = async (monthId) => {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("month", monthId); // This now queries the 'month' column you created

  if (error) {
    console.error("Error fetching questions by month:", error);
    throw new Error(error.message);
  }
  return data;
};
