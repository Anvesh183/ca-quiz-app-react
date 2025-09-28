// const API_BASE_URL = "https://quiz-api-asjx.onrender.com";

// export const fetchTopics = async () => {
//   const response = await fetch(`${API_BASE_URL}/topics`);
//   if (!response.ok) {
//     throw new Error("Failed to fetch topics");
//   }
//   return response.json();
// };

// // This function fetches ALL questions and should only be used if needed
// export const fetchAllQuestions = async () => {
//   const response = await fetch(`${API_BASE_URL}/questions`);
//   if (!response.ok) {
//     throw new Error("Network response was not ok");
//   }
//   const questions = await response.json();
//   return questions.map((q) => ({ ...q, monthId: "all" }));
// };

// export const fetchQuestionsByMonth = async (monthId) => {
//   const response = await fetch(`${API_BASE_URL}/questions/${monthId}`);
//   if (!response.ok) {
//     throw new Error("Network response was not ok");
//   }
//   const questions = await response.json();
//   return questions.map((q) => ({ ...q, monthId }));
// };

// // --- THIS IS THE NEW, EFFICIENT FUNCTION ---
// // It fetches only the questions for a specific topic from the backend
// export const fetchQuestionsByTopic = async (topicName) => {
//   // We use encodeURIComponent to handle special characters in topic names
//   const encodedTopic = encodeURIComponent(topicName);
//   const response = await fetch(
//     `${API_BASE_URL}/questions/topic/${encodedTopic}`
//   );
//   if (!response.ok) {
//     throw new Error(`Failed to fetch questions for topic ${topicName}`);
//   }
//   return response.json();
// };
