import axios from "axios";

const BASE_URL = "http://localhost:8080";

// Helper for headers
const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getSessions = (token) =>
  axios.get(`${BASE_URL}/chat/sessions`, getAuthHeader(token));

// NEW: Load messages for a specific session
export const getChatHistory = (token, sessionId) =>
  axios.get(`${BASE_URL}/chat/session/${sessionId}/messages`, getAuthHeader(token));

export const startNewSession = (token) =>
  axios.post(`${BASE_URL}/chat/new-session`, {}, getAuthHeader(token));

export const sendMessage = (token, payload) =>
  axios.post(`${BASE_URL}/chat`, payload, getAuthHeader(token));

// NEW: Rename a session
export const renameSession = (token, sessionId, newTitle) =>
  axios.put(`${BASE_URL}/chat/session/${sessionId}`, newTitle, {
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "text/plain" // Important since we're sending a raw string
    },
  });

// NEW: Delete a session
export const deleteSession = (token, sessionId) =>
  axios.delete(`${BASE_URL}/chat/session/${sessionId}`, getAuthHeader(token));

export const sendFeedback = (token, messageId, helpful) =>
  axios.post(
    `${BASE_URL}/feedback/${messageId}?helpful=${helpful}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
