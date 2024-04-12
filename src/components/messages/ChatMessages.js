import { baseURL } from "../../pages/Requests";
import { websocketStore } from "../../stores/WebSocketStore.js";

export const fetchChatMessages = async (userId, token, loggedId) => {
  const { setChatMessages } = websocketStore();

  try {
    const url = `${baseURL}messages/chat/${loggedId}/${userId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    });
    if (response.ok) {
      const messagesData = await response.json();
      setChatMessages(messagesData);
    } else {
      console.error("Failed to fetch messages:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};
