const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const util = require('util');
const textToSpeech = require('@google-cloud/text-to-speech');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Google TTS Client
const client = new textToSpeech.TextToSpeechClient();

// Generate Pronunciation Endpoint
app.post('/api/pronounce', async (req, res) => {
  try {
    const { text, languageCode, voiceGender } = req.body;

    // Configure the request
    const request = {
      input: { text },
      voice: {
        languageCode: languageCode || 'en-US',
        ssmlGender: voiceGender || 'NEUTRAL',
      },
      audioConfig: { audioEncoding: 'MP3' },
    };

    // Call the Google TTS API
    const [response] = await client.synthesizeSpeech(request);

    // Write audio to file
    const audioPath = `./audio/output.mp3`;
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(audioPath, response.audioContent, 'binary');

    // Return the file URL
    res.json({ audioUrl: `http://localhost:${port}/audio/output.mp3` });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating pronunciation');
  }
});

// Serve audio files
app.use('/audio', express.static('audio'));

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
