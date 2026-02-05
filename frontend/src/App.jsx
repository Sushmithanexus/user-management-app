import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import UserList from './components/UserList';
import { isAuthenticated } from './services/api';
import './App.css';

/**
 * ProtectedRoute Component
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

/**
 * Home Component
 * Welcome page
 */
const Home = () => {
  return (
    <div className="container">
      <div className="card welcome-card">
        <h1>Welcome to User Management System</h1>
        <p>A full-stack application built with Spring Boot and React</p>
        <div className="features">
          <h3>Features:</h3>
          <ul>
            <li>User Registration & Authentication</li>
            <li>JWT-based Security</li>
            <li>Profile Management</li>
            <li>User CRUD Operations</li>
            <li>Modern & Responsive UI</li>
          </ul>
        </div>
        {!isAuthenticated() && (
          <div className="cta-buttons">
            <a href="/login" className="btn btn-primary">Login</a>
            <a href="/signup" className="btn btn-secondary">Sign Up</a>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Main App Component
 * Sets up routing and navigation
 */
function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
