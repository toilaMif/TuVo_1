import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, notesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/users'),
          axios.get('http://localhost:5000/api/notes')
        ]);
        setUsers(usersRes.data);
        setNotes(notesRes.data);
      } catch (err) {
        setError('Unable to load public data.');
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Welcome to Note Management</h2>
      <p className="lead">
        This is a public view showcasing all users and notes. You can <Link to="/login">login</Link> to manage your own notes and users.
      </p>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-md-6">
          <h3>Users</h3>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <ul className="list-group">
              {users.map((user) => (
                <li key={user._id} className="list-group-item">
                  {user.username}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="col-md-6">
          <h3>Notes</h3>
          {notes.length === 0 ? (
            <p>No notes found.</p>
          ) : (
            <ul className="list-group">
              {notes.map((note) => (
                <li key={note._id} className="list-group-item">
                  <strong>{note.title}</strong>
                  <div>{note.content}</div>
                  <small className="text-muted">by {note.user?.username || 'unknown'}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
