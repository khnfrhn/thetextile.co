const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

console.log('=== SERVER STARTING ===');
console.log('PORT:', PORT);
console.log('dist path:', distPath);
console.log('dist exists:', fs.existsSync(distPath));
console.log('index.html path:', indexPath);
console.log('index.html exists:', fs.existsSync(indexPath));

if (fs.existsSync(distPath)) {
  console.log('dist contents:', fs.readdirSync(distPath));
}

// Middleware
app.use(express.json());

// Health check FIRST
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    distExists: fs.existsSync(distPath),
    indexExists: fs.existsSync(indexPath),
    distContents: fs.existsSync(distPath) ? fs.readdirSync(distPath) : []
  });
});

// API stub
app.post('/api/subscribe', (req, res) => {
  console.log('Subscribe:', req.body.email);
  res.json({ success: true, message: 'Subscribed (test mode)' });
});

// Static files from dist ONLY
app.use(express.static(distPath));

// SPA fallback - serve dist/index.html
app.get('*', (req, res) => {
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(500).send('index.html not found in dist folder');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`=== SERVER RUNNING ON PORT ${PORT} ===`);
});
