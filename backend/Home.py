"""
Home - Konfigurasi utama dan route home
Library yang digunakan:
- Flask: Web framework
- Flask-CORS: Cross-origin resource sharing
"""
from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def home():
    return jsonify({"message": "Welcome to CSV Data Processor API with Python Libraries"})

