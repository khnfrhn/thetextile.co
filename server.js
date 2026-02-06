const express = require('express');
const path = require('path');
const fs = require('fs');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

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

// Subscribe endpoint - adds email to Resend audience
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
    
    console.log('Subscribed:', email);
    res.json({ success: true, message: 'Successfully subscribed', id: response.id });
  } catch (error) {
    console.error('Resend error:', error);
    res.status(500).json({ error: 'Failed to subscribe', details: error.message });
  }
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
