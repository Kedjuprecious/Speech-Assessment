const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const app = express();
const upload = multer();

const subscriptionKey = process.env.SPEECH_SERVICE_SUBSCRIPTION_KEY;
const region = process.env.SPEECH_SERVICE_REGION;
const language = "en-US";
const voice = "Microsoft Server Speech Text to Speech Voice (en-US, JennyNeural)";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public")); // For serving static files like index.html

// Routes

// Home Page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Read-Along Page
app.get("/readalong", (req, res) => {
  res.sendFile(__dirname + "/public/readalong.html");
});

// Get Token
app.post("/gettoken", async (req, res) => {
  try {
    const fetchTokenUrl = `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;
    const response = await axios.post(fetchTokenUrl, null, {
      headers: {
        "Ocp-Apim-Subscription-Key": subscriptionKey,
      },
    });
    res.json({ at: response.data });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch token" });
  }
});

// Get Tongue Twister
app.post("/gettonguetwister", (req, res) => {
  const tongueTwisters = [
    "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
    "She sells seashells by the seashore.",
    "I scream, you scream, we all scream for ice cream.",
  ];
  const randomTwister = tongueTwisters[Math.floor(Math.random() * tongueTwisters.length)];
  res.json({ tt: randomTwister });
});

// Get Story
app.post("/getstory", (req, res) => {
  const id = parseInt(req.body.id);
  const stories = [
    ["Read aloud the sentences on the screen.", "We will follow along your speech."],
    ["The Hare and the Tortoise", "Once upon a time, a Hare made fun of the Tortoise."],
  ];

  if (id >= stories.length) {
    res.json({ code: 201 });
  } else {
    res.json({
      code: 200,
      storyid: id,
      storynumelements: stories[id].length,
      story: stories[id],
    });
  }
});

// Pronunciation Assessment
app.post("/ackaud", upload.single("audio_data"), async (req, res) => {
  try {
    const audioData = req.file.buffer;
    const reftext = req.body.reftext;

    const pronAssessmentParams = {
      ReferenceText: reftext,
      GradingSystem: "HundredMark",
      Dimension: "Comprehensive",
      EnableMiscue: true,
    };

    const url = `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${language}&usePipelineVersion=0`;

    const response = await axios.post(url, audioData, {
      headers: {
        Accept: "application/json;text/xml",
        "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        "Pronunciation-Assessment": JSON.stringify(pronAssessmentParams),
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Pronunciation assessment failed" });
  }
});

// Text-to-Speech (TTS)
app.post("/gettts", async (req, res) => {
  try {
    const reftext = req.body.reftext;

    const url = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;
    const ssml = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${language}">
        <voice name="${voice}">${reftext}</voice>
      </speak>`;

    const response = await axios.post(url, ssml, {
      headers: {
        "Content-Type": "application/ssml+xml",
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        "X-Microsoft-OutputFormat": "riff-24khz-16bit-mono-pcm",
      },
      responseType: "arraybuffer",
    });

    res.set({
      "Content-Type": "audio/wav",
      "Content-Disposition": "attachment; filename=sound.wav",
    });
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ error: "Text-to-speech failed" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
