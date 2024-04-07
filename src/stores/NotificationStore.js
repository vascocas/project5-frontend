import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const storage = createJSONStorage(() => sessionStorage);

export const notificationStore = create(
  persist(
    (set) => ({
      notifications: [], // state variable to keep all notifications
      updateNotifications: (notifications) => set({ notifications }), // Corrected: call set with updated state
      addNotification: (newNotification) =>
        set((state) => ({
          notifications: [...state.notifications, newNotification],
        })), // a function to add a new notification to the list of notifications
      unreadCount: 0,
      setUnreadCount: (count) => set({ unreadCount: count }), // Function to update unread count
    }),
    {
      name: "myNotifStore",
      storage: storage,
    }
  )
);
