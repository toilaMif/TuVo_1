import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [token, navigate]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users', config);
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`http://localhost:5000/api/users/${editingUser._id}`, form, config);
      } else {
        await axios.post('http://localhost:5000/api/users', form);
      }
      setShowModal(false);
      setForm({ username: '', password: '' });
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({ username: user.username, password: '' });
    setShowModal(true);
  };

  const handleToggle = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.patch(`http://localhost:5000/api/users/${id}/toggle`, {}, config);
      fetchUsers();
    } catch (err) {
      setError('Failed to toggle user');
    }
  };

  return (
    <div>
      <h2>Users</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>Add User</button>
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.isActive ? 'Active' : 'Inactive'}</td>
              <td>
                <button className="btn btn-sm btn-info me-2" onClick={() => navigate(`/users/${user._id}`)}>
                  View
                </button>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(user)}>Edit</button>
                <button className="btn btn-sm btn-secondary" onClick={() => handleToggle(user._id)}>
                  {user.isActive ? 'Hide' : 'Show'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingUser ? 'Edit User' : 'Add User'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input type="text" className="form-control" value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required={!editingUser} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;