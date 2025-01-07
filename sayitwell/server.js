require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { AssemblyAI } = require('assemblyai');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY
});

app.post('/transcribe', async (req, res) => {
  try {
    const { audioUrl } = req.body;
    if (!audioUrl) {
      return res.status(400).json({ error: 'Audio URL is required' });
    }

    console.log('Transcribing audio:', audioUrl);
    const params = {
      audio: audioUrl,
      speaker_labels: true
    };

    const transcript = await client.transcripts.transcribe(params);

    if (transcript.status === 'error') {
      console.error('Transcription failed:', transcript.error);
      return res.status(500).json({ error: transcript.error });
    }

    console.log('Transcription successful:', transcript);
    res.json(transcript);
  } catch (error) {
    console.error('Error during transcription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
