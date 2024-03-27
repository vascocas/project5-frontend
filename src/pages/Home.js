import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/navbar/Sidebar";
import AddTaskForm from "../components/tasks/AddTaskForm";
import TasksBoard from "../components/tasks/TasksBoard";
import "../index.css";
import "./Home.css";

function Home() {
  return (
    <div className="Home" id="home-outer-container">
      <Header />
      <Sidebar
        pageWrapId={"home-page-wrap"}
        outerContainerId={"home-outer-container"}
      />
      <div className="page-wrap" id="home-page-wrap">
        <h1 className="page-title">Scrum Board</h1>
        <div className="content-wrapper">
          <div className="add-task-form">
            <AddTaskForm />
          </div>
          <div className="tasks-board">
            <TasksBoard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
