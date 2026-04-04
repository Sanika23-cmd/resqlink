const express = require('express');
const router = express.Router();

router.post('/broadcast', (req, res) => {
  const { message, type } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const validTypes = ['warning', 'evacuation', 'all-clear', 'info'];
  const alertType = validTypes.includes(type) ? type : 'warning';

  const alertPayload = {
    message: message.trim(),
    type: alertType,
    timestamp: new Date().toISOString(),
    id: Date.now().toString()
  };

  req.app.get('io').emit('alert', alertPayload);

  console.log('Alert broadcasted:', alertPayload);

  res.json({
    success: true,
    message: 'Alert broadcasted to all connected users',
    alert: alertPayload
  });
});

module.exports = router;