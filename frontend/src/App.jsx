import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Components/Register';
import Login from './Components/Login';
import Posts from './Components/Posts';
import UsersPage from './Components/UserPage';
import VideoList from './Components/VideoList';
import Profile from './Components/Profile';

// Import the UserProvider from context
import { UserProvider } from './context/UserContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    // Wrap your components with UserProvider and AuthProvider
    <AuthProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/usersPage" element={<UsersPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/posts" element={<Posts />} />
            <Route path="/" element={<VideoList />} />
          </Routes>
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
