import React, { useState } from "react";
import { userStore } from "../../stores/UserStore";
import { taskStore } from "../../stores/TaskStore";
import { useNavigate } from "react-router-dom";
import "./TasksBoard.css";

function TaskCard({ title, priority, taskId, state, creator }) {
    // Fetch user token and role from userStore
  const { token } = userStore();
  const { role } = userStore(state => state);
    // State variables for visibility of options and move options
  const [showOptions, setShowOptions] = useState(false);
  const [showMoveOptions, setShowMoveOptions] = useState(false);
  // State variable for selected column
  const [selectedColumn, setSelectedColumn] = useState(""); 
  const { deleteTask, updateTask } = taskStore();
  const navigate = useNavigate();

  // Determine priority class based on priority
  let priorityClass = "";
  if (priority === "LOW_PRIORITY") {
    priorityClass = "low-priority";
  } else if (priority === "MEDIUM_PRIORITY") {
    priorityClass = "medium-priority";
  } else if (priority === "HIGH_PRIORITY") {
    priorityClass = "high-priority";
  }

  // Handle Remove Task
  const handleRemove = async () => {
    const confirmation = window.confirm("Confirm delete task?");
    if (!confirmation) {
      return; // User cancelled the operation
    }
    try {
      const response = await fetch(
        `http://localhost:8080/project4vc/rest/tasks/updateDeleted/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      if (response.ok) {
        const successMessage = await response.text();
        console.log(successMessage);
        deleteTask(taskId);
      } else {
        const errorMessage = await response.text();
        console.error(errorMessage);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Handle Move Task
  const handleMove = () => {
    setShowOptions(false);
    setShowMoveOptions(true);
  };

  const handleDropdownChange = (e) => {
    setSelectedColumn(e.target.value);
  };

  // Handle Move Task Cancel
  const handleMoveCancel = () => {
    setShowMoveOptions(false); // Hide move options
    setShowOptions(true); // Show the three option buttons
  };  

  // Handle Move Task Confirmation
  const handleMoveConfirm = async () => {
    if (!selectedColumn) {
      alert("Please select a column.");
      return;
    }

    if (selectedColumn === state) {
      alert("Task is already in the selected column.");
      return;
    }

    try {
      const requestBody = JSON.stringify({
        id: taskId,
        state: selectedColumn,
      });

      const response = await fetch(
        "http://localhost:8080/project4vc/rest/tasks/status",
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
        const successMessage = await response.text();
        console.log(successMessage);
        // Hide all options after moving
        setShowMoveOptions(false);
        setShowOptions(false);
        // Update task state
        updateTask({
          id: taskId,
          state: selectedColumn,
          priority: priority,
          title: title,
          creator: creator,
        });
      } else {
        const errorMessage = await response.text();
        console.error(errorMessage);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleConsult = () => {
    taskStore.getState().setTaskId(taskId);
    setShowOptions(false);
    navigate("../Task");
  };

  // Function to generate the modified task title
  const generateTaskTitle = () => {  
    // If the creator is erased, append the suffix to the title
    if (creator == null) {
      return `${title} (Creator Erased)`;
    }
    // If the creator is not erased, return the original title
    return title;
  };

  return (
    <div
      className={`task-card ${priorityClass}`}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <div className="card-header">{generateTaskTitle()}</div>
      <div className="task-options">
        {showOptions && !showMoveOptions && (
          <>
            <button className="tasks-button" onClick={handleMove}>
              Move
            </button>
            <button className="tasks-button" onClick={handleConsult}>
              Consult
            </button>
            {(role === "PRODUCT_OWNER" || role === "SCRUM_MASTER") && (<button className="tasks-button" onClick={handleRemove}>
              Remove
            </button>)}
          </>
        )}
        {showMoveOptions && (
          <>
            <select  className="custom-select" value={selectedColumn} onChange={handleDropdownChange}>
              <option value="">Select a column</option>
              <option value="TODO">TO DO</option>
              <option value="DOING">DOING</option>
              <option value="DONE">DONE</option>
            </select>
            <button className="tasks-button" onClick={handleMoveConfirm}>
              Confirm Move
            </button>
            <button className="tasks-button" onClick={handleMoveCancel}>
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
