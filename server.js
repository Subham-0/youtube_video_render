const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

// API to fetch video details
app.get('/video/details', async (req, res) => {
  const videoId = req.query.videoId;

  const options = {
    method: 'GET',
    url: 'https://youtube-media-downloader.p.rapidapi.com/v2/video/details',
    params: {
      videoId,
      videos: 'true',
      audios: 'true'
    },
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': process.env.RAPIDAPI_HOST
    }
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching video details');
  }
});

// 🔹 Proxy video download request to bypass CORS issues
app.get('/proxy', async (req, res) => {
  const videoUrl = req.query.url;
  try {
      const response = await axios.get(videoUrl, { responseType: 'stream' });

      res.setHeader("Access-Control-Allow-Origin", "*");  // Allow all origins
      res.setHeader("Content-Disposition", "attachment; filename=download.mp4");  // Force download
      res.setHeader("Content-Type", "video/mp4");

      response.data.pipe(res);
  } catch (error) {
      res.status(500).send("Failed to fetch video.");
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
