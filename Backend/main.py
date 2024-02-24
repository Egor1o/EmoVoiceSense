from flask import Flask, request
import numpy as np
from utils import extract_features
from librosa import load
from sklearn.neural_network import MLPClassifier
import skops.io as sio
import os
import soundfile as sf
import io


app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = os.path.join(
    app.instance_path, 
    'UploadedFiles'
)
try: 
    os.makedirs(app.config['UPLOAD_FOLDER'])
except: 
    pass 

emotions = ["Neutral", "Calm", "Happy", "Sad", "Angry", "Fearful", "Disgust", "Surprised"]
emotionsDetails = [
    "A state of emotional balance, characterized by a lack of strong feelings or expressions, often associated with a calm and composed demeanor.",
    "A serene and peaceful emotional state, marked by tranquility and a sense of inner harmony, typically experienced in the absence of stress or agitation.",
    "The feeling of joy, contentment, and positive well-being, often accompanied by smiling, laughter, and a general sense of delight.",
    "An emotional state characterized by feelings of sorrow, grief, or unhappiness, often accompanied by a sense of loss or disappointment.",
    "A strong emotional response marked by irritation, frustration, or rage, usually triggered by perceived threats, injustices, or conflicts.",
    "An emotional reaction to perceived danger or threats, involving heightened alertness, anxiety, and the instinctive urge to escape or avoid the source of fear.",
    "A visceral aversion or revulsion towards something unpleasant, offensive, or repulsive, often expressed through facial expressions and bodily reactions.",
    "An emotional response to unexpected events or stimuli, characterized by a sudden and often brief state of astonishment, wide-eyed alertness, and sometimes, a physical startle."
]

ALLOWED_EXTENSIONS = {'wav'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/api/analyze", methods=["POST"])
def hello_world():
    if 'speech' not in request.files:
        return "No file part"
    
    audioFile = request.files["speech"]

    if audioFile.filename == '':
        return "No selected file"

    if audioFile and allowed_file(audioFile.filename):
        """dest = os.path.join(
            app.config['UPLOAD_FOLDER'], 
            audioFile.filename
        )
        # Save the file on the server.
        audioFile.save(dest)
        print(dest)"""
        # Process the file
        file, sr = load(audioFile, sr=None)
        features = extract_features(file, sr=sr).reshape(1, -1)
        model = MLPClassifier(max_iter=200, hidden_layer_sizes=[200, 200])
        unknown_types = sio.get_untrusted_types(file="mlp_model.skops")
        model = sio.load("mlp_model.skops", trusted=unknown_types)
        prediction = model.predict(features)
        emotion = prediction[0]
        print("EMOTION: ", emotions[emotion])
        return emotions[emotion] + "\n" + emotionsDetails[emotion]
    else:
        return "Invalid file format. Allowed formats: .wav"