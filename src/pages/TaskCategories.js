import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/navbar/Sidebar";
import { userStore } from "../stores/UserStore";
import { useNavigate } from "react-router-dom";
import "../index.css";
import "./TaskCategories.css";

const TaskCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState(null);
  const { token } = userStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories when component mounts
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/project4vc/rest/tasks/categories",
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
        const categoriesData = await response.json();
        setCategories(categoriesData);
      } else {
        throw new Error(`Failed to fetch categories: ${response.text()}`);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleEditCategory = async (categoryId, newName) => {
    setEditedCategoryName(null);
    try {
      const response = await fetch(
        `http://localhost:8080/project4vc/rest/tasks/category`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            token: token,
          },
          body: JSON.stringify({ id: categoryId, name: newName }),
        }
      );
      if (response.ok) {
        alert("Category updated successfully");
        fetchCategories();
      } else {
        console.log("Impossible to update category name");
      }
    } catch (error) {
      alert("Category with this name already exists");
    }
  };

  const handleRemoveCategory = async (categoryId) => {
    const confirmation = window.confirm("Confirm remove category?");
    if (!confirmation) {
      return; // User cancelled the operation
    }
    try {
      const response = await fetch(
        `http://localhost:8080/project4vc/rest/tasks/category/?categoryId=${categoryId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            token: token,
          },
        }
      );
      if (response.ok) {
        alert("Category removed successfully");
        fetchCategories();
      } else {
        throw new Error(`Failed to remove category: ${response.text()}`);
      }
    } catch (error) {
      console.error("Error removing category:", error);
      alert("Category with associated tasks");
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/project4vc/rest/tasks/category`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            token: token,
          },
          body: JSON.stringify({ name: newCategoryName }),
        }
      );
      if (response.ok) {
        alert("Category added successfully");
        fetchCategories();
        setNewCategoryName("");
      } else {
        throw new Error(`Failed to add category: ${response.text()}`);
      }
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Category name cannot be empty");
    }
  };

  const handleEditCategoryName = (categoryId, categoryName) => {
    setEditingCategory(categoryId);
    setEditedCategoryName(categoryName);
  };

  const handleSaveEdit = (categoryId, editedName) => {
    handleEditCategory(categoryId, editedName);
    setEditingCategory(null);
  };

  return (
    <div className="task-categories-page">
      <Header />
      <Sidebar
        pageWrapId={"categories-page-wrap"}
        outerContainerId={"task-categories-page"}
      />
      <div className="content">
      
        <main id="categories-page-wrap">
        <h1 className="page-title">Task Categories</h1>
          <table className="table-category-tasks">
            <thead className="table-header-category-tasks">
              <tr>
                <th className="table-header-category">Id</th>
                <th className="table-header-category">Name</th>
                <th className="table-header-category">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="table-row-category">{category.id}</td>
                  <td
                    className="table-row-category"
                    onDoubleClick={() =>
                      handleEditCategoryName(category.id, category.name)
                    }
                  >
                    {editingCategory === category.id ? (
                      <input
                        type="text"
                        value={editedCategoryName || category.name}
                        onChange={(e) => setEditedCategoryName(e.target.value)}
                        onBlur={() =>
                          handleSaveEdit(category.id, editedCategoryName)
                        }
                      />
                    ) : (
                      category.name
                    )}
                  </td>
                  <td>
                    <button id="categoryTableButton" onClick={() => handleRemoveCategory(category.id)}>
                      Remove Category
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="save-category-container">
            {editingCategory && (
              <button id="categoryTableButton"
                onClick={() =>
                  handleSaveEdit(editingCategory, editedCategoryName)
                }
              >
                {" "}
                Save
              </button>
            )}
          </div>
          <div className="input-category-container">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
            />
            <button onClick={handleAddCategory}>Add Category</button>
          </div>
          <div className="homeMenu-button-container">
            <button onClick={() => navigate("/Home")}>
              Back to Scrum Board
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskCategories;
