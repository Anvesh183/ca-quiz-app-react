import { supabase } from "../supabaseClient";

/**
 * Fetches a unique, sorted list of all topics.
 */
export const fetchTopics = async () => {
  const { data, error } = await supabase.from("questions").select("topic");
  if (error) {
    console.error("Error fetching topics:", error);
    throw new Error(error.message);
  }
  const uniqueTopics = [...new Set(data.map((item) => item.topic))].sort();
  return uniqueTopics;
};

/**
 * Fetches all questions for a specific topic.
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
 */
export const fetchQuestionsByMonth = async (monthId) => {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("month", monthId);
  if (error) {
    console.error("Error fetching questions by month:", error);
    throw new Error(error.message);
  }
  return data;
};

// --- AUTHENTICATION FUNCTIONS ---
export const signUp = async (email, password, fullName, phone) => {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone,
      },
    },
  });
};

export const signIn = async (email, password) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return supabase.auth.signOut();
};

export const onAuthStateChange = (callback) => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session);
  });
  return subscription;
};

export const getCurrentUser = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user ?? null;
};

export const sendPasswordResetEmail = async (email) => {
  const redirectTo = window.location.origin;
  return supabase.auth.resetPasswordForEmail(email, { redirectTo });
};

// --- DATABASE-DRIVEN BOOKMARK FUNCTIONS ---

export const fetchBookmarkIds = async (userId) => {
  if (!userId) return [];
  const { data, error } = await supabase
    .from("bookmarks")
    .select("question_id")
    .eq("user_id", userId);
  if (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }
  return data.map((b) => b.question_id);
};

export const fetchQuestionsByIds = async (questionIds) => {
  if (!questionIds || questionIds.length === 0) return [];
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .in("id", questionIds);
  if (error) {
    console.error("Error fetching questions by IDs:", error);
    return [];
  }
  return data;
};

export const addBookmark = async (userId, questionId) => {
  const { error } = await supabase
    .from("bookmarks")
    .insert([{ user_id: userId, question_id: questionId }]);
  if (error) console.error("Error adding bookmark:", error);
};

export const removeBookmark = async (userId, questionId) => {
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .match({ user_id: userId, question_id: questionId });
  if (error) console.error("Error removing bookmark:", error);
};
