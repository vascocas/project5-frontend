import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const storage = createJSONStorage(() => sessionStorage);

export const userStore = create(
  persist(
    (set) => ({
      username: "",
      updateUsername: (username) => set({ username }),
      token: "",
      updateToken: (token) => set({ token }),
      role: "",
      updateRole: (role) => set({ role }),
      photo: "",
      updatePhoto: (photo) => set({ photo }),
      isLoginPage: true,
      setIsLoginPage: (value) => set((state) => ({ ...state, isLoginPage: value })),
      users: [],
      setUsers: (users) => set({ users }),
      deletedUsers: [],
      setDeletedUsers: (newDeletedUsers) => set({ deletedUsers: newDeletedUsers }),
      removeDeletedUser: (userId) => set((state) => ({ deletedUsers: state.deletedUsers.filter(user => user.id !== userId) })),
      usernames: [],
      setUsernames: (usernames) => set({ usernames }),
      selectedProfileUsername: "", // New state variable for selected profile username
      setSelectedProfileUsername: (username) => set({ selectedProfileUsername: username }), // Function to update selected profile username
      updateMediatype: (mediatype) => set({mediatype}),
      notifications: [], // state variable to keep all notifications
      updateNotifications: (notifications) => set=({notifications}), // a function to update the list of notifications
      addNotification: (newNotification) => set((state) => ({notifications:[...state.notifications, newNotification]})) // a function to add a new notification to the list of notifications
    }),
    {
      name: "myUserStore",
      storage: storage,
    }
  )
);
