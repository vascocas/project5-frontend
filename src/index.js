import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom'; 
import { Route, Routes } from 'react-router-dom';
import App from './App';
import Login from './pages/Login'
import Register from './pages/Register'
import ValidateUser from './pages/ValidateUser'
import ResetPassword from './pages/ResetPassword'
import Home from './pages/Home'
import Task from './pages/Task'
import Profile from './pages/Profile'
import PublicProfile from './pages/PublicProfile'
import Notifications from './pages/Notifications'
import UserManagment from './pages/UserManagment'
import TaskCategories from './pages/TaskCategories'
import RecycleBin from './pages/RecycleBin'
import Dashboard from './pages/Dashboard'
import Authorization from './Authorization';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route index element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Authorization> <Home /> </Authorization>} />
      <Route path="/validate" element={<ValidateUser />} />
      <Route path="/recovery" element={<ResetPassword />} />
      <Route path="/task" element={<Authorization> <Task /> </Authorization>} />
      <Route path="/profile" element={<Authorization> <Profile /> </Authorization>} />
      <Route path="/profile/:usernameParam" element={<Authorization> <PublicProfile /> </Authorization>} />
      <Route path="/notifications" element={<Authorization> <Notifications /> </Authorization>} />
      <Route path="/user" element={<Authorization> <UserManagment /> </Authorization>} />
      <Route path="/categories" element={<Authorization> <TaskCategories /> </Authorization>} />
      <Route path="/recycle" element={<Authorization> <RecycleBin /> </Authorization>} />
      <Route path="/dashboard" element={<Authorization> <Dashboard /> </Authorization>} />
    </Routes>
  </Router>
);
