from flask import Flask, render_template, request, Blueprint, jsonify
import requests
import sys
import os
from datetime import datetime
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../src/')))
from formalPredict import calculate_accident_probability_normal

data_bp = Blueprint('data', __name__)

@data_bp.route('/data', methods=['POST'])
def get_data():
    # Example logic to handle the POST request
    content = request.get_json()
    if not content:
        return jsonify({"error": "No JSON data received"}), 400
    return return_model_predictions(content)

def return_model_predictions(input):
    inputLat = input.get("position").get("latitude")
    inputLon = input.get("position").get("longitude")
    inputTime = input.get("time")
    inputDate = input.get("date")
    inputConf = input.get("confidence")
    meteo = 3 # "EAU"

    # Fusionner la date et l'heure en un objet datetime
    datetime_obj = datetime.strptime(f"{inputDate} {inputTime}", "%Y-%m-%d %H:%M")

    # Convertir l'objet datetime en timestamp (en secondes)
    timestamp = datetime_obj.timestamp()

    print(input)
    prob_accident, ci_lower, ci_upper = calculate_accident_probability_normal(timestamp, meteo, inputLat, inputLon, inputConf)

    result = jsonify({
        "input": [{
            "latitude": inputLat, 
            "longitude": inputLon,
            "date": inputDate,
            "time": inputTime,
            "confidence": inputConf,
            }],
        "proba": [{
            "prob_accident": prob_accident,
            "ci_lower": ci_lower,
            "ci_upper": ci_upper,
            }]
        })
    return result
