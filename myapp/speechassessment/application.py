import os
import requests
import base64
import json
import random
import azure.cognitiveservices.speech as speechsdk
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
import logging

# Flask app initialization
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = app.logger

# Azure Speech Service Configurations
subscription_key = 'BsNUlZ8cElpruLAATCfj1ViP9X77hj90ilc6PX6B9FqxnNbfGuLjJQQJ99ALACYeBjFXJ3w3AAAEACOG5cyb'  
region = "eastus"
language = "en-US"
voice = "Microsoft Server Speech Text to Speech Voice (en-US, JennyNeural)"

if not subscription_key:
    raise ValueError("Azure subscription key is not set. Please add it to your .env file.")

@app.route("/")
def index():
    logger.debug("Index endpoint hit")
    return jsonify({"message": "Backend is running!"})

@app.route("/gettoken", methods=["POST"])
def gettoken():
    try:
        fetch_token_url = f'https://{region}.api.cognitive.microsoft.com/sts/v1.0/issueToken'
        headers = {'Ocp-Apim-Subscription-Key': subscription_key}
        logger.debug("Requesting Azure token")
        response = requests.post(fetch_token_url, headers=headers)
        response.raise_for_status()
        logger.debug("Token fetched successfully")
        return jsonify({"at": response.text})
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching token: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/gettonguetwister", methods=["POST"])
def gettonguetwister():
    try:
        logger.debug("Fetching random tongue twister")
        tonguetwisters = [
            "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
            "She sells seashells by the seashore.",
            "We surely shall see the sun shine soon.",
            # Additional twisters omitted for brevity...
        ]
        selected_twister = random.choice(tonguetwisters)
        logger.debug(f"Selected tongue twister: {selected_twister}")
        return jsonify({"tt": selected_twister})
    except Exception as e:
        logger.error(f"Error getting tongue twister: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/getstory", methods=["POST"])
def getstory():
    try:
        id = int(request.json.get("id", -1))
        logger.debug(f"Requested story ID: {id}")
        stories = [
            ["Read aloud the sentences on the screen.",
             "We will follow along your speech and help you learn to speak English.",
             "Good luck for your reading lesson!"],
            ["The Hare and the Tortoise",
             # Additional story content omitted for brevity...
             "Slow and Steady wins the race."],
            ["The Ant and The Dove",
             # Additional story content omitted for brevity...
             "A kindness is never wasted."]
        ]
        if id < 0 or id >= len(stories):
            logger.warning(f"Invalid story ID: {id}")
            return jsonify({"code": 201})
        else:
            logger.debug(f"Returning story for ID: {id}")
            return jsonify({"code": 200, "storyid": id, "storynumelements": len(stories[id]), "story": stories[id]}), 200
    except (ValueError, KeyError) as e:
        logger.error(f"Error in getstory: {str(e)}")
        return jsonify({"error": "Invalid input."}), 400

@app.route("/ackaud", methods=["POST"])
def ackaud():
    try:
        logger.debug("Received /ackaud request")

        # Validate request
        if 'audio_data' not in request.files or 'reftext' not in request.form:
            logger.error("Missing audio_data or reftext in the request")
            return jsonify({"error": "Missing audio_data or reftext"}), 400

        f = request.files['audio_data']
        reftext = request.form.get("reftext")
        logger.debug(f"Reference text: {reftext}")

        if f.filename == '':
            logger.error("Empty audio file uploaded")
            return jsonify({"error": "Empty audio file"}), 400

        # Define chunk generator
        def get_chunk(audio_source, chunk_size=1024):
            while True:
                chunk = audio_source.read(chunk_size)
                if not chunk:
                    break
                yield chunk

        # Build assessment parameters
        pronAssessmentParamsJson = json.dumps({
            "ReferenceText": reftext,
            "GradingSystem": "HundredMark",
            "Dimension": "Comprehensive",
            "EnableMiscue": True
        })
        logger.debug(f"Pronunciation assessment params: {pronAssessmentParamsJson}")

        pronAssessmentParamsBase64 = base64.b64encode(pronAssessmentParamsJson.encode('utf-8')).decode('utf-8')
        logger.debug(f"Encoded assessment params: {pronAssessmentParamsBase64}")

        # Azure API request
        url = f"https://{region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language={language}&usePipelineVersion=0"
        headers = {
            'Accept': 'application/json;text/xml',
            'Connection': 'Keep-Alive',
            'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000',
            'Ocp-Apim-Subscription-Key': subscription_key,
            'Pronunciation-Assessment': pronAssessmentParamsBase64,
            'Transfer-Encoding': 'chunked',
            'Expect': '100-continue'
        }
        logger.debug(f"Sending request to Azure Speech API: {url}")

        response = requests.post(url=url, data=get_chunk(f), headers=headers)
        response.raise_for_status()
        logger.debug(f"Azure API response: {response.json()}")

        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"HTTP error during Azure API request: {str(e)}")
        return jsonify({"error": "Azure API request failed", "details": str(e)}), 500
    except Exception as e:
        logger.error(f"Unexpected error in /ackaud: {str(e)}")
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

@app.route("/gettts", methods=["POST"])
def gettts():
    try:
        reftext = request.json.get("reftext")
        logger.debug(f"Received text for TTS: {reftext}")
        speech_config = speechsdk.SpeechConfig(subscription=subscription_key, region=region)
        speech_config.speech_synthesis_voice_name = voice

        speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=None)
        result = speech_synthesizer.speak_text_async(reftext).get()

        if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
            logger.debug("TTS synthesis completed successfully")
            response = make_response(result.audio_data)
            response.headers['Content-Type'] = 'audio/webm'
            response.headers['Content-Disposition'] = 'attachment; filename=sound.webm'
            return response
        else:
            logger.error("Audio synthesis failed")
            return jsonify({"success": False, "message": "Audio synthesis failed."}), 500
    except Exception as e:
        logger.error(f"Error in gettts: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    logger.info("Starting Flask app")
    app.run(debug=True)
