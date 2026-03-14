import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [form, setForm] = useState({ title: '', content: '' });
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (token) fetchNotes();
  }, [token]);

  const fetchNotes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notes', config);
      setNotes(res.data);
    } catch (err) {
      setError('Failed to fetch notes');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNote) {
        await axios.put(`http://localhost:5000/api/notes/${editingNote._id}`, form, config);
      } else {
        await axios.post('http://localhost:5000/api/notes', form, config);
      }
      setShowModal(false);
      setForm({ title: '', content: '' });
      setEditingNote(null);
      fetchNotes();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setForm({ title: note.title, content: note.content });
    setShowModal(true);
  };

  const handleToggle = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.patch(`http://localhost:5000/api/notes/${id}/toggle`, {}, config);
      fetchNotes();
    } catch (err) {
      setError('Failed to toggle note');
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  return (
    <div>
      <h2>Notes</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>Add Note</button>
      <div className="row">
        {notes.map(note => (
          <div key={note._id} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{note.title}</h5>
                <p className="card-text">{note.content}</p>
                <button className="btn btn-sm btn-info me-2" onClick={() => navigate(`/notes/${note._id}`)}>
                  View
                </button>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(note)}>Edit</button>
                <button className="btn btn-sm btn-secondary" onClick={() => handleToggle(note._id)}>
                  {note.isActive ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingNote ? 'Edit Note' : 'Add Note'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Content</label>
                    <textarea className="form-control" value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} required></textarea>
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

export default Notes;