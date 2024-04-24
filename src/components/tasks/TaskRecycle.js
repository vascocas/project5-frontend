import React, { useEffect } from "react";
import { taskStore } from "../../stores/TaskStore";
import { userStore } from "../../stores/UserStore";
import { baseURL } from "../../pages/Requests";
import MediaType from "../media/MediaType";
import "../../pages/RecycleBin.css";

const TaskRecycle = () => {
  const { deletedTasks, setDeletedTasks } = taskStore();
  const { token } = userStore();
  const { role } = userStore(state => state);

  const mediatype = userStore((state) => state.mediatype);

  // Call MediaType component to handle media type detection
  MediaType();
  console.log("Task Recycle Media Type: ", mediatype);

  useEffect(() => {
    const fetchDeletedTasks = async () => {
      try {
        const response = await fetch(
          `${baseURL}tasks/deletedTasks`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "*/*",
              token: token,
            },
          }
        );
        if (response.ok) {
          const tasks = await response.json();
          setDeletedTasks(tasks);
        } else {
          console.log(`No deleted tasks found: ${await response.text()}`
          );
        }
      } catch (error) {
        console.error("No deleted tasks found:", error);
      }
    };

    fetchDeletedTasks();
  }, [token, setDeletedTasks]);

  const restoreTask = async (taskId) => {
    const confirmation = window.confirm("Confirm restore task?");
    if (!confirmation) {
      return; // User cancelled the operation
    }
    try {
      const response = await fetch(
        `${baseURL}tasks/restoreDeleted/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            token: token,
          },
        }
      );
      const message = await response.text();
      if (response.ok) {
        console.log(message);
        taskStore.getState().restoreTask(taskId); // Update taskStore
      } else {
        console.log(message);
      }
    } catch (error) {
      console.error("Error restoring task:", error);
    }
  };

  const removeTask = async (taskId) => {
    const confirmation = window.confirm("Confirm remove task?");
    if (!confirmation) {
      return; // User cancelled the operation
    }
    try {
      const response = await fetch(
        `${baseURL}tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            token: token,
          },
        }
      );
      const message = await response.text();
      if (response.ok) {
        console.log(message);
        taskStore.getState().removeTask(taskId); // Update taskStore
      } else {
        console.log(message);
      }
    } catch (error) {
      console.error("Error removing task:", error);
    }
  };

  return (
    <table className="table-recycle">
      <thead className="table-header-recycle">
        <tr>
          <th className="table-header-recycle">Id</th>
          {mediatype.isBigScreen && (
            <th className="table-header-recycle">Title</th>
          )}
          {role === "PRODUCT_OWNER" && (
            <th className="table-header-recycle">Actions</th>
          )}
        </tr>
      </thead>
      <tbody>
        {deletedTasks.map((task) => (
          <tr key={task.id}>
            <td className="table-row-recycle">{task.id}</td>
            {mediatype.isBigScreen && (
              <td className="table-row-recycle">{task.title}</td>
            )}
            {role === "PRODUCT_OWNER" && (
              <td>
                <button
                  className="recycle-button"
                  onClick={() => restoreTask(task.id)}
                >
                  Restore Task
                </button>
                <button
                  className="recycle-button"
                  onClick={() => removeTask(task.id)}
                >
                  Remove Task
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TaskRecycle;
