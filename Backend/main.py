from flask import Flask, request
import numpy as np
from utils import extract_features
from librosa import load
from sklearn.neural_network import MLPClassifier
import skops.io as sio
import os

app = Flask(__name__)

emotions = ["Neutral", "Calm", "Happy", "Sad", "Angry", "Fearful", "Disgust", "Surprised"]

ALLOWED_EXTENSIONS = {'wav'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/analyze", methods=["POST"])
def hello_world():
    if 'speech' not in request.files:
        return "No file part"
    
    audioFile = request.files["speech"]

    if audioFile.filename == '':
        return "No selected file"

    if audioFile and allowed_file(audioFile.filename):
        # Process the file
        file, sr = load(audioFile, sr=None)
        features = extract_features(file, sr=sr).reshape(1, -1)
        model = MLPClassifier(max_iter=200, hidden_layer_sizes=[200, 200])
        unknown_types = sio.get_untrusted_types(file="mlp_model.skops")
        model = sio.load("mlp_model.skops", trusted=unknown_types)
        prediction = model.predict(features)
        emotion = prediction[0]
        return emotions[emotion]
    else:
        return "Invalid file format. Allowed formats: .wav"