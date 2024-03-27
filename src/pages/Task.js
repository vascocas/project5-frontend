import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/navbar/Sidebar";
import { userStore } from "../stores/UserStore";
import { taskStore } from "../stores/TaskStore";
import { useNavigate } from "react-router-dom";
import "./Task.css";
import "../index.css";

function Task() {
  const { token, username } = userStore();
  const { role } = userStore(state => state);
  const [task, setTask] = useState(null);
  const { categories, taskId, updateTask } = taskStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        if (token && taskId) {
          const response = await fetch(
            `http://localhost:8080/project4vc/rest/tasks/${taskId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                token: token,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setTask(data);
          } else {
            console.error("Failed to fetch task:", response.statusText);
          }
        }
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };
    // Call fetchTask once when the component mounts
    fetchTask();
  }, [token, taskId, categories]);
  

  // Function to handle updating task details
  const handleUpdateTask = async () => {
    try {
      const taskData = {
        id: task.id,
        title: task.title,
        description: task.description,
        startDate: task.startDate,
        endDate: task.endDate,
        priority: task.priority,
        category: task.category
      };
      const requestBody = JSON.stringify(taskData);
      const response = await fetch(
        "http://localhost:8080/project4vc/rest/tasks/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: requestBody,
        }
      );
      if (response.ok) {
        const updatedTask = await response.json();
        updateTask(updatedTask);
        console.log("Task updated successfully");
        navigate("/Home");
      } else {
        const errorMessage = await response.text();
        console.error(errorMessage);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  if (!task || categories.length === 0) {
    return <div>Trouble while loading information...</div>;
  }

  return (
    <div className="Task" id="task-outer-container">
      <Header />
      <Sidebar
        pageWrapId={"task-page-wrap"}
        outerContainerId={"task-outer-container"}
      />
      <div className="task-details">
        <h2>Task Details</h2>
        <label htmlFor="taskName">Title</label>
        <input
          type="text"
          id="taskName"
          placeholder="Insert title"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
        />
        <label htmlFor="taskDescription">Description</label>
        <textarea
          id="taskDescription"
          placeholder="Insert description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
        ></textarea>
        <label htmlFor="startDate">Start date</label>
        <input
          type="date"
          id="startDate"
          value={task.startDate}
          onChange={(e) => setTask({ ...task, startDate: e.target.value })}
        />
        <label htmlFor="endDate">End date</label>
        <input
          type="date"
          id="endDate"
          value={task.endDate}
          onChange={(e) => setTask({ ...task, endDate: e.target.value })}
        />
        <label htmlFor="priority">Priority</label>
        <select className="dropdown-editTask"
          id="dropdown-task-priority"
          value={task.priority}
          onChange={(e) => setTask({ ...task, priority: e.target.value })}
        >
          <option value="LOW_PRIORITY">Low</option>
          <option value="MEDIUM_PRIORITY">Medium</option>
          <option value="HIGH_PRIORITY">High</option>
        </select>
        <label htmlFor="category">Category</label>
        <select className="dropdown-editTask"
          id="dropdown-task-category"
          value={task.category}
          onChange={(e) => setTask({ ...task, category: e.target.value })}
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        {(role === "PRODUCT_OWNER" || role === "SCRUM_MASTER" || task.creator===username ) && (<button onClick={handleUpdateTask}>Update Task</button>)}
        <button onClick={() => navigate("/Home")}>Back to Scrum Board</button>
      </div>
    </div>
  );
}

export default Task;
