const express = require('express');
const router = express.Router();

let events = {};

router.get('/', (req, res) => {
  res.json(events);
});

router.post('/', (req, res) => {
  const { id, title, date, description } = req.body;
  events[id] = { title, date, description };
  res.json({ message: 'Event added/updated successfully' });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  delete events[id];
  res.json({ message: 'Event deleted successfully' });
});

module.exports = router;
