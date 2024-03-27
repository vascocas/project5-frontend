import React, { useState, useEffect } from "react";
import { userStore } from "../../stores/UserStore";
import "./TasksBoard.css";

const UsersFilter = ({ onFilter }) => {
  const { token, usernames, setUsernames } = userStore();
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        if (!token) {
          return; // Exit early in the logout
        }
        const response = await fetch(
          "http://localhost:8080/project4vc/rest/users/usernames",
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
          const usersArray = await response.json();
          setUsernames(usersArray);
        } else {
          console.error(`Failed to fetch users: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsernames();
  }, [token, setUsernames]);

  const handleFilter = () => {
    if (selectedUser) {
       // Call the onFilter function with the selected user
      onFilter(selectedUser);
       // Reset the selectedUser state to clear the dropdown menu
       setSelectedUser("");
    }
  };

  return (
    <div>
      <label htmlFor="user">Tasks by User: </label>
      <br></br>
      <select
      className="user-filter-select"
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
      <button className="user-filter" onClick={handleFilter}>Filter</button>
    </div>
  );
};

export default UsersFilter;
