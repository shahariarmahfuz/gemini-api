const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/ask', async (req, res) => {
  const question = req.query.ask;

  try {
    const apiResponse = await fetch('https://api.gemini.google/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        prompt: question
      })
    });

    if (!apiResponse.ok) {
      throw new Error(`Gemini API request failed with status ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    res.json({ answer: data.output });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
