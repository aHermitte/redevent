from weather import WeatherAPIcurrent
from dotenv import load_dotenv
import os
#from flask import Flask, render_template, request

load_dotenv()
api_key = os.getenv("API_KEY")

weather = WeatherAPIcurrent(api_key)
meteo_bdx = weather.get_weather('44.84018003833398', '-0.5774165946831533')


print(meteo_bdx)
print(meteo_bdx['visibility'])


#app = Flask(__name__)

# @app.route('/data', methods=['POST'])
# def get_data():
#     data = request.get_json()
#     latitude = data['latitude']
#     longitude = data['longitude']
#     date = data['date']
#     print(latitude)