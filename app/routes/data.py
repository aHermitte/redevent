from flask import Flask, render_template, request, Blueprint, jsonify
import requests

data_bp = Blueprint('data', __name__)

@data_bp.route('/data', methods=['POST'])
def get_data():
    # Example logic to handle the POST request
    content = request.get_json()
    if not content:
        return jsonify({"error": "No JSON data received"}), 400
    return return_model_predictions(content)

def return_model_predictions(input):
    print(input)
    # Replace this with actual model
    result = jsonify({"incidents": [{"latitude": 44, "longitude": 44, "description": "description de l'incident"}]})
    return result
