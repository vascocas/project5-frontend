import React, { useState } from "react";
import { userStore } from "../../stores/UserStore";
import { taskStore } from "../../stores/TaskStore";
import { baseURL } from "../../pages/Requests";
import "./TasksBoard.css";

const RemoveUserTasks = () => {
  const { token, usernames } = userStore();
  const { tasks, setTasks } = taskStore();
  const [selectedUser, setSelectedUser] = useState("");

  // Remove all tasks from the selected user (move to recycle bin)
  const handleRemove = async () => {
    if (selectedUser) {
      try {
        const response = await fetch(
          `${baseURL}tasks/updateDeleted/?userId=${selectedUser}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
          }
        );
        if (response.ok) {
          const deletedTasks = await response.json();
          console.log("Deleted tasks:", deletedTasks);

          // Remove deleted tasks from the tasks array
          const actualTasks = tasks.filter(
            (task) =>
              !deletedTasks.some((deletedTask) => deletedTask.id === task.id)
          );
          setTasks(actualTasks);
          setSelectedUser("");
        } else {
          console.error(`Error: ${response.status}`);
          setSelectedUser("");
        }
      } catch (error) {
        console.error("Error removing tasks:", error);
      }
    }
  };

  return (
    <div>
      <label htmlFor="user">Remove all user tasks:</label>
      <br />
      <select
        className="remove-all-select"
        id="user"
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">Select Username</option>
        {usernames.map((username) => (
          <option key={username.id} value={username.id}>
            {username.username}
          </option>
        ))}
      </select>
      <button className="remove-all" onClick={handleRemove}>
        Remove
      </button>
    </div>
  );
};

export default RemoveUserTasks;
