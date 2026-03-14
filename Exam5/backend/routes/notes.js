const express = require('express');
const noteController = require('../controllers/noteController');
const auth = require('../middleware/auth');

const router = express.Router();

// Public route: list all notes (read-only)
router.get('/', noteController.getNotes);

// Private routes (require authentication)
router.get('/:id', auth, noteController.getNote);    // Get specific note
router.post('/', auth, noteController.createNote);   // Create note
router.put('/:id', auth, noteController.updateNote); // Update note
router.patch('/:id/toggle', auth, noteController.toggleNote); // Toggle note status

module.exports = router;