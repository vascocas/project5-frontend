import React, { useState } from "react";
import { userStore } from "../../stores/UserStore";
import "./TasksBoard.css";

const RemoveUserTasks = ({ fetchTasks }) => {
  const { token, usernames } = userStore();
  const [selectedUser, setSelectedUser] = useState("");

  // Remove all tasks from the selected user (move to recycle bin)
  const handleRemove = async () => {
    if (selectedUser) {
      try {
        const response = await fetch(
          `http://localhost:8080/project4vc/rest/tasks/updateDeleted/?userId=${selectedUser}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
          }
        );
        if (response.ok) {
          const message = await response.text();
          console.log(message);
          fetchTasks();
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
      <button className="remove-all" onClick={handleRemove}>Remove</button>
    </div>
  );
};

export default RemoveUserTasks;
