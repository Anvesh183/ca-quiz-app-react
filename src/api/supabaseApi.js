import { supabase } from "../supabaseClient";

// --- UNIFIED FETCH FUNCTIONS ---

export const fetchTopics = async (subject) => {
  let query = supabase.from("questions").select("topic");

  if (subject === "computerAwareness") {
    query = query.eq("category", "Computer Awareness");
  } else {
    query = query.neq("category", "Computer Awareness");
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching topics:", error);
    throw new Error(error.message);
  }
  const uniqueTopics = [...new Set(data.map((item) => item.topic))].sort();
  return uniqueTopics;
};

export const fetchQuestionsByTopic = async (topicName, subject) => {
  let query = supabase.from("questions").select("*").eq("topic", topicName);

  if (subject === "computerAwareness") {
    query = query.eq("category", "Computer Awareness");
  } else {
    query = query.neq("category", "Computer Awareness");
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching questions by topic:", error);
    throw new Error(error.message);
  }
  return data;
};

export const fetchQuestionsByMonth = async (monthId) => {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("month", monthId)
    .neq("category", "Computer Awareness");

  if (error) {
    console.error("Error fetching questions by month:", error);
    throw new Error(error.message);
  }
  return data;
};

// --- NEW MOCK TEST FUNCTION ---
export const fetchComputerMockTestQuestions = async (mockId) => {
  const { data, error } = await supabase
    .from("mock_questions")
    .select("questions(*)") // Select all columns from the joined 'questions' table
    .eq("mock_id", mockId); // Filter by the mock test ID

  if (error) {
    console.error("Error fetching mock test questions:", error);
    throw new Error(error.message);
  }
  // The result is an array of objects, where each object has a 'questions' property.
  // We need to extract just the question data.
  return data.map((item) => item.questions);
};

// --- AUTHENTICATION, BOOKMARK, and HISTORY FUNCTIONS (No changes needed) ---
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
  } = supabase.auth.onAuthStateChange((_event, session) => {
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
    .eq("user_id", userId)
    .eq("question_id", questionId);
  if (error) console.error("Error removing bookmark:", error);
};

export const saveQuizResult = async (result) => {
  const { data, error } = await supabase.from("quiz_history").insert([result]);

  if (error) {
    console.error("Error saving quiz result:", error);
  }
  return data;
};

export const fetchQuizHistory = async (userId) => {
  if (!userId) return [];
  const { data, error } = await supabase
    .from("quiz_history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching quiz history:", error);
    return [];
  }
  return data;
};

export const clearQuizHistory = async (userId) => {
  if (!userId) return;
  const { error } = await supabase
    .from("quiz_history")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error("Error clearing quiz history:", error);
    throw error;
  }
};
