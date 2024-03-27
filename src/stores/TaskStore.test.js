import { act } from "@testing-library/react";
import { taskStore } from "./TaskStore";

describe("Task Store", () => {
  beforeEach(() => {
    // Reset the task store before each test
    taskStore.setState({
      tasks: [],
      deletedTasks: [],
      categories: [],
      taskId: null,
    });
  });

  it("should add a task", () => {
    const newTask = { id: 1, title: "New Task", category: "General" };

    // Add a new task
    act(() => {
      taskStore.getState().addTask(newTask);
    });

    // Assert that the task has been added
    expect(taskStore.getState().tasks).toContainEqual(newTask);
  });

  it("should delete a task", () => {
    const taskToDelete = { id: 1, title: "Task to Delete", category: "General" };

    // Add a task to delete
    act(() => {
      taskStore.getState().setTasks([taskToDelete]);
    });

    // Delete the task
    act(() => {
      taskStore.getState().deleteTask(taskToDelete.id);
    });

    // Assert that the task has been deleted
    expect(taskStore.getState().tasks).not.toContainEqual(taskToDelete);
  });
});
