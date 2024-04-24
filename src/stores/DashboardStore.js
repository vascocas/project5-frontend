import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Create JSON storage using sessionStorage
const storage = createJSONStorage(() => sessionStorage);

// Create the dashboard store
export const dashboardStore = create(
  // Apply persistence middleware to the store
  persist(
    // Define the store's state and actions
    (set) => ({
      totalUsers: 0,
      validatedUsers: 0,
      nonValidatedUsers: 0,
      userRegistrations: [],
      averageTasksPerUser: 0,
      averageTasksDuration: 0,
      tasksPerStatus: {},
      categoriesFrequency: [],
      tasksCompletedOverTime: [],
      // Define actions to update the state
      setTotalUsers: (totalUsers) => set({ totalUsers }),
      setValidatedUsers: (validatedUsers) => set({ validatedUsers }),
      setNonValidatedUsers: (nonValidatedUsers) => set({ nonValidatedUsers }),
      setUserRegistrations: (userRegistrations) => set({ userRegistrations }),
      setAverageTasksPerUser: (averageTasksPerUser) =>
        set({ averageTasksPerUser }),
      setAverageTasksDuration: (averageTasksDuration) =>
        set({ averageTasksDuration }),
      setTasksPerStatus: (tasksPerStatus) => set({ tasksPerStatus }),
      setCategoriesFrequency: (categoriesFrequency) =>
        set({ categoriesFrequency }),
      setTasksCompletedOverTime: (tasksCompletedOverTime) =>
        set({ tasksCompletedOverTime }),
    }),
    {
      // Configuration for persistence
      name: "myDashboardStore",
      storage: storage,
    }
  )
);
