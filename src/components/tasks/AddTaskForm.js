import React, { useState, useEffect } from "react";
import { userStore } from "../../stores/UserStore";
import { taskStore } from "../../stores/TaskStore";
import languages from "../../translations";
import { IntlProvider, FormattedMessage } from "react-intl";
import { baseURL } from "../../pages/Requests";
import "./AddTaskForm.css";

function AddTaskForm() {
  const { token } = userStore();
  const locale = userStore((state) => state.locale);
  const { categories, setCategories, addTask } = taskStore();
  const [priority, setPriority] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) {
      // Get all categories to populate categories dropdown menu
      const fetchCategories = async () => {
        try {
          const response = await fetch(`${baseURL}tasks/categories`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
          });
          if (response.ok) {
            const data = await response.json();
            // Set categories in Task Store
            setCategories(data);
          } else {
            console.error("Failed to fetch categories:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };

      fetchCategories();
    }
  }, [token, setCategories]);

  // Define priority from the priority dropdown menu
  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  // Add a new task and add it to TODO column
  const handleAddTask = async () => {
    try {
      // Clear previous error message
      setMessage("");
      // Check if start and end dates are not empty
      if (!startDate || !endDate) {
        throw new Error("Please select start and end dates");
      }
      // Check if priority is empty
      if (!priority) {
        throw new Error("No priority selected");
      }
      // Creates taskDto
      const requestBody = JSON.stringify({
        title: title,
        description: description,
        priority: priority,
        startDate: startDate,
        endDate: endDate,
        category: category,
      });

      const response = await fetch(`${baseURL}tasks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: requestBody,
      });

      if (response.ok) {
        const newTask = await response.json();
        // Add task in Task Store
        addTask(newTask);
        // Clear input fields
        setTitle("");
        setDescription("");
        setPriority("");
        setStartDate("");
        setEndDate("");
        setCategory("");
      } else {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
    } catch (error) {
      // Set error message
      setMessage(error.message);
    }
  };

 // Placeholders text for title and description input field
const titlePlaceholder = languages[locale]["title-placeholder"];
const descriptionPlaceholder = languages[locale]["description-placeholder"];


  return (
    <aside className="add-task-sidebar">
      <IntlProvider locale={locale} messages={languages[locale]}>
        <div className="add-task-container">
          <h3 id="addTask-h3">
            <FormattedMessage id="addTask-title" />
          </h3>
          <div className="input-fields-container">
            <label className="labels-task-name" htmlFor="taskName">
              <FormattedMessage id="title" />
            </label>
            <input
              type="text"
              id="taskName"
              placeholder={titlePlaceholder}
              maxLength="20"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label
              className="labels-task-description"
              htmlFor="taskDescription"
            >
              <FormattedMessage id="description" />
            </label>
            <textarea
              id="taskDescription"
              placeholder={descriptionPlaceholder}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <label className="labels-task-dates" htmlFor="startDate">
              <FormattedMessage id="start-date" />
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <label className="labels-task-dates" htmlFor="endDate">
              <FormattedMessage id="end-date" />
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <label className="labels-task-priority" htmlFor="priority">
              <FormattedMessage id="priority" />
            </label>
            <div className="dropdown-priority">
              <select
                id="dropdown-task-priority"
                value={priority}
                onChange={handlePriorityChange}
              >
                <option value="">
                  <FormattedMessage id="select-priority-placeholder" />
                </option>
                <option value="LOW_PRIORITY">Low</option>
                <option value="MEDIUM_PRIORITY">Medium</option>
                <option value="HIGH_PRIORITY">High</option>
              </select>
            </div>
            <div className="dropdown-category">
              <label
                className="labels-task-category"
                htmlFor="dropdown-task-categories"
              >
                <FormattedMessage id="category-select" />
              </label>
              <select
                name="task-categories"
                id="dropdown-task-categories"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">
                  <FormattedMessage id="select-category-placeholder" />
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="add-button"></div>
              <button id="addTask" onClick={handleAddTask}>
                <FormattedMessage id="addTask-label" />
              </button>
              <p id="warningMessage">{message}</p>
            </div>
          </div>
        </div>
      </IntlProvider>
    </aside>
  );
}

export default AddTaskForm;
