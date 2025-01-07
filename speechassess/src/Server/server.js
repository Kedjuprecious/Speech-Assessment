const express = require("express");
const multer = require("multer");
const axios = require("axios");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Azure API Configuration
const subscriptionKey = process.env.AZURE_API_KEY;
const region = process.env.AZURE_REGION;

// Pronunciation Assessment Endpoint
const pronunciationEndpoint = `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`;

// Pronunciation Assessment Route
app.post("/assess-pronunciation", upload.single("audio"), async (req, res) => {
  try {
    const audio = req.file.buffer; // Get uploaded audio file
    const referenceText = req.body.reftext; // Get reference text from request

    // Build Pronunciation Assessment Parameters
    const pronAssessmentParams = {
      ReferenceText: referenceText,
      GradingSystem: "HundredMark",
      Dimension: "Comprehensive",
      EnableMiscue: true
    };

    const pronAssessmentParamsBase64 = Buffer.from(
      JSON.stringify(pronAssessmentParams)
    ).toString("base64");

    // Send Request to Azure
    const response = await axios.post(pronunciationEndpoint, audio, {
      headers: {
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        "Pronunciation-Assessment": pronAssessmentParamsBase64,
        "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
        "Transfer-Encoding": "chunked"
      }
    });

    // Return the response from Azure to the frontend
    res.json(response.data);
  } catch (error) {
    console.error("Error assessing pronunciation:", error.message);
    res.status(500).send("Error assessing pronunciation");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
