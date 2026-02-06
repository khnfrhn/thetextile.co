const express = require('express');
const { Resend } = require('resend');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Debug: Log paths
const distPath = path.join(__dirname, 'dist');
console.log('Server starting...');
console.log('__dirname:', __dirname);
console.log('dist path:', distPath);
console.log('dist exists:', fs.existsSync(distPath));
console.log('index.html exists:', fs.existsSync(path.join(distPath, 'index.html')));

const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(express.json());

// Serve static files with correct MIME types
app.use(express.static(distPath, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    } else if (filePath.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    } else if (filePath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    }
  }
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    distPath: distPath,
    distExists: fs.existsSync(distPath),
    indexExists: fs.existsSync(path.join(distPath, 'index.html'))
  });
});

// API endpoint for email subscription
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const response = await resend.contacts.create({
      email: email,
      audienceId: process.env.RESEND_AUDIENCE_ID,
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Successfully subscribed',
      id: response.id 
    });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ 
      error: 'Failed to subscribe',
      details: error.message 
    });
  }
});

// Serve index.html for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
