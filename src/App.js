import React from 'react';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import { userStore } from "./stores/UserStore";

function App() {
  const { isLoginPage, setIsLoginPage } = userStore();

  const goToLoginPage = () => {
    setIsLoginPage(true);
  };

  const goToRegisterPage = () => {
    setIsLoginPage(false);
  };

  
  return (
    <div className="App" id="outer-container">
      <div className="page-wrap" id="app-page-wrap">
        <h1>Welcome to Scrum Board</h1>
        {isLoginPage ? <Login /> : <Register />}
        {isLoginPage ? (
          <button id="appButton" onClick={goToRegisterPage}>
            Register
          </button>
        ) : (
          <button id="appButton" onClick={goToLoginPage}>
            Login
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
