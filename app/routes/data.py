from flask import Flask, render_template, request
import requests

app = Flask(__name__)

@app.route('/data', methods=['POST'])
def get_data():
    data = request.get_json()
    latitude = data['latitude']
    longitude = data['longitude']
    date = data['date']