import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, updateUser, getStoredUser } from '../services/api';

/**
 * Profile Component
 * View and update user profile
 */
const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    dateOfBirth: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userData = await getCurrentUser();
      setUser(userData);
      setFormData({
        username: userData.username,
        email: userData.email,
        password: '',
        phoneNumber: userData.phoneNumber || '',
        dateOfBirth: userData.dateOfBirth || ''
      });
    } catch (err) {
      setError('Failed to load user data');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.username || !formData.email) {
      setError('Username and email are required');
      return;
    }

    try {
      setUpdating(true);
      const storedUser = getStoredUser();
      const updateData = {
        username: formData.username,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth
      };

      // Only include password if it's being changed
      if (formData.password) {
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          return;
        }
        updateData.password = formData.password;
      }

      const response = await updateUser(storedUser.userId, updateData);
      setSuccess('Profile updated successfully!');

      // Update localStorage with new data
      const updatedUserData = response.user;
      localStorage.setItem('user', JSON.stringify({
        userId: updatedUserData.id,
        username: updatedUserData.username,
        email: updatedUserData.email,
        role: updatedUserData.role
      }));
      
      setUser(updatedUserData);
      setFormData({
        ...formData,
        password: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2>My Profile</h2>
        
        {user && (
          <div className="user-info">
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Role:</strong> <span className={`role-badge role-${user.role.toLowerCase()}`}>{user.role}</span></p>
            {user.phoneNumber && <p><strong>Phone:</strong> {user.phoneNumber}</p>}
            {user.dateOfBirth && <p><strong>Date of Birth:</strong> {new Date(user.dateOfBirth).toLocaleDateString()}</p>}
            <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleString()}</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              disabled={updating}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              disabled={updating}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
              disabled={updating}
            />
          </div>
          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              disabled={updating}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">New Password (leave blank to keep current)</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              disabled={updating}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={updating}>
            {updating ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
