import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser, isAdmin, getStoredUser } from '../services/api';

/**
 * UserList Component
 * Display all registered users in a table
 */
const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      return;
    }

    try {
      await deleteUser(id);
      alert('User deleted successfully');
      fetchUsers(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  const currentUser = getStoredUser();
  const userIsAdmin = isAdmin();

  return (
    <div className="container">
      <div className="card">
        <h2>All Users</h2>
        {error && <div className="error-message">{error}</div>}

        {userIsAdmin && (
          <div className="info-message" style={{marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#e3f2fd', border: '1px solid #2196F3', borderRadius: '4px'}}>
            <strong>Admin Access:</strong> You can delete any user account.
          </div>
        )}

        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const canDelete = userIsAdmin || (currentUser && currentUser.userId === user.id);
                  return (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td><span className={`role-badge role-${user.role.toLowerCase()}`}>{user.role}</span></td>
                      <td>{new Date(user.createdAt).toLocaleString()}</td>
                      <td>
                        {canDelete ? (
                          <button
                            onClick={() => handleDelete(user.id, user.username)}
                            className="btn btn-danger btn-sm"
                          >
                            Delete
                          </button>
                        ) : (
                          <span style={{color: '#999', fontSize: '0.85rem'}}>No access</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
