import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${id}`, config);
        setUser(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load user');
      }
    };

    fetchUser();
  }, [id, navigate, token]);

  if (!token) return null;

  return (
    <div>
      <h2>User Details</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {user ? (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{user.username}</h5>
            <p className="card-text">Status: {user.isActive ? 'Active' : 'Inactive'}</p>
            <button className="btn btn-secondary" onClick={() => navigate('/users')}>
              Back to Users
            </button>
          </div>
        </div>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
};

export default UserDetail;
