import React, { useEffect, useState } from "react";
import { userStore } from "../../stores/UserStore";
import { taskStore } from "../../stores/TaskStore";
import { compareTasks } from "./TaskUtils";
import TaskColumn from "./TaskColumn";
import TasksUserFilter from "./TasksUserFilter";
import TasksCategoryFilter from "./TasksCategoryFilter";
import RemoveUserTasks from "./RemoveUserTasks";
import "./TasksBoard.css";

function TasksBoard() {
  const { token } = userStore();
  const { role } = userStore(state => state);
  const { tasks, setTasks } = taskStore();
  const [filteredUserId, setFilteredUserId] = useState("");
  const [filteredCategoryId, setFilteredCategoryId] = useState("");

  // Define fetchTasks function
  const fetchTasks = async () => {
    if (!token) {
      return; // If token is not present, exit the function early
    }
    try {
      let url = "http://localhost:8080/project4vc/rest/tasks";
      if (filteredUserId) {
        url += `/user/?userId=${filteredUserId}`;
      } else if (filteredCategoryId) {
        url += `/category/?categoryId=${filteredCategoryId}`;
      }
      const response = await fetch(url, 
        { method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });

      if (response.ok) {
        let tasks = await response.json();
        console.log("HTTP request to fetch tasks successful");
        tasks = sortTasks(tasks); // Sort tasks before setting state
        setTasks(tasks);
      } else {
        const message = await response.text();
        console.error("Tasks array is empty:", message);
        setTasks([]);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to fetch tasks. Please try again.");
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token, filteredUserId, filteredCategoryId, ]);

  // Function to sort tasks by priority, start date, and end date
  function sortTasks(tasks) {
    return tasks.slice().sort(compareTasks); // Use slice() to avoid mutating original tasks array
  }

  const handleUserFilter = (userId) => {
    setFilteredUserId(userId);
    setFilteredCategoryId(""); // Reset category filter
  };

  const handleCategoryFilter = (categoryId) => {
    setFilteredCategoryId(categoryId);
    setFilteredUserId(""); // Reset user filter
  };

  const fetchAllTasks = () => {
    // Clear both filters
    setFilteredUserId("");
    setFilteredCategoryId("");
  };

  return (
    <div>
      <div className="filters">
      {(role === "PRODUCT_OWNER" || role === "SCRUM_MASTER") && (<div className="filters-box">
         <h3 id="filtersTitle">Filters</h3>
          <TasksUserFilter onFilter={handleUserFilter} />
          <TasksCategoryFilter onFilter={handleCategoryFilter} />
          <button id="clearButton" onClick={fetchAllTasks}>
            Clear </button>
        </div>)}
        <div className="remove-user-tasks">
        {role === "PRODUCT_OWNER" && ( <h3 id="filtersTitle">Remove Tasks</h3>)}
        {role === "PRODUCT_OWNER" && (<RemoveUserTasks fetchTasks={fetchTasks}/>)}
        </div>
      </div>
      <div className="task-columns">
        <TaskColumn
          title="TODO"
          tasks={tasks.filter((task) => task.state === "TODO")}
        />
        <TaskColumn
          title="DOING"
          tasks={tasks.filter((task) => task.state === "DOING")}
        />
        <TaskColumn
          title="DONE"
          tasks={tasks.filter((task) => task.state === "DONE")}
        />
      </div>
    </div>
  );
}

export default TasksBoard;
