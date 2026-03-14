import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchNote = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/notes/${id}`, config);
        setNote(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load note');
      }
    };

    fetchNote();
  }, [id, navigate, token]);

  if (!token) return null;

  return (
    <div>
      <h2>Note Details</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {note ? (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{note.title}</h5>
            <p className="card-text">{note.content}</p>
            <p className="card-text">
              Created by: <strong>{note.user?.username || 'Unknown'}</strong>
            </p>
            <p className="card-text">Status: {note.isActive ? 'Active' : 'Inactive'}</p>
            <button className="btn btn-secondary" onClick={() => navigate('/notes')}>
              Back to Notes
            </button>
          </div>
        </div>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
};

export default NoteDetail;
