const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Serve the HTML file
app.use(express.static(path.join(__dirname, 'public')));

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
      'x-rapidapi-key': process.env.RAPIDAPI_KEY, // Replace with your RapidAPI key
      'x-rapidapi-host':process.env.RAPIDAPI_HOST
    }
  };

  try {
    const response = await axios.request(options);
    console.log(response.data); // Log the entire response for debugging

    // Return only the video and audio data
    const { videos, audios } = response.data;

    res.json({ videos, audios });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching video details');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
