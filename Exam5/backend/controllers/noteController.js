const Note = require('../models/Note');

const getNotes = async (req, res) => {
  try {
    // Public endpoint: return all notes when no user is authenticated.
    // When authenticated, return only the current user's notes.
    const filter = req.user?.id ? { user: req.user.id } : {};
    const notes = await Note.find(filter).populate('user', 'username');
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notes', error: err.message });
  }
};

const getNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id }).populate('user', 'username');
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching note', error: err.message });
  }
};

const createNote = async (req, res) => {
  try {
    const { title, content } = req.body || {};
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Check if title already exists for this user
    const existingNote = await Note.findOne({ title, user: req.user.id });
    if (existingNote) {
      return res.status(400).json({ message: 'Title already exists for this user' });
    }

    const note = new Note({ title, content, user: req.user.id });
    await note.save();
    await note.populate('user', 'username');
    res.status(201).json({ message: 'Note created successfully', note });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Title already exists for this user' });
    }
    res.status(500).json({ message: 'Error creating note', error: err.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body || {};
    const updateData = {};

    if (title) {
      // Check if new title already exists for this user
      const existingNote = await Note.findOne({
        title,
        user: req.user.id,
        _id: { $ne: req.params.id }
      });
      if (existingNote) {
        return res.status(400).json({ message: 'Title already exists for this user' });
      }
      updateData.title = title;
    }

    if (content) updateData.content = content;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true }
    ).populate('user', 'username');

    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note updated successfully', note });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Title already exists for this user' });
    }
    res.status(500).json({ message: 'Error updating note', error: err.message });
  }
};

const toggleNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    note.isActive = !note.isActive;
    await note.save();
    await note.populate('user', 'username');
    res.json({ message: 'Note status updated successfully', note });
  } catch (err) {
    res.status(500).json({ message: 'Error updating note status', error: err.message });
  }
};

module.exports = { getNotes, getNote, createNote, updateNote, toggleNote };