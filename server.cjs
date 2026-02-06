const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const distPath = path.join(__dirname, 'dist');

console.log('Starting minimal server...');
console.log('dist exists:', fs.existsSync(distPath));

// Middleware
app.use(express.json());

// Static files
app.use(express.static(distPath));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', distExists: fs.existsSync(distPath) });
});

// API stub (Resend disabled for now)
app.post('/api/subscribe', (req, res) => {
  console.log('Subscribe:', req.body.email);
  res.json({ success: true, message: 'Subscribed (test mode)' });
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
