import requests
import base64
import json
import time
import random
import azure.cognitiveservices.speech as speechsdk
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Azure Speech Service Configurations
subscription_key = 'BsNUlZ8cElpruLAATCfj1ViP9X77hj90ilc6PX6B9FqxnNbfGuLjJQQJ99ALACYeBjFXJ3w3AAAEACOG5cyb'
region = "eastus"
language = "en-US"
voice = "Microsoft Server Speech Text to Speech Voice (en-US, JennyNeural)"

@app.route("/")
def index():
    return jsonify({"message": "Backend is running!"})

@app.route("/gettoken", methods=["POST"])
def gettoken():
    fetch_token_url = f'https://{region}.api.cognitive.microsoft.com/sts/v1.0/issueToken'
    headers = {'Ocp-Apim-Subscription-Key': subscription_key}
    response = requests.post(fetch_token_url, headers=headers)
    access_token = response.text
    return jsonify({"at": access_token})

@app.route("/gettonguetwister", methods=["POST"])
def gettonguetwister():
    tonguetwisters = [
        "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
        "She sells seashells by the seashore.",
        "We surely shall see the sun shine soon.",
        "Lesser leather never weathered wetter weather better.",
        "I scream, you scream, we all scream for ice cream.",
        "Susie works in a shoeshine shop. Where she shines she sits, and where she sits she shines.",
        "Six sticky skeletons. Six sticky skeletons. Six sticky skeletons.",
        "Black back bat. Black back bat. Black back bat.",
        "She sees cheese. She sees cheese. She sees cheese.",
        "Two tried and true tridents. Two tried and true tridents. Two tried and true tridents.",
        "Thin sticks, thick bricks. Thin sticks, thick bricks. Thin sticks, thick bricks.",
        "Truly rural. Truly rural. Truly rural.",
        "Black background, brown background",
        "Blue blood, bad blood. Blue blood, bad blood. Blue blood, bad blood.",
        "Red lorry, yellow lorry. Red lorry, yellow lorry. Red lorry, yellow lorry.",
        "I slit the sheet, the sheet I slit, and on the slitted sheet I sit"
    ]
    return jsonify({"tt": random.choice(tonguetwisters)})

@app.route("/getstory", methods=["POST"])
def getstory():
    id = int(request.json.get("id"))  # JSON input from React frontend
    stories = [
        ["Read aloud the sentences on the screen.",
         "We will follow along your speech and help you learn speak English.",
         "Good luck for your reading lesson!"],
        ["The Hare and the Tortoise",
         "Once upon a time, a Hare was making fun of the Tortoise for being so slow.",
         "\"Do you ever get anywhere?\" he asked with a mocking laugh.",
         "\"Yes,\" replied the Tortoise, \"and I get there sooner than you think. Let us run a race.\"",
         "The Hare was amused at the idea of running a race with the Tortoise, but agreed anyway.",
         "So the Fox, who had consented to act as judge, marked the distance and started the runners off.",
         "The Hare was soon far out of sight, and in his overconfidence,",
         "he lay down beside the course to take a nap until the Tortoise should catch up.",
         "Meanwhile, the Tortoise kept going slowly but steadily, and, after some time, passed the place where the Hare was sleeping.",
         "The Hare slept on peacefully; and when at last he did wake up, the Tortoise was near the goal.",
         "The Hare now ran his swiftest, but he could not overtake the Tortoise in time.",
         "Slow and Steady wins the race."],
        ["The Ant and The Dove",
         "A Dove saw an Ant fall into a brook.",
         "The Ant struggled in vain to reach the bank,",
         "and in pity, the Dove dropped a blade of straw close beside it.",
         "Clinging to the straw like a shipwrecked sailor, the Ant floated safely to shore.",
         "Soon after, the Ant saw a man getting ready to kill the Dove with a stone.",
         "Just as he cast the stone, the Ant stung the man in the heel, and he missed his aim,",
         "The startled Dove flew to safety in a distant wood and lived to see another day.",
         "A kindness is never wasted."]
    ]
    if id >= len(stories):
        return jsonify({"code": 201})
    else:
        return jsonify({"code": 200, "storyid": id, "storynumelements": len(stories[id]), "story": stories[id]})

@app.route("/ackaud", methods=["POST"])
def ackaud():
    f = request.files['audio_data']
    reftext = request.form.get("reftext")

    def get_chunk(audio_source, chunk_size=1024):
        while True:
            chunk = audio_source.read(chunk_size)
            if not chunk:
                break
            yield chunk

    referenceText = reftext
    pronAssessmentParamsJson = "{\"ReferenceText\":\"%s\",\"GradingSystem\":\"HundredMark\",\"Dimension\":\"Comprehensive\",\"EnableMiscue\":\"True\"}" % referenceText
    pronAssessmentParamsBase64 = base64.b64encode(bytes(pronAssessmentParamsJson, 'utf-8'))
    pronAssessmentParams = str(pronAssessmentParamsBase64, "utf-8")

    url = f"https://{region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language={language}&usePipelineVersion=0"
    headers = {
        'Accept': 'application/json;text/xml',
        'Connection': 'Keep-Alive',
        'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000',
        'Ocp-Apim-Subscription-Key': subscription_key,
        'Pronunciation-Assessment': pronAssessmentParams,
        'Transfer-Encoding': 'chunked',
        'Expect': '100-continue'
    }

    audioFile = f
    response = requests.post(url=url, data=get_chunk(audioFile), headers=headers)
    audioFile.close()

    # Assuming Azure API returns a JSON response with the metrics you need
    azure_response = response.json()

    # Map Azure response to your custom metrics
    metrics = {
        "accuracy": azure_response.get("accuracy", 0),  # example mapping
        "fluency": azure_response.get("fluency", 0),
        "completeness": azure_response.get("completeness", 0),
        "pronunciation": azure_response.get("pronunciation", 0)
    }

    return jsonify(metrics)

@app.route("/gettts", methods=["POST"])
def gettts():
    reftext = request.json.get("reftext")
    speech_config = speechsdk.SpeechConfig(subscription=subscription_key, region=region)
    speech_config.speech_synthesis_voice_name = voice

    speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=None)
    result = speech_synthesizer.speak_text_async(reftext).get()

    if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        audio_data = result.audio_data
        response = make_response(audio_data)
        response.headers['Content-Type'] = 'audio/wav'
        response.headers['Content-Disposition'] = 'attachment; filename=sound.wav'
        return response
    else:
        return jsonify({"success": False})

if __name__ == "__main__":
    app.run(debug=True)
