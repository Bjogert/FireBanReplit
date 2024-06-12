const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const targetUrl = req.url.replace('/api/proxy/', '');
  try {
    const response = await fetch(targetUrl, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};