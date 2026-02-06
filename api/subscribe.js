// Serverless function for Vercel/Netlify deployment
// Handles email subscription to Resend Audience

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Add contact to Resend Audience
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
}
