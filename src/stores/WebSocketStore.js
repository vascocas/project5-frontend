import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const storage = createJSONStorage(() => sessionStorage);

export const websocketStore = create(
  persist(
    (set) => ({
      notifications: [], // state variable to keep all notifications
      updateNotifications: (notifications) => set({ notifications }),
      addNotification: (newNotification) =>
        set((state) => ({
          notifications: [...state.notifications, newNotification],
          unreadCount: state.unreadCount + (newNotification.readStatus ? 0 : 1), // Increment unreadCount if the new notification is unread
        })), // a function to add a new notification to the list of notifications
      unreadCount: 0,
      setUnreadCount: (count) => set({ unreadCount: count }), // Function to update unread count

      // New state variables and functions for chat messages
      chatMessages: [],
      newMessage: "",
      chatId: "",

      // Function to add a new message to the list of chat messages
      addMessage: (message) =>
        set((state) => ({
          chatMessages: [...state.chatMessages, message],
        })),

      // Function to set chat messages
      setChatMessages: (messages) => set({ chatMessages: messages }),

      // Function to set chatId
      setChatId: (chatId) => set({ chatId }),
    }),

    {
      name: "myWebSocketStore",
      storage: storage,
    }
  )
);
