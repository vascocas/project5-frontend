// RecycleBin.js

import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/navbar/Sidebar";
import { useNavigate } from "react-router-dom";
import { userStore } from "../stores/UserStore";
import TaskRecycle from "../components/tasks/TaskRecycle";
import UserRecycle from "../components/users/UserRecycle";
import "../index.css";
import "./RecycleBin.css";

const RecycleBin = () => {
  const { role } = userStore(state => state);
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <Header />
      <Sidebar />
      <div className="content-container">
        <h1 className="page-title">Recycle Bin</h1>
        <div className="recycle-content">
          <div className="recycle-column">
            <h2>Deleted Tasks</h2>
            <div className="taskRecycle-container">
              <TaskRecycle />
            </div>
          </div>
          {role === "PRODUCT_OWNER" && (<div className="recycle-column">
            <h2>Deleted Users</h2>
            <div className="userRecycle-container">
              <UserRecycle />
            </div>
          </div>)}
        </div>
        <div className="homeMenu-button-container">
          <button className="recycle-home-button" onClick={() => navigate("/Home")}>
            Back to Scrum Board
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecycleBin;